<script context="module">
    async function loadImages(page = 1) {
        const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=100`)
        return response.json();
    }
</script>
<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { onInterval } from './timer.ts';

    let container;
    $: images = [];
    $: count = 0
    $: page = 0
    $: showButton = true;

    const incrementCounter = async () => {
        count += 1;
        if(page % 100 === 0) {
            page += 1;
        } else if (count === (page * 100) - 5) { // get next 100 images 5 images before
            let nextImages = await loadImages(page + 1);
            images = [...images, ...nextImages];
        }
    }

    async function loadFullScreen () {
        const result = await container.requestFullscreen();
    }

    function handleFullscreenChange () {
        showButton = !showButton;
    }

    onInterval(incrementCounter, 5000);
    onMount(async () => { images = await loadImages(1) });
</script>

<svelte:body on:fullscreenchange={handleFullscreenChange} />

<div class="container" bind:this={container}>
    {#if images.length > 0}
        {#if showButton}
            <button on:click={loadFullScreen}>View in Fullscreen</button>
        {/if}
        <img transition:fade class="image" src={images[count].download_url} alt={`Image by ${images[count].author}`} />
        <img transition:fade class="image" src={images[count + 1].download_url} alt={`Image by ${images[count + 1].author}`} />
    {:else }
        <span>Loading...</span>
    {/if}
</div>

<style>
    .container {
        width: 100vw;
        height: 100vh;
        display: flex;
        position: relative;
    }

    button {
        position: absolute;
        padding: 6px 12px;
        color: grey;
        right: 0;
        background-color: black;
        translate: -10% 50%;
        z-index: 1;
        opacity: 0.2;
        border-radius: 6px;
    }

    button:hover {
        opacity: 1;
    }

    .image {
        position: absolute;
        object-fit: cover;
        flex: 1;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
    }
</style>