import type IUser from "../interfaces/api/IUser";
import {storage} from "./store";
import type {IStoreState} from "../interfaces/app/IStoreState";
import {LoadingState} from "../enums/LoadingState";
import type {AxiosError, AxiosResponse} from "axios"
import axios from "axios";
import type ITrack from "../interfaces/api/ITrack";
import type IArtist from "../interfaces/api/IArtist";
import type IUserData from "../interfaces/app/IUserData";
import {exchangeAuthCodeForAccessAndRefreshTokens, exchangeRefreshTokenForAccessToken} from "./authStore";

const initialState: IStoreState<IUserData> = {
    data: null,
    loading: LoadingState.Idle,
    error: null
};

// Create a storage
const userStore = storage<IStoreState<IUserData>>("user", initialState)

let user: IStoreState<IUserData>

async function fetchData(accessToken: string): Promise<IStoreState<IUserData> | undefined> {
    return new Promise<IStoreState<IUserData> | undefined>((resolve) => {
        try {
            // Get value from writable
            userStore.subscribe((value) => {
                user = value;
            });

            if (user.data != null) {
                // If data cached in localStorage then return it
                resolve(user)
            }
            else {
                // If the data is not cached, fetch it from the API
                userStore.set({data: null, loading: LoadingState.Pending, error: null})

                // get user info
                const p1 = axios.get('https://api.spotify.com/v1/me', {
                    headers: {
                        "Authorization": 'Bearer ' + accessToken
                    }
                }).then((r: AxiosResponse<IUser>) => r.data)

                // get user top tracks
                const p2 = axios.get('https://api.spotify.com/v1/me/top/tracks?limit=10', {
                    headers: {
                        "Authorization": 'Bearer ' + accessToken
                    }
                }).then((r: AxiosResponse<{ items: ITrack[] }>) => r.data.items)

                // get user top artists
                const p3 = axios.get('https://api.spotify.com/v1/me/top/artists?limit=10', {
                    headers: {
                        "Authorization": 'Bearer ' + accessToken
                    }
                }).then((r: AxiosResponse<{ items: IArtist[] }>) => r.data.items)

                // when all 3 promises completed update userStore
                Promise.all([p1,p2,p3]).then((val: [IUser, ITrack[], IArtist[]] ) => {
                    userStore.set({data: {...val[0], topTracks: val[1], topArtists: val[2]}, loading: LoadingState.Succeeded, error: null})
                    resolve(user)
                }).catch((er) => {
                    if (er.response.data.error.message.includes('token')) {
                        console.log('access token expired. obtaining new one')
                        exchangeRefreshTokenForAccessToken()
                    }
                })
            }
        } catch (error: any) {
            userStore.set({data: null, loading: LoadingState.Failed, error: error.message});
            throw(error.message)
        }
    })
}

// Export the fetch function for use in components
export const getUserData = (accessToken: string) => fetchData(accessToken);