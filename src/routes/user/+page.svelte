<script lang="ts">
    import {appAuthState} from "../../store/store";
    import axios from "axios";
    import type {AxiosResponse} from 'axios';
    import type IUser from "../../interfaces/IUser";
    import type IArtist from "../../interfaces/IArtist";
    import type ITrack from "../../interfaces/ITrack";

    let user: IUser
    let artists: IArtist[] = []
    let tracks: ITrack[] = []
    let artistsIds: string[]
    let artistsFull: IArtist[] = []

    axios.get('https://api.spotify.com/v1/me', {
        headers: {
            "Authorization": 'Bearer ' + $appAuthState.accessToken
        }
    }).then((r: AxiosResponse<IUser>) => user = r.data);

    axios.get('https://api.spotify.com/v1/me/top/artists?limit=10', {
        headers: {
            "Authorization": 'Bearer ' + $appAuthState.accessToken
        }
    }).then((r: AxiosResponse<{ items: IArtist[] }>) => {
        artists = r.data.items
        artistsIds = artists.map(a => a.id)
        let artistsIdsString = artistsIds.join(',')

        axios.get(`https://api.spotify.com/v1/artists?ids=${artistsIdsString}`, {
            headers: {
                "Authorization": 'Bearer ' + $appAuthState.accessToken
            }
        }).then((r: AxiosResponse<{ artists: IArtist[] }>) => {
            artistsFull = r.data.artists
            console.log(artistsFull)
        });
    });

    axios.get('https://api.spotify.com/v1/me/top/tracks?limit=10', {
        headers: {
            "Authorization": 'Bearer ' + $appAuthState.accessToken
        }
    }).then((r: AxiosResponse<{ items: ITrack[] }>) => tracks = r.data.items);

</script>

<div class="user">
    <!--    <h1>{$appAuthState.state}</h1>-->
    <!--    <h1>{$appAuthState.accessToken}</h1>-->
    <!--    <h1>{$appAuthState.authCode}</h1>-->
    <!--    <h1>{$appAuthState.refreshToken}</h1>-->
    {#if user && artists && tracks}
        <div>
            <h1>Welcome, {user.display_name}!</h1>
            <img src="{user.images[0].url}"/>
        </div>
        <div>
            <h1>Your top artists:</h1>
            {#each artists as artist}
                <div class="artist">
                    <img src="{artist.images[0].url}" height="50px" width="50px"/>
                    <div>{artist.name}</div>
                </div>
            {/each}
        </div>
        <div>
            <h1>Your top tracks:</h1>
            {#each tracks as track}
                <div class="track">
                    <img src="{track.album.images[0].url}" height="50px" width="50px"/>
                    <div>
                        <div>{track.name}</div>
                        <div class="artist">
                            {#each track.artists as artist}
                                <div>{artist.name}</div>
                            {/each}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
        <div>
            <h1>Your top genres:</h1>
            <div>
            {#each artistsFull as artist}
                {#each artist.genres as genre}
                    <p>{genre}</p>
                {/each}
            {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    .user {
        padding: 50px;
        display: flex;
        gap: 50px;
    }

    .artist {
        display: flex;
        color: #7f7f7f;
        gap: 5px;
    }

    .track {
        display: flex;
        color: white;
        gap: 5px;
    }
</style>