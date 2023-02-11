<script lang="ts">
    import {appAuthState} from "../store/store";
    import { goto } from '$app/navigation';

    const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    const login = () => {
        let client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        let redirect_uri = 'http://localhost:5173/authorized';
        let state = genRanHex(16);
        let scope = 'user-read-private user-read-email user-top-read playlist-read-private';

        appAuthState.setAppState(state)

        let href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}`;
        goto(href);
    }

</script>

<div>
    <h1>Welcome to Spotify Genres</h1>
    <button on:click={login}>Click to authorize</button>
</div>

<style>

</style>