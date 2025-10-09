<script>
    import { resolve } from "$app/paths";
</script>

<h1>vlOd's website</h1>
<p>Welcome to my website! :)</p>
<p>Here you can find stuff about me and my projects</p>
<br />

<div class="buttons">
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
