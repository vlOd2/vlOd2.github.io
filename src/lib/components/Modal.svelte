<script lang="ts">
    import type { Snippet } from "svelte";
    import * as store from "svelte/store";
    import { fade, fly } from "svelte/transition";

    let {
        title = "\u200B",
        onClose = () => {},
        allowClose = store.readable(true),
        content,
        buttons
    }: {
        title?: string;
        onClose?: () => void;
        allowClose?: store.Readable<boolean>;
        content: Snippet;
        buttons?: Snippet;
    } = $props();

    let wasClosable: boolean = store.get(allowClose);
    let initialTransitionDone = $state<boolean>(false);
    let offsetX = $state<number>(0);
    let offsetY = $state<number>(0);
    let isDragging = $state<boolean>(false);
    let backdrop = $state<HTMLDivElement>();
    let rootContainer = $state<HTMLDivElement>();
    let ix: number;
    let iy: number;
    let resizeTimeout = -1;

    // just in case intro end event doesn't fire
    // so the user isn't stuck, unable to close the modal
    setTimeout(() => (initialTransitionDone = true), 500);

    $effect(() => {
        if (rootContainer) {
            let rect = rootContainer.getBoundingClientRect();
            ix = rect.x;
            iy = rect.y;
        }
    });

    function clampOffset(mw: number, mh: number, w: number, h: number) {
        let mnx = (-mw + w) / 2 + 5;
        let mny = (-mh + h) / 2 + 5;
        let mpx = (mw - w) / 2 - 5;
        let mpy = (mh - h) / 2 - 5;
        offsetX = Math.min(Math.max(offsetX, mnx), mpx);
        offsetY = Math.min(Math.max(offsetY, mny), mpy);
    }

    function onMouseDown(e: MouseEvent) {
        if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("modal-drag")) {
            return;
        }
        isDragging = true;
    }

    function onMouseUp(e: MouseEvent) {
        isDragging = false;
    }

    function onMouseMove(e: MouseEvent) {
        if (!isDragging || !rootContainer || !backdrop) {
            return;
        }

        let xd = e.movementX / window.devicePixelRatio;
        let yd = e.movementY / window.devicePixelRatio;
        let rect = rootContainer.getBoundingClientRect();

        let w = rect.width;
        let h = rect.height;
        let mw = backdrop.clientWidth;
        let mh = backdrop.clientHeight;
        offsetX += xd;
        offsetY += yd;

        clampOffset(mw, mh, w, h);
    }

    function onResize() {
        if (resizeTimeout != -1) {
            clearTimeout(resizeTimeout);
            resizeTimeout = -1;
        }
        resizeTimeout = setTimeout(() => {
            if (!rootContainer || !backdrop) {
                return;
            }
            let rect = rootContainer.getBoundingClientRect();
            let w = rect.width;
            let h = rect.height;
            let mw = backdrop.clientWidth;
            let mh = backdrop.clientHeight;
            clampOffset(mw, mh, w, h);
            resizeTimeout = -1;
        }, 100) as any; // @types/node is dumb
    }
</script>

<svelte:window
    onkeydown={(e) => {
        if (e.key === "Escape" && $allowClose && initialTransitionDone) {
            onClose();
        }
    }}
    onmousedown={onMouseDown}
    onmouseup={onMouseUp}
    onmousemove={onMouseMove}
    onresize={onResize}
/>

<div
    class="backdrop"
    style={`cursor: ${isDragging ? "grabbing" : "default"};`}
    onmousedown={(e) => {
        if (e.target == e.currentTarget && $allowClose && initialTransitionDone) {
            onClose();
        }
    }}
    transition:fade={{ duration: 200 }}
    onintroend={() => (initialTransitionDone = true)}
    bind:this={backdrop}
>
    <!-- have a root container to reduce accidental backdrop clicks -->
    <div
        class="root-container modal-drag"
        style={`transform: translate(${offsetX}px, ${offsetY}px);`}
        bind:this={rootContainer}
    >
        <div class="container" in:fly={{ y: 50 }}>
            <div class="header-row modal-drag" style={`cursor: ${isDragging ? "grabbing" : "grab"};`}>
                <span>{title}</span>
            </div>

            <div class="widgets-container">
                <div class="widgets">
                    {@render content()}
                </div>
            </div>

            <div class="btn-row">
                {@render buttons?.()}
                {#if wasClosable}
                    <button onclick={() => onClose()} disabled={!$allowClose}>Close</button>
                {/if}
            </div>
        </div>
    </div>
</div>

<style>
    .backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        display: flex;
        align-items: center;
        justify-content: center;

        background-color: rgba(0, 0, 0, 0.75);
    }

    .root-container {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
        background-color: yellow;
        transform-origin: top left;
    }

    .container {
        max-height: 75vh;
        max-width: 75vw;
        aspect-ratio: 1;

        display: flex;
        flex-direction: column;
        overflow: hidden;
        user-select: none;
        resize: both;

        border: 2px solid #4e4e4e77;
        border-radius: 8px;
        background-color: rgba(78, 78, 78, 0.466);
        background-color: lightblue;
        backdrop-filter: blur(5px);

        box-shadow:
            0px 0px 30px rgba(148, 148, 148, 0.3),
            inset 0px 0px 150px rgba(255, 255, 255, 0.15);
    }

    @media (max-width: 924px) {
        .container {
            max-width: 90vw;
        }
    }

    .header-row {
        display: flex;
        align-items: center;
        justify-content: start;
        padding: 0.5rem 1rem;

        background-color: rgb(46, 46, 46);
        border-bottom: 2px solid #4e4e4e77;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
    }

    .header-row * {
        margin: 0;
        pointer-events: none;
    }

    .widgets-container {
        height: 0;
        flex-grow: 1;
        display: flex;
        align-items: center;
        justify-content: center;

        /* padding: 1.5rem; */
        overflow: auto;
        color: white;
        background-color: limegreen;
    }

    .widgets {
        padding-inline: 5em;
        margin: auto;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        word-wrap: break-word;
        background-color: deeppink;
    }

    .btn-row {
        display: flex;
        align-items: center;
        justify-content: flex-end;

        padding: 1em;
        gap: 0.5rem;

        background-color: rgb(46, 46, 46);
        border-top: 2px solid #4e4e4e77;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
    }
</style>
