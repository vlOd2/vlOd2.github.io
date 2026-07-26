<script lang="ts">
    import "$lib/styles/controls.css";
    import "$lib/styles/glow.css";
    import "$lib/styles/main.css";
    import Navbar from "$lib/components/Navbar.svelte";
    import { page } from "$app/state";
    import { blur } from "svelte/transition";

    let { children } = $props();
    let glowTarget = $state<HTMLDivElement>();
    let glow = $state<HTMLDivElement>();

    function offsetGlowTop() {
        if (!glowTarget || !glow) {
            return;
        }
        glow.style.top = `${glowTarget.scrollTop}px`;
    }

    function onmousemove(e: MouseEvent) {
        if (!glowTarget) {
            return;
        }

        const rect = glowTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        glowTarget.style.setProperty("--glow-x", `${x}px`);
        glowTarget.style.setProperty("--glow-y", `${y}px`);
        offsetGlowTop();

        if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
            glowTarget.style.setProperty("--glow-opacity", "0");
        } else {
            glowTarget.style.setProperty("--glow-opacity", "1");
        }
    }
</script>

<svelte:head>
    <title>vlOd's website</title>
</svelte:head>

<div class="body-flex" bind:this={glowTarget} {onmousemove} onscroll={() => offsetGlowTop()}>
    <Navbar />

    <div class="cursor-glow" bind:this={glow}></div>

    <div class="content-container">
        {#key page.route.id}
            <div class="content" in:blur>
                {@render children?.()}
            </div>
        {/key}
    </div>
</div>
