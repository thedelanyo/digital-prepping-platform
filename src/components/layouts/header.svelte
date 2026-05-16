<script lang="ts">
  import { page } from "$app/state";
  import Svg from "$components/modals/svg.svelte";
  import { hamburgerIcons } from "$lib/client/icons";
  import { scale } from "svelte/transition";
  import Head from "./head.svelte";
  import Logo from "./logo.svelte";
  import Nav from "./nav.svelte";

  let is_open = $state(false);
</script>

<Head>
  <a href="/">
    <Logo />
    coprep
  </a>

  <div>
    {#if page.url.pathname !== "/create"}
      <a href="/create" class="button" transition:scale>create</a>
    {/if}

    <button class="ghost" onclick={() => (is_open = true)}>
      <Svg ds={hamburgerIcons} />
    </button>
  </div>
</Head>

{#if is_open}
  <Nav bind:is_open />
{/if}

<style>
  a:not(.button) {
    text-transform: uppercase;
    display: flex;
    align-items: center;
    color: currentColor;
    font-size: 1.4rem;
    gap: 0.5rem;
  }

  div {
    display: flex;
    align-items: center;
    gap: 2rem;
  }

  .ghost {
    padding: var(--gap-nano);
    border-radius: var(--radius-large);
  }

  .button {
    padding-block: var(--gap-nano);
    border-radius: 2rem;
    text-transform: uppercase;
    font-size: 0.8rem;
  }
</style>
