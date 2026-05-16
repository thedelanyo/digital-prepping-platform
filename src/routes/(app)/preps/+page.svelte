<script lang="ts">
  import Main from "$components/layouts/main.svelte";
  import Preps from "$components/modals/preps.svelte";
  import Tabs from "$components/modals/tabs.svelte";
  import { fly } from "svelte/transition";

  let { data } = $props();
  let { title, preps, tab } = $derived(data);

  let toggle = $state("");
</script>

<Main>
  <section>
    <Tabs tabs={["others", "you"]} />
  </section>

  {#key tab}
    <section in:fly={{ x: -500 }}>
      <div>
        <h1>{title}</h1>
      </div>

      <Preps {preps} {tab} bind:toggle />
    </section>
  {/key}
</Main>

<style>
  section {
    margin-top: -1rem;

    h1 {
      font-size: 1.3rem;
      margin-bottom: -2rem;
      text-transform: capitalize;
      font-weight: normal;
    }
  }
</style>
