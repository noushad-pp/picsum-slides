import { onDestroy } from 'svelte';

export function onInterval(callback: () => void, milliseconds = 0) {
    const interval = setInterval(callback, milliseconds);

    onDestroy(() => {
        clearInterval(interval);
    });
}