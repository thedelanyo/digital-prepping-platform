<script lang="ts">
  import Preps from "$components/modals/preps.svelte";

  let { data } = $props();
  let { title, preps } = $derived(data);
</script>

<section>
  <h1>{title}.</h1>

  <Preps {preps} />
</section>

<style>
  section {
    margin-top: -1rem;

    h1 {
      font-size: 1.5rem;
      margin-bottom: -1rem;
      text-transform: capitalize;
    }
  }
</style>
