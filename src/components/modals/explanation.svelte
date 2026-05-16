<script lang="ts">
  import Drawer from "./drawer.svelte";

  let { explain = $bindable("") } = $props();
</script>

<Drawer onclose={() => (explain = "")} title="Explanation">
  <p>{explain}</p>
</Drawer>

<style>
  p {
    padding: 2rem 1rem;
  }
</style>
