<script lang="ts">
  import { onNavigate } from "$app/navigation";
  import { page } from "$app/state";
  import Header from "$components/layouts/header.svelte";
  import Main from "$components/layouts/main.svelte";
  import Meta from "$components/layouts/meta.svelte";
  import "$styles/app.css";
  import { Toaster } from "svelte-hot-french-toast";

  let { children } = $props();

  let is_app_page = $derived(page.url.pathname.startsWith("/app"));

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

{#if !is_app_page}
  <Header />

  <Main>
    {@render children()}
  </Main>
{:else}
  {@render children()}
{/if}

<Toaster />
