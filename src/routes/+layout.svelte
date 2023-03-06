<script>
    import '../app.css'
    import {goto} from "$app/navigation";
    import PageTransition from "../components/PageTransition.svelte";

    /** @type {import('./$types').LayoutData} */
    export let data

    const routes = [
        {name: "User", path: "/user"},
        {name: "Genres", path: "/genres"},
        {name: "Playlists", path: "/playlists"},
        {name: "Favorites", path: "/favorites"},
    ]

</script>

<div class="layout">
    {#if routes.find(r => r.path === data.pathname)}
        <nav class="nav">
            {#each routes as route}
                <a on:click={() => goto(route.path)}
                   class={data.pathname === route.path ? 'navItemSelected' : 'navItem'}>
                    {route.name}
                </a>
            {/each}
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
    background: #121212;
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