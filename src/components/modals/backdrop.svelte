<script>
  let { loading = false } = $props();
</script>

{#if loading}
  <div></div>
{/if}

<style>
  div {
    position: fixed;
    bottom: 0;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1000;
    background-color: var(--bg-color);
    opacity: 0.5;
  }
</style>
