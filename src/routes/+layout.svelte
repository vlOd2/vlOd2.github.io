<script lang="ts">
    import "$lib/styles/main.css";
    import "$lib/styles/controls.css";
    import Navbar from "$lib/components/Navbar.svelte";
    import { page } from "$app/state";
    import { blur } from "svelte/transition";
    let { children } = $props();
</script>

<div class="body-flex">
    <Navbar />

    <div class="content-container">
        {#key page.route.id}
            <div class="content" in:blur>
                {@render children?.()}
            </div>
        {/key}
    </div>
</div>
