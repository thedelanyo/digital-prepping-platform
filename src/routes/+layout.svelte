<script lang="ts">
  import { onNavigate } from "$app/navigation";
  import Header from "$components/layouts/header.svelte";
  import Meta from "$components/layouts/meta.svelte";
  import "$styles/app.css";
  import { Toaster } from "svelte-hot-french-toast";

  let { children } = $props();

  onNavigate((navigation) => {
    if (
      !document.startViewTransition ||
      navigation.from?.route.id === navigation.to?.route.id
    )
      return;

    return new Promise((resolve) => {
      document.startViewTransition &&
        document.startViewTransition(async () => {
          resolve();
        });
    });
  });
</script>

<Meta />

<Header />

<main class="system">
  {@render children()}
</main>

<Toaster />

<style>
  main {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    gap: 4rem;
    padding: 2.5rem var(--gap-base);
    margin: 0 auto;
  }

  @media (min-width: 769px) {
    main {
      gap: 6rem;
      padding-inline: 1rem;
      margin: 0 auto;
    }
  }
</style>
