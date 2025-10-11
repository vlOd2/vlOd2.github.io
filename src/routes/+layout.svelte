<script lang="ts">
    import "$lib/styles/main.css";
    import "$lib/styles/controls.css";
    import Navbar from "$lib/components/Navbar.svelte";
    import { page } from "$app/state";
    import { blur } from "svelte/transition";

    let { children } = $props();
    let content = $state<HTMLDivElement>();

    function onmousemove(e: MouseEvent) {
        if (!content) {
            return;
        }
        const rect = content.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        content.style.setProperty("--mouse-x", `${x}px`);
        content.style.setProperty("--mouse-y", `${y}px`);
    }
</script>

<svelte:head>
    <title>vlOd's website</title>
</svelte:head>

<div class="body-flex">
    <Navbar />

    <div class="content-container" {onmousemove}>
        {#key page.route.id}
            <div class="content" bind:this={content} in:blur>
                {@render children?.()}
            </div>
        {/key}
    </div>
</div>
