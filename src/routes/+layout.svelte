<script lang="ts">
    import "$lib/styles/controls.css";
    import "$lib/styles/main-bg.css";
    import "$lib/styles/main.css";
    import "$lib/styles/desktop.css";
    import "$lib/styles/mobile.css";
    import Navbar from "$lib/components/Navbar.svelte";
    import { page } from "$app/state";
    import { blur } from "svelte/transition";

    let { children } = $props();
    let content = $state<HTMLDivElement>();
    let glow = $state<HTMLDivElement>();

    function updateGlow() {
        if (!content || !glow) {
            return;
        }
        glow.style.top = `${content.scrollTop}px`;
    }

    function onmousemove(e: MouseEvent) {
        if (!content) {
            return;
        }
        const rect = content.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        content.style.setProperty("--glow-x", `${x}px`);
        content.style.setProperty("--glow-y", `${y}px`);
        updateGlow();
        if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
            content.style.setProperty("--glow-opacity", "0");
        } else {
            content.style.setProperty("--glow-opacity", "1");
        }
    }
</script>

<svelte:head>
    <title>vlOd's website</title>
</svelte:head>

<div class="body-flex">
    <Navbar />

    <div class="content-container" {onmousemove}>
        {#key page.route.id}
            <div class="content" bind:this={content} onscroll={() => updateGlow()} in:blur>
                <div class="cursor-glow" bind:this={glow}></div>
                {@render children?.()}
            </div>
        {/key}
    </div>
</div>
