<script lang="ts">
  import Svg from "$components/modals/svg.svelte";
  import { hamburgerIcons } from "$lib/client/icons";
  //   import { downloadIcon, plusIcon } from "$lib/client/icons";
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import { scale } from "svelte/transition";
  import Head from "./head.svelte";
  import Logo from "./logo.svelte";
  import Nav from "./nav.svelte";

  interface PromptEvent extends Event {
    prompt: () => void;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  }

  let is_open = $state(false);

  let differedPrompt = $state<PromptEvent | null>(null);
  let app_installed = $state(false);

  onMount(async () => {
    const nav = navigator as any;
    app_installed = !!(await nav.getInstalledRelatedApps?.())?.length;

    window.addEventListener("beforeinstallprompt", (event: Event) => {
      differedPrompt = event as PromptEvent;
    });
  });

  const onclick = async () => {
    if (!differedPrompt) return;

    differedPrompt.prompt();

    const { outcome } = await differedPrompt.userChoice;

    app_installed = outcome === "accepted";
  };
</script>

<Head>
  <a href="/">
    <Logo size="33" />
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
    font-size: 1.2rem;
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
