<script>
    import '../app.css'
    import PageTransition from "../components/PageTransition.svelte";
    /** @type {import('./$types').LayoutData} */
    export let data
</script>

<div class="layout">
    <nav style="position: absolute">
        <a href="/user">User</a>
        <a href="/genres">Genres</a>
    </nav>

    <PageTransition pathname={data.pathname}>
        <slot />
    </PageTransition>
</div>

<style>
    .layout {
        height: 100vh;
        width: 100vw;
        overflow: hidden;
    }
</style>