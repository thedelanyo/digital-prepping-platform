<script lang="ts">
  import { enhance } from "$app/forms";
  import { saveLocalPrep } from "$db/connections/local";
  import { prep } from "$db/schema/preps";
  import toast from "svelte-hot-french-toast";
  import { fly, scale } from "svelte/transition";
  import Callout from "./callout.svelte";
  import Hero from "./hero.svelte";
  import Spinner from "./spinner.svelte";

  let { total = 0, loading = false, submit, publishId = "" } = $props();

  let checked = $state(false);
  let source = $state("remote");

  const onclick = async () => {
    loading = true;
    await saveLocalPrep($prep);
    loading = false;
    publishId = $prep.id;
    source = "local";
    toast.success("Saved locally");
  };
</script>

<form
  in:fly={{ x: -500 }}
  method="POST"
  use:enhance={submit}
  action="?/publish"
>
  <div>
    <Hero size="8" />

    <Callout success>
      {total} prep MCQs were generated. Save them on your device or check to publish
      for others as well.
    </Callout>
  </div>

  <label class="radio" for="share">
    <input type="checkbox" id="share" name="option" bind:checked />
    <span>Publish prep for others to use.</span>
  </label>

  <input type="hidden" name="prep" value={JSON.stringify($prep)} />

  {#if publishId}
    <a href="/prep-{publishId}?source={source}" in:scale class="button">
      <Spinner {loading} />
      take prep
    </a>
  {:else if checked}
    <button in:scale>
      <Spinner {loading} />
      publish prep
    </button>
  {:else}
    <button type="button" in:scale {onclick}>
      <Spinner {loading} />
      save prep
    </button>
  {/if}
</form>

<style>
  form {
    gap: 3rem;

    button,
    .button {
      margin-top: 3rem;
    }
  }
</style>
