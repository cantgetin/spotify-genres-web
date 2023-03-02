import {storage} from "./store";
import type {IStoreState} from "../interfaces/app/IStoreState";
import {LoadingState} from "../enums/LoadingState";
import type {AxiosError, AxiosResponse} from "axios"
import axios from "axios";
import type IPlaylistsData from "../interfaces/app/IPlaylistsData";
import type IPlaylist from "../interfaces/api/IPlaylist";
import {exchangeRefreshTokenForAccessToken} from "./authStore";
import type ITrack from "../interfaces/api/ITrack";
import {dateDiffInDays} from "../utils/dateDiff";

const initialState: IStoreState<IPlaylistsData> = {
    data: null,
    loading: LoadingState.Idle,
    error: null,
    dateLoaded: null
};

// Create a storage
const playlistsStore = storage<IStoreState<IPlaylistsData>>("playlists", initialState)

let playlists: IStoreState<IPlaylistsData>

async function fetchData(accessToken: string): Promise<IStoreState<IPlaylistsData> | undefined> {
    return new Promise<IStoreState<IPlaylistsData> | undefined>((resolve) => {
        try {
            // Get value from writable
            playlistsStore.subscribe((value) => {
                playlists = value;
            });

            if (playlists.data != null && dateDiffInDays(new Date, new Date(Date.parse(playlists.dateLoaded!.toString()))) < 2) {
                // If data cached in localStorage then return it
                resolve(playlists)
            } else {
                // If the data is not cached, fetch it from the API
                playlistsStore.set({data: null, loading: LoadingState.Pending, error: null, dateLoaded: null})

                // get user playlists
                const p1 = axios.get('https://api.spotify.com/v1/me/playlists?limit=20', {
                    headers: {
                        "Authorization": 'Bearer ' + accessToken
                    }
                }).then((r: AxiosResponse<{ items: IPlaylist[] }>) => r.data.items)

                // get user 0-50 top tracks
                const p2 = axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50', {
                    headers: {
                        "Authorization": 'Bearer ' + accessToken
                    }
                }).then((r: AxiosResponse<{ items: ITrack[] }>) => r.data.items)

                // get user 50-100 top tracks
                const p3 = axios.get('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=100&offset=49', {
                    headers: {
                        "Authorization": 'Bearer ' + accessToken
                    }
                }).then((r: AxiosResponse<{ items: ITrack[] }>) => r.data.items)


                Promise.all([p1, p2, p3]).then((r: [IPlaylist[], ITrack[], ITrack[]]) => {

                    const userPlaylists: IPlaylist[] = r[0]
                    const userTopTracks: ITrack[] = r[1].concat(r[2])

                    // fetch tracks from every playlist
                    const promises = []
                    for (let i = 0; i < userPlaylists.length; i++) {
                        userPlaylists[i].popularity = 0
                        promises.push(axios.get(userPlaylists[i].tracks.href + '?fields=items(track(id))&limit=100', {
                            headers: {
                                "Authorization": 'Bearer ' + accessToken
                            }
                        }).then((r: AxiosResponse<{ items: { track: { id: string } }[] }>) => {
                            return {tracks: r.data.items, id: userPlaylists[i].id}
                        }))
                    }

                    // getting N<50 tracks from each playlist
                    Promise.all(promises).then((r: { tracks: { track: { id: string } }[], id: string }[]) => {
                        // for each items: tracks[] of each playlist
                        for (let i = 0; i < r.length; i++) {
                            for (let j = 0; j < r[i].tracks.length; j++) {
                                // check if top tracks contain any track of playlist
                                if (userTopTracks.filter(e => e.id === r[i].tracks[j].track.id).length > 0) {
                                    // top tracks contains track from playlist, add score +1 for that playlist
                                    const playlist = userPlaylists.find(el => el.id == r[i].id)
                                    if (playlist) {
                                        playlist.popularity++;
                                    }
                                }
                            }
                        }


                        playlistsStore.set({
                            data: {
                                mostListenedPlaylist: userPlaylists.reduce((prev, current) => (prev.popularity > current.popularity) ? prev : current),
                                topPlaylists: userPlaylists
                            },
                            loading: LoadingState.Succeeded,
                            error: null,
                            dateLoaded: new Date()
                        })

                        resolve(playlists)
                    })
                }).catch(er => {
                    if (er.response.data.error.message.includes('token')) {
                        console.log('access token expired. obtaining new one')
                        exchangeRefreshTokenForAccessToken()
                    }
                })
            }
        } catch (error: any) {
            playlistsStore.set({data: null, loading: LoadingState.Failed, error: error.message, dateLoaded: null});
            throw(error.message)
        }
    })
}

// Export the fetch function for use in components
export const getPlaylistsData = (accessToken: string) => fetchData(accessToken);