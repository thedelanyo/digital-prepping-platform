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
  {#key tab}
    <section in:fly={{ x: -500 }}>
      <div>
        <h1>{title}</h1>
      </div>

      <Preps {preps} {tab} bind:toggle />
    </section>
  {/key}

  <section class="footer">
    <a href="/" class="ghost">return</a>
    <Tabs tabs={["others", "you"]} width="65%" />
  </section>
</Main>

<style>
  h1 {
    font-size: 1.3rem;
    margin-bottom: -2rem;
    text-transform: capitalize;
    font-weight: normal;
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
    padding: var(--gap-smallest);
    border-top: var(--border);
    background-color: var(--bg-color);
    gap: 0;

    .ghost {
      border-radius: 2rem;
      padding: var(--gap-micro) 1rem;
      font-size: 0.9rem;
      width: 30%;
    }
  }
</style>
