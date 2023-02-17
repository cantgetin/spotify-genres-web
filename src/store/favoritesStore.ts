import {storage} from "./store";
import type {IStoreState} from "../interfaces/app/IStoreState";
import {LoadingState} from "../enums/LoadingState";
import type {AxiosResponse} from "axios"
import axios from "axios";
import type ITrack from "../interfaces/api/ITrack";
import type IFavoritesData from "../interfaces/app/IFavoritesData";
import {exchangeRefreshTokenForAccessToken} from "./authStore";

const initialState: IStoreState<IFavoritesData> = {
    data: null,
    loading: LoadingState.Idle,
    error: null
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

            if (favorites.data != null) {
                // If data cached in localStorage then return it
                resolve(favorites)
            }
            else {
                // If the data is not cached, fetch it from the API
                favoritesStore.set({data: null, loading: LoadingState.Pending, error: null})

                axios.get('https://api.spotify.com/v1/me/tracks', {
                    headers: {
                        "Authorization": 'Bearer ' + accessToken
                    }
                }).then((r: AxiosResponse<{items: { track: ITrack }[]}>) => {

                    favorites.data = {
                        topTrack : r.data.items[0].track,
                        topTracks : r.data.items.slice(0,10)
                    }

                    console.log('lol')
                    favoritesStore.set(favorites)
                    resolve(favorites)
                }).catch(er => {
                    console.log(er)
                    if (er.response.data.error.message.includes('token')) {
                        console.log('access token expired. obtaining new one')
                        exchangeRefreshTokenForAccessToken()
                    }
                })
                
            }
        } catch (error: any) {
            favoritesStore.set({data: null, loading: LoadingState.Failed, error: error.message});
            throw(error.message)
        }
    })
}

// Export the fetch function for use in components
export const getFavoritesData = (accessToken: string) => fetchData(accessToken);