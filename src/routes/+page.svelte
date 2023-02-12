<script lang="ts">
    import {appAuthState} from "../store/store";
    import {goto} from '$app/navigation';
    const login = () => {
        const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
        let client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        let redirect_uri = 'http://localhost:5173/authorize';
        let state = genRanHex(16);
        let scope = 'user-read-private user-read-email user-top-read playlist-read-private';

        appAuthState.setAppState(state)

        let href = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${scope}&redirect_uri=${redirect_uri}&state=${state}`;
        goto(href);
    }

    if (appAuthState.getAccessToken() != undefined){
        goto('/user')
    }
</script>

<div class="app">
    <div>
        <h1>Welcome to Spotify Genres</h1>
        <button on:click={login}>Click to authorize</button>
    </div>
</div>

<style>
    .app {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    h1 {
        font-size: 48px;
    }
    button {
        color: #121212;
        display: block;
        margin:20px auto;
        font-size: 20px;
        padding: 10px 20px;
        background: #1ed760;
        border: none;
        border-radius: 25px;
        cursor: pointer;
    }
    button:hover {
        transform: scale(104%);
    }
</style>