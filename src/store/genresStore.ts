import {storage} from "./store";
import type {IStoreState} from "../interfaces/app/IStoreState";
import {LoadingState} from "../enums/LoadingState";
import type {AxiosResponse} from "axios"
import axios from "axios";
import type ITrack from "../interfaces/api/ITrack";
import type IArtist from "../interfaces/api/IArtist";
import type IGenresData from "../interfaces/app/IGenresData";
import type IGenre from "../interfaces/app/IGenre";

const genresStore = storage<IStoreState<IGenresData>>("genres", {data: null, loading: LoadingState.Idle, error: null})

let genres: IStoreState<IGenresData>

async function fetchData(accessToken: string): Promise<IStoreState<IGenresData> | undefined> {
    return new Promise<IStoreState<IGenresData> | undefined>((resolve) => {
        try {
            // Get value from writable
            genresStore.subscribe((value) => {
                genres = value;
            });

            if (genres.data != null) {
                // If data cached in localStorage then return it
                resolve(genres)
            }

            // If the data is not cached, fetch it from the API
            genresStore.set({data: null, loading: LoadingState.Pending, error: null})

            const stringToColor = (str: string) => {
                let hash = 0;
                for (let i = 0; i < str.length; i++) {
                    hash = str.charCodeAt(i) + ((hash << 3) - hash);
                }
                const color = Math.abs(hash).toString(16).substring(0, 6);

                return "#" + '000000'.substring(0, 6 - color.length) + color;
            }


            // get user 50 top artists
            const p1 = axios.get('https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50', {
                headers: {
                    "Authorization": 'Bearer ' + accessToken
                }
            }).then((r: AxiosResponse<{ items: IArtist[] }>) => r.data.items)

            // get user 500 top tracks
            const p2 = axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=1000', {
                headers: {
                    "Authorization": 'Bearer ' + accessToken
                }
            }).then((r: AxiosResponse<{ items: ITrack[] }>) => r.data.items)

            Promise.all([p1, p2]).then((val: [IArtist[], ITrack[]]) => {
                const topGenres: string[] = []

                for (let i = 0; i < val[0].length; i++) {
                    for (let j = 0; j < val[0][i].genres.length; j++) {
                        topGenres.push(val[0][i].genres[j])
                    }
                }

                // count duplicated genres
                const count = topGenres.reduce((ac: any, a: any) => (ac[a] = ac[a] + 1 || 1, ac), {})
                //
                let result: IGenre[] = []
                Object.keys(count).forEach(key => {
                    result.push({
                        name: key,
                        color: '',
                        presencePercent: ((count[key]/topGenres.length)*100).toFixed(2)+'%',
                        numberOfArtists: count[key]
                    })
                });
                result = result.sort(({numberOfArtists:a}, {numberOfArtists:b}) => b-a).slice(0,10)
                result.forEach((el) => {
                    el.color = stringToColor(el.name)
                })

                genres.data = {
                    topGenres: result,
                    bestGenre: result[0]
                }

                genresStore.set(genres)
                resolve(genres)
            })

        } catch (error: any) {
            genresStore.set({data: null, loading: LoadingState.Failed, error: error.message});
            throw(error.message)
        }
    })
}

export const getGenresData = (accessToken: string) => fetchData(accessToken);