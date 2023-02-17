import {storage} from "./store";
import type {IStoreState} from "../interfaces/app/IStoreState";
import {LoadingState} from "../enums/LoadingState";
import type {AxiosResponse} from "axios"
import axios from "axios";
import type ITrack from "../interfaces/api/ITrack";
import type IArtist from "../interfaces/api/IArtist";
import type IGenresData from "../interfaces/app/IGenresData";
import type IGenre from "../interfaces/app/IGenre";
import stc from 'string-to-color'
import {exchangeRefreshTokenForAccessToken} from "./authStore";

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
            } else {
                // If the data is not cached, fetch it from the API
                genresStore.set({data: null, loading: LoadingState.Pending, error: null})

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

                    let userTopArtists: IArtist[] = val[0]
                    const userTopTracks: ITrack[] = val[1]
                    let artistsFromTopTracksIds: string[] = []

                    // getting artist ids from top tracks
                    for (let i = 0; i < userTopTracks.length; i++) {
                        for (let j = 0; j < userTopTracks[i].artists.length; j++) {
                            artistsFromTopTracksIds.push(userTopTracks[i].artists[j].id)
                        }
                    }

                    // remove duplicated ids
                    artistsFromTopTracksIds = [...new Set(artistsFromTopTracksIds)];

                    const artistsIdsString = (artistsFromTopTracksIds.length > 50) ? artistsFromTopTracksIds.slice(0,50).join(',') : artistsFromTopTracksIds.join(',')

                    // getting artists from top tracks from api
                    axios.get(`https://api.spotify.com/v1/artists?ids=${artistsIdsString}`, {
                        headers: {
                            "Authorization": 'Bearer ' + accessToken
                        }
                    }).then((r: AxiosResponse<{ artists: IArtist[] }>) => {
                        userTopArtists = userTopArtists.concat(r.data.artists)
                        // adding genres
                        const topGenres: string[] = []

                        for (let i = 0; i < userTopArtists.length; i++) {
                            for (let j = 0; j < userTopArtists[i].genres.length; j++) {
                                topGenres.push(userTopArtists[i].genres[j])
                            }
                        }

                        // count duplicated genres
                        const count = topGenres.reduce((ac: any, a: any) => (ac[a] = ac[a] + 1 || 1, ac), {})

                        let result: IGenre[] = []
                        Object.keys(count).forEach(key => {
                            result.push({
                                name: key,
                                color: '',
                                presencePercent: ((count[key] / topGenres.length) * 100).toFixed(2) + '%',
                                numberOfArtists: count[key]
                            })
                        });
                        result = result.sort(({numberOfArtists: a}, {numberOfArtists: b}) => b - a).slice(0, 10)
                        result.forEach((el) => {
                            el.color = stc(el.name)
                        })

                        genres.data = {
                            topGenres: result,
                            bestGenre: result[0]
                        }

                        genresStore.set(genres)
                        resolve(genres)
                    });
                }).catch(er => {
                    if (er.response.data.error.message.includes('token')) {
                        console.log('access token expired. obtaining new one')
                        exchangeRefreshTokenForAccessToken()
                    }
                })
            }
        } catch (error: any) {
            genresStore.set({data: null, loading: LoadingState.Failed, error: error.message});
            throw(error.message)
        }
    })
}

export const getGenresData = (accessToken: string) => fetchData(accessToken);