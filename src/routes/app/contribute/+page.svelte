<script lang="ts">
  import Main from "$components/layouts/main.svelte";
  import Svg from "$components/modals/svg.svelte";
  import { prep, questions } from "$db/schema/preps.js";
  import { courses } from "$lib/client/courses";
  import { arrowLeftIcons } from "$lib/client/icons.js";
  import { getLocalData, setLocalData } from "$lib/client/local.js";
  import { generateId } from "$lib/helpers/id.js";
  import { getTopics } from "$lib/helpers/topic.js";

  let { data } = $props();

  let topics = $derived(getTopics($prep.course_id));

  const load = (_: any) => {
    const id = generateId();
    const creator_id = generateId();
    const creator_name = "";

    $prep = getLocalData("prep", { ...$prep, id, creator_id, creator_name });
    $questions = getLocalData("questions", []);

    $effect(() => {
      prep.subscribe((value) => {
        setLocalData("prep", value);
      });

      questions.subscribe((value) => {
        setLocalData("questions", value);
      });

      return () => {
        localStorage.removeItem("prep");
        localStorage.removeItem("questions");
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

    <button class="ghost">add prep MCQs</button>

    <div class="footer">
      <a href="/" class="ghost">
        <Svg ds={arrowLeftIcons} dimension="25" />
        <span>back</span>
      </a>

      <form action="">
        <input type="hidden" name="course_title" value={$prep.course_title} />
        <input type="hidden" name="course_id" value={$prep.course_id} />
        <input type="hidden" name="id" value={$prep.id} />
        <input type="hidden" name="topic" value={$prep.topic} />
        <input type="hidden" name="creator_id" value={$prep.creator_id} />
        <input type="hidden" name="creator_name" value={$prep.creator_name} />
        <input
          type="hidden"
          name="questions"
          value={JSON.stringify(questions)}
        />
        <button>preview</button>
      </form>
    </div>
  </section>
</Main>

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
