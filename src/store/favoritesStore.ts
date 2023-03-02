import {storage} from "./store";
import type {IStoreState} from "../interfaces/app/IStoreState";
import {LoadingState} from "../enums/LoadingState";
import type {AxiosResponse} from "axios"
import axios from "axios";
import type ITrack from "../interfaces/api/ITrack";
import type IFavoritesData from "../interfaces/app/IFavoritesData";
import {exchangeRefreshTokenForAccessToken} from "./authStore";
import {dateDiffInDays} from "../utils/dateDiff";

const initialState: IStoreState<IFavoritesData> = {
    data: null,
    loading: LoadingState.Idle,
    error: null,
    dateLoaded: null
};

// Create a storage
const favoritesStore = storage<IStoreState<IFavoritesData>>("favorites", initialState)
//https://api.spotify.com/v1/me/tracks

let favorites: IStoreState<IFavoritesData>

async function fetchData(accessToken: string): Promise<IStoreState<IFavoritesData> | undefined> {
    return new Promise<IStoreState<IFavoritesData> | undefined>((resolve) => {
        try {
            // Get value from writable
            favoritesStore.subscribe((value) => {
                favorites = value;
            });

            if (favorites.data != null && dateDiffInDays(new Date, new Date(Date.parse(favorites.dateLoaded!.toString()))) < 2) {
                // If data cached in localStorage and it's fresh then return it
                resolve(favorites)
            } else {
                // If the data is not cached, fetch it from the API
                favoritesStore.set({data: null, loading: LoadingState.Pending, error: null, dateLoaded: null})

                axios.get('https://api.spotify.com/v1/me/tracks', {
                    headers: {
                        "Authorization": 'Bearer ' + accessToken
                    }
                }).then((r: AxiosResponse<{ items: { track: ITrack }[] }>) => {

                    favoritesStore.set({
                        data: {
                            topTrack: r.data.items[0].track,
                            topTracks: r.data.items.slice(0, 10)
                        },
                        loading: LoadingState.Succeeded,
                        error: null,
                        dateLoaded: new Date()
                    })

                    resolve(favorites)
                }).catch(er => {
                    if (er.response.data.error.message.includes('token')) {
                        console.log('access token expired. obtaining new one')
                        exchangeRefreshTokenForAccessToken()
                    }
                })

            }
        } catch (error: any) {
            favoritesStore.set({data: null, loading: LoadingState.Failed, error: error.message, dateLoaded: null});
            throw(error.message)
        }
    })
}

// Export the fetch function for use in components
export const getFavoritesData = (accessToken: string) => fetchData(accessToken);