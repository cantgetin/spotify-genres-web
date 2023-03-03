<script>
    import { fly } from 'svelte/transition';
    export let pathname = '';
</script>

{#key pathname}
    <div in:fly={{ x: -10, duration: 500, delay: 500 }} out:fly={{ x: 10, duration: 500 }} style="margin: 30px 0;">
        <slot />
    </div>
{/key}