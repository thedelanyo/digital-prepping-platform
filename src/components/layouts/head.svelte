<script>
  import { fly } from "svelte/transition";

  let { children } = $props();
</script>

<header in:fly={{ y: 30 }}>
  {@render children()}
</header>

<style>
  header {
    background-color: var(--bg-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: var(--border);
    position: sticky;
    top: 0;
    padding: var(--gap-micro) var(--gap-small);
    z-index: 500;
    view-transition-name: header;
  }
</style>
