<script>
    import { resolve } from "$app/paths";
    import PageTitle from "$lib/components/PageTitle.svelte";
</script>

<PageTitle>My projects</PageTitle>

<br />
<br />

<div class="links">
    <a class="button" href={resolve("/projects/quickgl")}>QuickGL</a>
    <a class="button" href={resolve("/projects/dotcraft")}>DotCraft</a>
    <a class="button" href={resolve("/projects/livelyim")}>LivelyIM</a>
</div>

<style>
    .links {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
</style>
