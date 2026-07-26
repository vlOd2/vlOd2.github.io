<script lang="ts">
    import { resolve } from "$app/paths";
</script>

<nav>
    <span class="title">vlOd's website</span>
    <ul>
        <li><a href={resolve("/")}>Home</a></li>
        <li><a href={resolve("/blog")}>Blog</a></li>
        <li><a href={resolve("/socials")}>Socials</a></li>
    </ul>
</nav>

<style>
    nav {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        width: 100vw;
        padding: 15px 0;
        box-shadow: 0px 0px 173px 62px rgba(127, 86, 173, 0.35);
        transition: all 250ms;
        user-select: none;
    }

    .title {
        position: absolute;
        left: 15px;
        font-size: 0.8em;
        color: #d5dadd;
    }

    ul {
        display: flex;
        list-style-type: none;
        gap: 3em;
        margin: 0;
        padding: 0;
    }

    li {
        transition: all 500ms;
    }

    a {
        color: whitesmoke;
        text-decoration: none;
    }

    @media (max-width: 690px) {
        nav {
            padding: 6.5px 0px;
        }

        .title {
            display: none;
        }

        ul {
            gap: 1.5em;
        }

        li {
            padding: 1em 0;
        }
    }

    @media (any-hover) {
        li:hover {
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
    }
</style>
