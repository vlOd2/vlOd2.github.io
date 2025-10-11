<script>
    import { resolve } from "$app/paths";
    import PageTitle from "$lib/components/PageTitle.svelte";
</script>

<PageTitle>My projects</PageTitle>

<div class="projects">
    <ul style="margin-bottom: 25px;">
        <li><a href={resolve("/projects/quickgl")}>QuickGL</a></li>
        <li><a href={resolve("/projects/dotcraft")}>DotCraft</a></li>
        <li><a href={resolve("/projects/livelyim")}>LivelyIM</a></li>
    </ul>
</div>

<style>
    a {
        color: whitesmoke;
    }

    .projects {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: initial;
    }
</style>
