<script>
    import { resolve } from "$app/paths";
</script>

<h1>My projects</h1>

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
