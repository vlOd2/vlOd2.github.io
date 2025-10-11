<script>
    import { resolve } from "$app/paths";
    import PageTitle from "$lib/components/PageTitle.svelte";
</script>

<PageTitle>vlOd's website</PageTitle>

<p>Welcome to my website! :)</p>
<p>Here you can find stuff about me and my projects</p>
<p>NOTE: This website is still very much under construction</p>

<br />

<div class="buttons">
    <a href={resolve("/projects")} class="button">My projects</a>
    <a href={resolve("/about")} class="button">About me</a>
</div>

<style>
    .buttons {
        display: flex;
        flex-direction: row;
        justify-content: center;
        gap: 10px;
    }
</style>
