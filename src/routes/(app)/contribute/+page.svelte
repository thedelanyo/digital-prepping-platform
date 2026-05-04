<script lang="ts">
  import { applyAction } from "$app/forms";
  import Main from "$components/layouts/main.svelte";
  import MCQ from "$components/modals/mcq.svelte";
  import Review from "$components/modals/review.svelte";
  import Svg from "$components/modals/svg.svelte";
  import Topics from "$components/modals/topics.svelte";
  import { prep } from "$db/schema/preps.js";
  import { courses } from "$lib/client/courses";
  import { arrowLeftIcons, pencilIcons } from "$lib/client/icons.js";
  import { getLocalData, setLocalData } from "$lib/client/local.js";
  import { generateId } from "$lib/helpers/id.js";
  import type { SubmitFunction } from "@sveltejs/kit";
  import toast from "svelte-hot-french-toast";

  let { form } = $props();

  let toggle = $state("");
  let loading = $state(false);
  let step = $state(1);
  let id = $state("");

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

  const onchange = () => {
    const course = courses.find((c) => c.id == $prep.course_id);
    $prep.course_title = course?.title || "";
  };

  const submit: SubmitFunction = () => {
    if (loading) return;

    loading = true;

    return async ({ result }) => {
      await applyAction(result);

      form?.message && toast[form.state](form.message);
      id = form?.id || "";
      loading = false;
    };
  };
</script>

<Main>
  <section use:load>
    <div>
      <select
        name="courses"
        id="courses"
        bind:value={$prep.course_id}
        {onchange}
      >
        <option value=""> -- Choose a course -- </option>
        {#each courses as { title, id }}
          <option value={id}>
            {title}
          </option>
        {/each}
      </select>
    </div>

    <button class="ghost info" onclick={() => (toggle = "mcq")}>
      <Svg ds={pencilIcons} dimension="30" />
      <span>add prep MCQs - ({$prep.questions.length})</span>
    </button>

    <Topics />

    <div class="footer">
      <a href="/" class="ghost">
        <Svg ds={arrowLeftIcons} dimension="25" />
        <span>back</span>
      </a>

      <button
        onclick={() => (toggle = "review")}
        disabled={$prep.questions.length < 1}
      >
        review
      </button>
    </div>
  </section>
</Main>

{#if toggle === "mcq"}
  <MCQ bind:toggle />
{/if}

{#if toggle === "review"}
  <Review bind:toggle bind:step {submit} {loading} {id} />
{/if}

<style>
  section {
    margin-top: -1rem;
  }

  .ghost.info {
    gap: 1rem;
  }

  .footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    border-top: var(--border);
    padding: var(--gap-smallest);
    background-color: var(--bg-color);

    button,
    a {
      padding: var(--gap-micro) 1.5rem;
      border-radius: 2rem;
      font-size: 0.8rem;
      text-transform: uppercase;

      &.ghost {
        padding: var(--gap-micro) var(--gap-smallest);
        gap: var(--gap-smallest);
      }
    }
  }
</style>
