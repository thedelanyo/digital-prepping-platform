<script lang="ts">
  import { enhance } from "$app/forms";
  import { prep, prepInit } from "$db/schema/preps";
  import { fly, scale } from "svelte/transition";
  import Callout from "./callout.svelte";
  import Hero from "./hero.svelte";
  import Spinner from "./spinner.svelte";

  let {
    total = 0,
    loading = false,
    submit,
    publishId = $bindable(""),
  } = $props();

  const onclick = () => {
    $prep = prepInit;
    publishId = "";
  };
</script>

<form in:fly={{ x: -500 }} method="POST" use:enhance={submit} action="?/save">
  <div>
    <Hero size="13" />

    <Callout success>
      Successfully generated {total} prep MCQs. Save now to begin studying with your
      coursemates.
    </Callout>
  </div>

  <input type="hidden" name="prep" value={JSON.stringify($prep)} />

  {#key publishId}
    <div class="buttons" in:scale>
      {#if publishId}
        <a href="/" class="ghost" {onclick}> home </a>
        <a href="/prep-{publishId}" class="button" {onclick}> take prep </a>
      {:else}
        <button>
          <Spinner {loading} />
          save prep
        </button>
      {/if}
    </div>
  {/key}
</form>

<style>
  form {
    & > div:first-child {
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .buttons {
      display: flex;
      flex-direction: row;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      justify-content: space-between;
      padding: var(--gap-small);
      border-top: var(--border);

      & > * {
        width: 100%;
        border-radius: 2rem;
      }

      & > a:first-child {
        width: 60%;
      }
    }
  }
</style>
