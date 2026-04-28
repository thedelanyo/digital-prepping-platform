<script lang="ts">
  import Svg from "$components/modals/svg.svelte";
  import { hamburgerIcons } from "$lib/client/icons";
  //   import { downloadIcon, plusIcon } from "$lib/client/icons";
  import { dev } from "$app/environment";
  import { onMount } from "svelte";
  import Head from "./head.svelte";
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
  <button class="ghost" onclick={() => (is_open = true)}>
    <Svg ds={hamburgerIcons} />
  </button>

  {#if dev}
    <a class="button" href="/contribute">contribute</a>
  {/if}
</Head>

{#if is_open}
  <Nav bind:is_open />
{/if}

<style>
  button,
  a {
    padding: var(--gap-micro) var(--gap-small);
    border-radius: 2rem;
    font-size: 0.8rem;
    text-transform: uppercase;

    &.ghost {
      padding: var(--gap-nano);
      border-radius: var(--radius-base);
    }
  }
</style>
