<script lang="ts">
  import Main from "$components/layouts/main.svelte";
  import MCQ from "$components/modals/mcq.svelte";
  import Svg from "$components/modals/svg.svelte";
  import { prep } from "$db/schema/preps.js";
  import { courses } from "$lib/client/courses";
  import { arrowLeftIcons } from "$lib/client/icons.js";
  import { getLocalData, setLocalData } from "$lib/client/local.js";
  import { generateId } from "$lib/helpers/id.js";
  import { getTopics } from "$lib/helpers/topic.js";

  let { data } = $props();

  let { creator } = $derived(data);

  let topics = $derived(getTopics($prep.course_id));

  let toggle = $state("");

  const load = (_: any) => {
    $prep = getLocalData("prep", {
      ...$prep,
      id: generateId(),
      creator_id: creator.id,
      creator_name: creator.name,
    });

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

    <div>
      <select name="topics" id="topics" bind:value={$prep.topic}>
        <option value=""> -- Select topic for this course -- </option>
        {#each topics as { title }}
          <option value={title}>
            {title}
          </option>
        {/each}
      </select>
    </div>

    <button class="ghost" onclick={() => (toggle = "mcq")}>
      add prep MCQs - ({$prep.questions.length})
    </button>

    <div class="footer">
      <a href="/" class="ghost">
        <Svg ds={arrowLeftIcons} dimension="25" />
        <span>back</span>
      </a>

      <form action="">
        <input type="hidden" name="prep" value={JSON.stringify($prep)} />
      </form>

      <button>preview</button>
    </div>
  </section>
</Main>

{#if toggle === "mcq"}
  <MCQ bind:toggle />
{/if}

<style>
  section {
    margin-top: -1rem;
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

    button,
    a {
      padding: var(--gap-micro) var(--gap-base);
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
