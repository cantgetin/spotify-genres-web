<script>
    import '../app.css'
    import {goto} from "$app/navigation";
    import PageTransition from "../components/PageTransition.svelte";

    /** @type {import('./$types').LayoutData} */
    export let data

    const routes = ['/user', '/genres', '/playlists', '/favorites']
    let index = routes.indexOf(data.pathname)

    const navigate = (path) => {
        index = routes.indexOf(path)
        goto(path)
    }

</script>

<div class="layout">
    {#if routes.indexOf(data.pathname) !== -1}
        <nav class="nav">
            <a on:click={() => navigate('/user')} class={index === 0 ? 'navItemSelected' : 'navItem'}>User</a>
            <a on:click={() => navigate('/genres')} class={index === 1 ? 'navItemSelected' : 'navItem'}>Genres</a>
            <a on:click={() => navigate('/playlists')} class={index === 2 ? 'navItemSelected' : 'navItem'}>Playlists</a>
            <a on:click={() => navigate('/favorites')} class={index === 3 ? 'navItemSelected' : 'navItem'}>Favorites</a>
        </nav>
    {/if}
    <PageTransition pathname={data.pathname}>
        <slot/>
    </PageTransition>
</div>

<style lang="scss">
  .layout {
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  .nav {
    position: absolute;
    display: flex;
    cursor: pointer;
    z-index: 20;
  }

  .navItem {
    color: white;
    text-decoration: none;
    padding: 10px;
    display: block;
    transition: 0.5s;

    &:hover {
      background: white;
      color: black;
    }
  }

  .navItemSelected {
    background: white;
    color: black;
    padding: 10px;
    display: block;
  }
</style>