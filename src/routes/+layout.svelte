<script lang="ts">
    import "$lib/styles/main.css";
    import "$lib/styles/controls.css";
    import Navbar from "$lib/components/Navbar.svelte";
    import { page } from "$app/state";
    import { blur } from "svelte/transition";

    let { children } = $props();
    let cursorGlow: HTMLDivElement;

    function onmousemove(e: MouseEvent) {
        cursorGlow.style.setProperty("--mouse-y", e.clientY.toFixed(2));
        cursorGlow.style.setProperty("--mouse-x", e.clientX.toFixed(2));
    }

    function onmousedown(e: MouseEvent) {
        cursorGlow.classList.add("active");
    }

    function onmouseup(e: MouseEvent) {
        cursorGlow.classList.remove("active");
    }
</script>

<svelte:head>
    <title>vlOd's website</title>
</svelte:head>

<svelte:document {onmousemove} {onmousedown} {onmouseup} />
<div class="cursor-glow" bind:this={cursorGlow}></div>

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
