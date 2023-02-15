<script lang="ts">
    import {goto} from '$app/navigation';
    import {authorize, authStore} from "../store/authStore";

    if ($authStore.accessToken != ''){
        goto('/user')
    }
</script>

<div class="app">
    <div>
        <h1>Welcome to Spotify Genres</h1>
        <button on:click={authorize}>Click to authorize</button>
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