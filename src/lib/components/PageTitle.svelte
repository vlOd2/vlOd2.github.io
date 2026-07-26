<script lang="ts">
    let { children } = $props();
</script>

<h1>
    <strong>{@render children()}</strong>
</h1>

<style>
    h1 {
        margin: 0;
        margin-bottom: 1em;
        font-size: 2.1em;
        font-weight: bold;
    }
</style>
