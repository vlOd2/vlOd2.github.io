<script lang="ts" module>
    // if multiple buttons are clicked quickly, ensure only one bubble is shown at a time
    // by allowing older bubbles to be hidden sooner when a new bubble is shown
    let currentBubble = $state<number>(0);
</script>

<script lang="ts">
    import { onDestroy } from "svelte";
    import { fade } from "svelte/transition";
    import { TriangleAlert, CircleCheck } from "@lucide/svelte";
    import Throbber from "./Throbber.svelte";

    let {
        label,
        action
    }: {
        label: string;
        action: () => Promise<any>;
    } = $props();

    let btn = $state<HTMLButtonElement>();
    // only used for cleanup onDestroy, do not use directly
    let bubble = $state<HTMLDivElement>();

    let currentAction = $state<Promise<any>>();
    let hasFinished = $state<boolean>(false);
    let error = $state<any>();

    let showBubble = $state<boolean>(false);
    let bubbleID = $state<number>(0);
    // allow hiding on mouseleave after a few seconds
    // not instantly, as the user might miss the bubble otherwise
    let bubbleCanHide = $state<boolean>(false);
    let bubbleSide = $state<"top" | "bottom">("top");
    let bubblePos = $state<{ top: number; left: number }>({ top: 0, left: 0 });

    function isTouchScreen(): boolean {
        return window.matchMedia("(hover: none)").matches;
    }

    function updateBubblePos() {
        if (!showBubble || !btn) {
            return;
        }
        const rect = btn.getBoundingClientRect();
        bubbleSide = rect.top < 80 ? "bottom" : "top";
        bubblePos = {
            top: bubbleSide == "top" ? rect.top : rect.bottom,
            left: rect.left + rect.width / 2
        };
    }

    function allowBubbleHide() {
        bubbleCanHide = true;
        // hide the bubble automatically if not hovered/on mobile
        if (!btn?.matches(":hover") || isTouchScreen()) {
            showBubble = false;
        }
    }

    function destroyBubble() {
        error = undefined;
        showBubble = false;
        bubbleCanHide = false;
    }

    function handleClick() {
        if (currentAction) {
            return;
        }

        destroyBubble();
        currentAction = action();

        currentAction
            .then(onActionFinish)
            .catch(onActionError)
            .finally(() => {
                currentAction = undefined;
            });

        function onActionFinish() {
            hasFinished = true;
            setTimeout(() => {
                hasFinished = false;
            }, 3000);
        }

        function onActionError(err: any) {
            console.error(err);
            error = err;

            showBubble = true;
            currentBubble++;
            bubbleID = currentBubble;

            setTimeout(allowBubbleHide, isTouchScreen() ? 5000 : 3000);
        }
    }

    // position update effect
    $effect(() => {
        if (!showBubble) {
            return;
        }
        updateBubblePos();
        const interval = setInterval(updateBubblePos, 100);
        return () => {
            clearInterval(interval);
        };
    });

    // allow hide early effect
    $effect(() => {
        // see currentBubble usage above
        if (bubbleID != currentBubble) {
            allowBubbleHide();
        }
    });

    onDestroy(() => {
        destroyBubble();
        // svelte doesn't clean it up properly onDestroy
        // we need to do it manually, everywhere else is fine
        bubble?.remove();
    });
</script>

<button
    bind:this={btn}
    onclick={() => handleClick()}
    disabled={!!currentAction}
    onmouseenter={() => {
        if (error) {
            showBubble = true;
        }
    }}
    onmouseleave={() => {
        if (bubbleCanHide) {
            showBubble = false;
        }
    }}
>
    {#if currentAction || error || hasFinished}
        <div class="throbber">
            {#if currentAction}
                <Throbber size={20} />
            {:else if error}
                <TriangleAlert size={24} color="orange" />
            {:else if hasFinished}
                <CircleCheck size={24} color="lightgreen" />
            {/if}
        </div>
    {/if}
    <span>{label}</span>
</button>

{#if error && showBubble}
    <div
        class={["bubble", bubbleSide]}
        style="top: {bubblePos.top}px; left: {bubblePos.left}px;"
        transition:fade
        {@attach function (node: Node) {
            if (bubble) {
                bubble.remove();
            }
            // ensure bubble is shown correctly in modals
            node.parentNode?.removeChild(node);
            document.body.appendChild(node);
            bubble = node as HTMLDivElement;
        }}
    >
        <strong>Error</strong>
        <div class="msg">{error instanceof Error ? error.message : error}</div>
    </div>
{/if}

<style>
    button {
        display: flex;
        align-items: center;
        gap: 0.5em;
    }

    .throbber {
        display: flex;
        align-items: center;
        max-height: 0;
    }

    .bubble {
        position: fixed;
        z-index: 9999;
        max-width: 320px;

        color: white;
        background-color: rgb(103, 103, 103);
        border: 1px solid rgba(212, 212, 212, 0.32);
        border-radius: 8px;
        padding: 0.5rem 0.75rem;
        box-shadow:
            0 12px 60px rgba(0, 0, 0, 0.4),
            inset 0 0 100px 5px rgba(255, 255, 255, 0.06);

        user-select: none;
        pointer-events: none;
    }

    .bubble::after {
        content: "";
        position: absolute;
        transform: translateX(-50%);
        width: 0;
        height: 0;
    }

    .bubble.top {
        transform: translate(-50%, -115%);
    }

    .bubble.bottom {
        transform: translate(-50%, 15%);
    }

    .bubble.top::after {
        left: 50%;
        bottom: -8px;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-top: 8px solid rgb(108, 108, 108);
    }

    .bubble.bottom::after {
        left: 50%;
        top: -8px;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid rgb(108, 108, 108);
    }

    .bubble strong {
        display: block;
        margin-bottom: 4px;
        font-weight: 600;
    }

    .bubble .msg {
        word-break: break-word;
    }
</style>
