<script lang="ts">
    import {page} from '$app/stores'
    import {appAuthState} from "../../store/store";
    import axios from "axios";
    import qs from 'qs';

    const code = $page.url.searchParams.get('code')
    const state = $page.url.searchParams.get('state')
    // error	The reason authorization failed, for example: “access_denied”
    const error = $page.url.searchParams.get('error')

    const isCorrectState = appAuthState.getAppState() == state

    // An authorization code that can be exchanged for an Access Token.
    if (isCorrectState) appAuthState.setAuthCode(code)

    if (isCorrectState && !error) {

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
    }
</script>

<div class="authorize">
    {#if isCorrectState && !error}
        <div class="authorized">
            <h1>Authorized!</h1>
            <h2>Code: {appAuthState.getAuthCode()}</h2>
            <h2>State: {appAuthState.getAppState()}</h2>
            <h2>Access token: {appAuthState.getAccessToken()}</h2>
            <h2>Refresh token: {appAuthState.getRefreshToken()}</h2>
        </div>
    {:else}
        <h1>Something went wrong, try again!</h1>
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

    .authorized {
        width: 500px;
        overflow: hidden;
        font-size: 15px;
    }
</style>