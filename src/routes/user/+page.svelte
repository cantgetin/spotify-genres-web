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

    axios.get('https://api.spotify.com/v1/me', {
        headers: {
            "Authorization": 'Bearer ' + appAuthState.getAccessToken()
        }
    }).then((r: AxiosResponse<IUser>) => user = r.data);

    axios.get('https://api.spotify.com/v1/me/top/artists?limit=10', {
        headers: {
            "Authorization": 'Bearer ' + appAuthState.getAccessToken()
        }
    }).then((r: AxiosResponse<{items: IArtist[]}>) => artists = r.data.items);

    axios.get('https://api.spotify.com/v1/me/top/artists?limit=10', {
        headers: {
            "Authorization": 'Bearer ' + appAuthState.getAccessToken()
        }
    }).then((r: AxiosResponse<{items: IArtist[]}>) => artists = r.data.items);

    axios.get('https://api.spotify.com/v1/me/top/tracks?limit=10', {
        headers: {
            "Authorization": 'Bearer ' + appAuthState.getAccessToken()
        }
    }).then((r: AxiosResponse<{items: ITrack[]}>) => tracks = r.data.items);

</script>

<div class="user">
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
                    <div>{track.name}</div>
                </div>
            {/each}
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
        display: flex
    }
</style>