<script lang="ts">
    import {page} from '$app/stores'
    import {appAuthState} from "../../store/store";
    import axios from "axios";
    import qs from 'qs';
    import {goto} from "$app/navigation";

    const code = $page.url.searchParams.get('code')
    const state = $page.url.searchParams.get('state')
    const error = $page.url.searchParams.get('error')

    const isCorrectState = appAuthState.getAppState() == state

    if (isCorrectState && !error) {
        appAuthState.setAuthCode(code)
        const authBase64EncodedString = btoa(import.meta.env.VITE_SPOTIFY_CLIENT_ID + ':' + import.meta.env.VITE_SPOTIFY_CLIENT_SECRET)

        const data = {
            code: code,
            redirect_uri: 'http://localhost:5173/authorize',
            grant_type: 'authorization_code'
        };
        const options = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + authBase64EncodedString
            },
            data: qs.stringify(data),
            url: 'https://accounts.spotify.com/api/token'
        };
        axios(options).then(r => {
            appAuthState.setAccessToken(r.data.access_token)
            appAuthState.setRefreshToken(r.data.refresh_token)
        });
        goto('/user')
    }
</script>

<div class="authorize">
    {#if isCorrectState && !error}
        <h1>Authorized!</h1>
    {:else}
        <h1>Something went wrong, try again! {error}</h1>
    {/if}
</div>

<style>
    .authorize {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
</style>