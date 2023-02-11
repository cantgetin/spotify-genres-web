<script lang="ts">
    import { page } from '$app/stores'
    import {appAuthState} from "../../store/store";

    const code = $page.url.searchParams.get('code')
    const state = $page.url.searchParams.get('state')

    const isCorrectState = appAuthState.getAppState() == state

    if (isCorrectState) appAuthState.setUserToken(code)

    // alert(state)
    // alert(appAuthState.getAppState())
</script>

<div>
    {#if isCorrectState}
        <h1>authorized! wtf</h1>
        <h2>Code: {code}</h2>
        <h2>State: {state}</h2>
    {:else}
        <h1>Something went wrong, try again</h1>
    {/if}
</div>