<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import Callout from "$components/modals/callout.svelte";
  import Spinner from "$components/modals/spinner.svelte";
  import Svg from "$components/modals/svg.svelte";
  import { prep } from "$db/schema/preps.js";
  import { courses } from "$lib/client/courses";
  import { arrowLeftIcons, uploadIcons } from "$lib/client/icons.js";
  import { getLocalData, setLocalData } from "$lib/client/local.js";
  import { generateId } from "$lib/helpers/id.js";
  import { truncateString } from "$lib/helpers/text.js";
  import type { SubmitFunction } from "@sveltejs/kit";
  import toast from "svelte-hot-french-toast";
  import { scale } from "svelte/transition";

  let { form } = $props();

  let loading = $state(false);
  let title = $state("");
  let ds = $state(uploadIcons);
  let files = $state<FileList | null>(null);
  let filename = $derived(files ? files[0].name : "");

  const load = (_: any) => {
    $prep = getLocalData("prep", { ...$prep, id: generateId() });

    $effect(() => {
      prep.subscribe((value) => {
        setLocalData("prep", value);
      });

      return () => {
        localStorage.removeItem("prep");
      };
    });
  };

  const submit: SubmitFunction = () => {
    if (loading) return;

    loading = true;

    return async ({ result }) => {
      await applyAction(result);

      form?.message && toast[form.state](form.message);
      $prep = form?.prep || $prep;

      loading = false;
    };
  };
</script>

<form
  use:load
  method="POST"
  enctype="multipart/form-data"
  use:enhance={submit}
  action="?/generate"
>
  <div style="font-size: .9rem;">
    <Callout info>
      Upload a pdf resource like lecture notes, slides, or textbooks for your
      selected course, generate MCQs, share and study together with friends.
    </Callout>
  </div>

  <div>
    <select name="courses" id="courses" bind:value={title}>
      <option value=""> -- Select a course -- </option>
      {#each courses as { title }}
        <option value={title}>
          {title}
        </option>
      {/each}
    </select>
  </div>

  {#key filename}
    <label for="pdf" class="upload" in:scale>
      <Svg {ds} />
      <span>{truncateString(filename, 25) || `Upload a pdf resource`}</span>
      <input
        type="file"
        name="pdf"
        id="pdf"
        accept=".pdf"
        class="v-hidden"
        bind:files
      />
    </label>
  {/key}

  <input type="hidden" name="courseTitle" value={title} />

  <div class="buttons">
    <a href="/" class="ghost">
      <Svg ds={arrowLeftIcons} dimension="25" />
      <span>back</span>
    </a>

    <button>
      <Spinner {loading} />
      generate
    </button>
  </div>
</form>

<style>
  .upload {
    display: flex;
    flex-direction: row;
    border: var(--border);
    padding: var(--gap-small);
    align-items: center;
    gap: var(--gap-micro);
    border-radius: var(--radius-base);
    font-size: 1rem;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    position: fixed;
    bottom: 1rem;
    left: 0;
    right: 0;
    justify-content: space-between;
    padding-inline: var(--gap-small);

    button,
    a {
      padding-block: var(--gap-micro);
      border-radius: 2rem;
      font-size: 0.9rem;
      text-transform: uppercase;

      &:last-child {
        width: 55%;
      }

      &.ghost {
        gap: var(--gap-smallest);
        padding-inline: 0.9rem;
      }
    }
  }
</style>
