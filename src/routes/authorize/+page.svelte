<script lang="ts">
    import {page} from '$app/stores'
    import {authorizeResponse, exchangeAuthCodeForAccessAndRefreshTokens} from "../../store/authStore";
    import {goto} from "$app/navigation";

    const code = $page.url.searchParams.get('code')
    const state = $page.url.searchParams.get('state')
    let error = $page.url.searchParams.get('error')

    if (code == null && state == null && error == null) goto('/')

    const isCorrectState = authorizeResponse(code, state, error)
    if (isCorrectState) {
        exchangeAuthCodeForAccessAndRefreshTokens(code)
    }

</script>

<svelte:head>
    <title>Authorization..</title>
    <html lang="en" />
</svelte:head>

<div class="authorize">
    {#if isCorrectState && !error}
        <h1>Authorized!</h1>
    {:else}
        <h1>Something went wrong, try again!</h1>
        <p>{error}</p>
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