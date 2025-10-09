<script lang="ts">
    import { resolve } from "$app/paths";
</script>

<nav>
    <span>vlOd's website</span>
    <div class="separator"></div>
    <ul class="nav-list">
        <li class="nav-item"><a href={resolve("/")} class="nav-link">Home</a></li>
        <li class="nav-item"><a href="http://vlod.me" class="nav-link" target="_blank">Files</a></li>
        <li class="nav-item"><a href={resolve("/blog")} class="nav-link">Blog</a></li>
        <li class="nav-item"><a href={resolve("/socials")} class="nav-link">Socials</a></li>
        <li class="nav-item"><a href={resolve("/about")} class="nav-link">About</a></li>
    </ul>
</nav>

<style>
    nav {
        display: flex;
        gap: 10px;
        width: fit-content;
        padding: 15px 25px;
        border: 2px solid #1d1f22;
        border-top: none;
        border-bottom-left-radius: 15px;
        border-bottom-right-radius: 15px;
        -webkit-box-shadow: 0px 0px 173px 62px rgba(127, 86, 173, 0.2);
        -moz-box-shadow: 0px 0px 173px 62px rgba(127, 86, 173, 0.2);
        box-shadow: 0px 0px 173px 62px rgba(127, 86, 173, 0.2);
    }

    .separator {
        margin-left: -2px;
        height: 100%;
        border-right: 1px solid rgb(139, 139, 139);
    }

    .nav-list {
        display: flex;
        justify-content: center;
        align-items: center;
        list-style-type: none;
        gap: 20px;
        margin: 0;
        padding: 0;
    }

    .nav-link {
        color: whitesmoke;
        text-decoration: none;
    }

    .nav-item {
        transition: all 0.5s ease;
    }

    .nav-item:hover {
        color: aliceblue;
        text-shadow:
            0 0 5px aliceblue,
            0 0 10px aliceblue,
            0 0 15px aliceblue,
            0 0 20px rgb(38, 1, 172),
            0 0 30px rgb(38, 1, 172),
            0 0 40px rgb(38, 1, 172),
            0 0 55px rgb(38, 1, 172),
            0 0 75px rgb(38, 1, 172);
    }
</style>
