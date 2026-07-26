<script lang="ts">
    import { page } from "$app/state";
    import { TriangleAlert } from "@lucide/svelte";
</script>

<TriangleAlert class="error-icon" />

<h2>{page.status} - Error</h2>

{#if page.status == 404}
    <p>The specified page could not be found</p>
{:else}
    <p>{page.error?.message}</p>
{/if}
