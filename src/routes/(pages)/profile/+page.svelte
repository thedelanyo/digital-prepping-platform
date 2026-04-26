<script lang="ts">
  import { applyAction } from "$app/forms";
  import Name from "$components/modals/name.svelte";
  import type { SubmitFunction } from "@sveltejs/kit";
  import toast from "svelte-hot-french-toast";

  let { data, form } = $props();

  let { creator } = $derived(data);
  let loading = $state(false);

  const submit: SubmitFunction = () => {
    if (loading) return;

    loading = true;

    return async ({ result }) => {
      await applyAction(result);

      form?.message && toast[form.state](form.message);
      creator = form?.creator || creator;

      loading = false;
    };
  };
</script>

<section>
  <h1>Welcome, {creator.name}</h1>
</section>

{#if !creator.id}
  <Name {loading} {submit} />
{/if}

<style>
  h1 {
    font-size: 1.5rem;
  }
</style>
