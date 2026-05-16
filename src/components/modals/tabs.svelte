<script>
  import { page } from "$app/state";
  import { getSearchParams } from "$lib/helpers/text";
  import { fly } from "svelte/transition";

  let { tabs = [""], tab = "" } = $props();

  let { pathname, searchParams } = $derived(page.url);
  let current = $derived(tab || searchParams.get("tab") || tabs[0]);
  let params = $derived(getSearchParams(searchParams, "tab"));
</script>

<div class="wrapper">
  {#each tabs as tab}
    {#if tab === current}
      {@const x = 100 / tabs.length}

      <div class="button alt-bg" in:fly={{ x }}>
        {tab}
      </div>
    {:else}
      {@const href = `${pathname}?tab=${tab}&${params}`}

      <a {href} class="button" data-sveltekit-replacestate>
        {tab}
      </a>
    {/if}
  {/each}
</div>

<style>
  .wrapper {
    display: flex;
    flex-direction: row;
    border: var(--border);
    border-radius: 2rem;
    position: relative;
    width: 100%;
    overflow-x: scroll;
    white-space: nowrap;
    scrollbar-width: none;
  }

  .button {
    flex: 1;
    color: currentColor;
    outline: none;
    border-radius: 0;
    z-index: 1;
    transition: none;
    text-transform: capitalize;
  }

  .button:not(.alt-bg) {
    background-color: transparent;
  }
</style>
