<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import Backdrop from "$components/modals/backdrop.svelte";
  import Callout from "$components/modals/callout.svelte";
  import Name from "$components/modals/name.svelte";
  import Review from "$components/modals/review.svelte";
  import Spinner from "$components/modals/spinner.svelte";
  import Svg from "$components/modals/svg.svelte";
  import { prep } from "$db/schema/preps.js";
  import { courses } from "$lib/client/courses";
  import { arrowLeftIcons, uploadIcons } from "$lib/client/icons.js";
  import { getTextbooks } from "$lib/client/topic.js";
  import { truncateString } from "$lib/helpers/text.js";
  import type { SubmitFunction } from "@sveltejs/kit";
  import toast from "svelte-hot-french-toast";
  import { scale } from "svelte/transition";

  let { form } = $props();

  let loading = $state(false);
  let course = $state({ title: "", id: "", textbookName: "", textbookId: "" });
  let ds = $state(uploadIcons);
  let toAddName = $state(false);
  let publishId = $state("");
  let files = $state<FileList | null>(null);
  let filename = $derived(files ? files[0].name : "");
  let textbooks = $derived(getTextbooks($prep.courseId));
  let locked = $derived(!!course.textbookId);

  const submit: SubmitFunction = () => {
    if (loading) return;

    loading = true;

    return async ({ result }) => {
      await applyAction(result);

      form?.message && toast[form.state](form.message);
      $prep = form?.prep || $prep;
      publishId = form?.publishId || publishId;
      toAddName = form?.toAddName || toAddName;
      toAddName = form?.creatorId ? false : toAddName;
      loading = false;
    };
  };

  const onchange = (which: "course" | "textbook") => {
    if (which === "course") {
      const item = courses.find((c) => c.id == course.id);
      course.title = item?.title || "";

      textbooks = getTextbooks(course.id);

      return;
    }

    const item = textbooks.find((c) => c.id == course.textbookId);
    course.textbookName = item?.name || "";
  };
</script>

{#if $prep.id}
  <Review {submit} {loading} total={$prep.questions.length} {publishId} />
{:else}
  <form
    method="POST"
    enctype="multipart/form-data"
    use:enhance={submit}
    action="?/generate"
  >
    <div>
      <Callout info>
        Select a course and material, or upload a PDF like notes, slides, or
        textbooks. Generate MCQs, share and study with friends.
      </Callout>
    </div>

    <div>
      <select
        name="courses"
        id="courses"
        bind:value={course.id}
        onchange={() => onchange("course")}
      >
        <option value=""> -- Select a course -- </option>
        {#each courses as { title, id }}
          <option value={id}>
            {title}
          </option>
        {/each}
      </select>
    </div>

    <div>
      <select
        name="textbooks"
        id="textbooks"
        bind:value={course.textbookId}
        onchange={() => onchange("textbook")}
      >
        <option value=""> -- Select a textbook -- </option>
        {#each textbooks as { name, id }}
          <option value={id}>
            {name}
          </option>
        {/each}
      </select>
    </div>

    {#key filename}
      <label for="pdf" class="upload" in:scale class:locked>
        <Svg {ds} />
        <span
          >{truncateString(filename, 25) || `Or upload a your textbook`}</span
        >
        <input
          type="file"
          name="pdf"
          id="pdf"
          accept=".pdf"
          class="v-hidden"
          disabled={locked}
          bind:files
        />
      </label>
    {/key}

    <input type="hidden" name="courseTitle" value={course.title} />
    <input type="hidden" name="courseId" value={course.id} />
    <input type="hidden" name="textbookName" value={course.textbookName} />
    <input type="hidden" name="textbookId" value={course.textbookId} />

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
{/if}

{#if toAddName}
  <Name {submit} {loading} />
{/if}

<Backdrop {loading} />

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

  form {
    gap: 2.5rem;
    margin-top: -0.5rem;

    label.locked {
      opacity: 0.5;
    }
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
