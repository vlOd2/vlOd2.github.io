<script>
    import PageTitle from "$lib/components/PageTitle.svelte";
</script>

<PageTitle>Hello! :)</PageTitle>

<p>Welcome to my website!</p>
<p>I am Vlad, a software engineer, I go by vlOd (not a zero!) on the internet...</p>
<p>My language of choice for apps is C#, and for websites, Svelte with Typescript</p>
<br />

<h2 style="margin-top: 1.5em; margin-bottom: 1em;">What I like:</h2>
<ul>
    <li>thinkering with malware and network protocols</li>
    <li>experimenting with operating systems</li>
    <li>coding tools and libraries</li>
    <li>video games and modding them</li>
    <li class="hate">weekends being short</li>
</ul>

<style>
    ul {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        list-style-type: none;
        gap: 0.35em;
    }

    li {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
    }

    li::before {
        display: block;
        content: "❤︎";
        color: violet;
        margin-right: 0.5em;
    }

    li.hate::before {
        content: "✘";
        color: red;
    }
</style>
