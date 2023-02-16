<script>
    import '../app.css'
    import {goto} from "$app/navigation";
    import PageTransition from "../components/PageTransition.svelte";
    import ArrowRight from "../components/ArrowRight.svelte";
    import ArrowLeft from "../components/ArrowLeft.svelte";

    /** @type {import('./$types').LayoutData} */
    export let data

    const routes = ['/user', '/genres', '/playlists', '/favorites']
    let index = routes.indexOf(data.pathname)

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
        goto(path)
    }

</script>

<div class="layout">
    <nav class="nav">
        <a on:click={() => navigate('/user')} class={index === 0 ? 'navItemSelected' : 'navItem'}>User</a>
        <a on:click={() => navigate('/genres')} class={index === 1 ? 'navItemSelected' : 'navItem'}>Genres</a>
        <a on:click={() => navigate('/playlists')} class={index === 2 ? 'navItemSelected' : 'navItem'}>Playlists</a>
        <a on:click={() => navigate('/favorites')} class={index === 3 ? 'navItemSelected' : 'navItem'}>Favorites</a>
    </nav>
    <!--    <div class="btn" type="left" on:click={goLeft}><ArrowLeft /></div>-->
    <!--    <div class="btn" type="right" on:click={goRight}><ArrowRight/></div>-->

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

  .btn {
    position: absolute;
    top: 0%;
    height: 100vh;
    width: 10%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    z-index: 10;
    transition: 0.5s;

    &:hover {
      background: #151515;
    }

    &[type="left"] {
      left: 0%;
    }

    &[type="right"] {
      right: 0%;
    }
  }


</style>