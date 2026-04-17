<script lang="ts">
  import { onNavigate } from "$app/navigation";
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
          // await navigation.complete;
        });
    });
  });
</script>

<Meta />

{@render children()}

<Toaster />
