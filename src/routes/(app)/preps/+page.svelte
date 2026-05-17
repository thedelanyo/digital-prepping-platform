<script lang="ts">
  import Main from "$components/layouts/main.svelte";
  import Nav from "$components/layouts/nav.svelte";
  import Preps from "$components/modals/preps.svelte";
  import Svg from "$components/modals/svg.svelte";
  import Tabs from "$components/modals/tabs.svelte";
  import { hamburgerIcons } from "$lib/client/icons.js";
  import { fly } from "svelte/transition";

  let { data } = $props();
  let { title, preps, tab } = $derived(data);

  let is_open = $state(false);
</script>

<Main>
  {#key tab}
    <section in:fly={{ x: -500 }}>
      <div>
        <h1>{title}</h1>
      </div>

      <Preps {preps} {tab} />
    </section>
  {/key}

  <section class="footer">
    <button class="ghost" onclick={() => (is_open = true)}>
      <Svg ds={hamburgerIcons} />
    </button>
    <Tabs tabs={["others", "you"]} width="70%" />
  </section>
</Main>

{#if is_open}
  <Nav bind:is_open />
{/if}

<style>
  h1 {
    font-size: 1.3rem;
    margin-bottom: -2rem;
    text-transform: capitalize;
  }

  section:not(.footer) {
    margin-top: -1rem;
  }

  .footer {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    flex-direction: row !important;
    justify-content: space-between;
    padding: var(--gap-smallest) var(--gap-base);
    border-top: var(--border);
    background-color: var(--bg-color);
    gap: 0;

    .ghost {
      padding: var(--gap-micro);
      border-radius: 0.5rem;
    }
  }
</style>
