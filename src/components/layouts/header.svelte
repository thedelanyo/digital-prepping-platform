<script lang="ts">
  import { page } from "$app/state";
  import Svg from "$components/modals/svg.svelte";
  import { hamburgerIcons } from "$lib/client/icons";
  //   import { downloadIcon, plusIcon } from "$lib/client/icons";
  import { onMount } from "svelte";
  import { fly } from "svelte/transition";
  //   import Logo from "./logo.svelte";
  //   import Nav from "./nav.svelte";
  //   import Shortcut from "./shortcuts.svelte";

  interface PromptEvent extends Event {
    prompt: () => void;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  }

  let toggle = $state("");

  const dimension = "25";

  let differedPrompt = $state<PromptEvent | null>(null);
  let app_installed = $state(false);

  let { pathname } = $derived(page.url);
  let { user } = $derived(page.data);

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

<header in:fly={{ y: 30 }}>
  <button class="ghost">
    <Svg ds={hamburgerIcons} />
  </button>
  <button>contribute</button>
</header>

<style>
  header {
    background-color: var(--bg-color);
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: var(--border);
    position: sticky;
    top: 0;
    padding: var(--gap-smallest);
    z-index: 500;
    view-transition-name: header;
  }

  button {
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
