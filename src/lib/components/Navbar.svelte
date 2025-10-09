<script lang="ts">
    import "$lib/styles/nav.css";
    import { resolve } from "$app/paths";
</script>

<nav>
    <ul class="nav-list">
        <li class="nav-item"><a href={resolve("/")} class="nav-link">Home</a></li>
        <li class="nav-item"><a href={resolve("/links")} class="nav-link">Links</a></li>
        <li class="nav-item"><a href={resolve("/about")} class="nav-link">About</a></li>
    </ul>
</nav>
