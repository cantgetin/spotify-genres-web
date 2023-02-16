<script>
    import '../app.css'
    import {goto} from "$app/navigation";
    import PageTransition from "../components/PageTransition.svelte";
    import ArrowRight from "../components/ArrowRight.svelte";
    import ArrowLeft from "../components/ArrowLeft.svelte";

    /** @type {import('./$types').LayoutData} */
    export let data

    const routes = ['user', 'genres', 'playlists', 'favorites']
    let index = 0

    const goLeft = () => {
        if (index > 0) {
            index--;
            goto(routes[index])
        }
    }
    const goRight = () => {
        if (index < routes.length - 1) {
            index++;
            goto(routes[index])
        }
    }

    const navigate = (path) => {
        index = routes.indexOf(path)
        goto('/'+path)
    }

</script>

<div class="layout">
    <nav class="nav">
        <a on:click={() => navigate('user')} class={index === 0 ? 'navItemSelected' : 'navItem'}>User</a>
        <a on:click={() => navigate('genres')} class={index === 1 ? 'navItemSelected' : 'navItem'}>Genres</a>
        <a on:click={() => navigate('playlists')} class={index === 2 ? 'navItemSelected' : 'navItem'}>Playlists</a>
        <a on:click={() => navigate('favorites')} class={index === 3 ? 'navItemSelected' : 'navItem'}>Favorites</a>
    </nav>
    <div class="btn-left" on:click={goLeft}><ArrowLeft /></div>
    <div class="btn-right" on:click={goRight}><ArrowRight/></div>
<!--    <ArrowRight/>-->
<!--    <ArrowLeft />-->

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
  }

  .navItem {
      color: white;
      text-decoration: none;
      padding: 10px;
      display: block;

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

  .btn-right {
    position: absolute;
    right: 5%;
    top: 50%;
    transform: translate(-50%, 0);
    height: 30px;
    width: 30px;
  }

  .btn-left {
    position: absolute;
    left: 5%;
    top: 50%;
    transform: translate(-50%, 0);
    height: 30px;
    width: 30px;
  }
</style>