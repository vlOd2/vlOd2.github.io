<script lang="ts">
    import { page } from "$app/state";
</script>

<i class="fa-solid fa-triangle-exclamation error-icon"></i>
<h2>{page.status} - Error</h2>
{#if page.status == 404}
    <p>The specified page could not be found</p>
{:else}
    <p>{page.error?.message}</p>
{/if}
