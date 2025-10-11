<script>
    import PageTitle from "$lib/components/PageTitle.svelte";
</script>

<PageTitle>About me</PageTitle>

<br />

<p>I am a Romanian developer that enjoys thinkering with anything to do with computers!</p>
<p>I am very disorganised when it comes to projects, and I can't really seem to be able to stick to one :P</p>
<p>Currently learning web development... I also enjoy listening to music</p>

<div class="langs">
    <h3 style="margin: 0; margin-top: 25px;">Languages I know</h3>
    <ul style="margin-bottom: 25px;">
        <li>C#</li>
        <li>Java</li>
        <li>Go</li>
        <li>Typescript</li>
    </ul>
    <span>I also occasionally mess around with C and C++</span>
    <span>(also most of my C# code ends up using <code>unsafe</code>)</span>
</div>

<style>
    .langs {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: initial;
    }
</style>
