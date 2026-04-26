<script>
  import { prep } from "$db/schema/preps";
  import { getTopics } from "$lib/helpers/topic";
  import toast from "svelte-hot-french-toast";

  let topics = $derived(getTopics($prep.course_id));

  const onclick = (topic = "") => {
    if ($prep.topics.includes(topic)) {
      $prep.topics = $prep.topics.filter((t) => t !== topic);
      toast.success(`Tag #${topic} removed`);
      return;
    }

    if ($prep.topics.length === 3) {
      toast.error("You can only select up to three tags");
      return;
    }

    $prep.topics = [...$prep.topics, topic];

    toast.success(`Tag #${topic} added`);
  };
</script>

<div>
  <h2>select up to three tags</h2>
  <div class="topics">
    {#each topics as topic}
      {@const selected = $prep.topics.includes(topic)}

      <button class="ghost" class:selected onclick={() => onclick(topic)}>
        #{topic}
      </button>
    {/each}
  </div>
</div>

<style>
  h2 {
    font-size: 1.5rem;
  }

  .topics {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    flex-direction: row;

    button {
      width: max-content;
      font-size: 0.8rem;

      &.selected {
        background-color: var(--blue-100);
        color: #000 !important;
      }
    }
  }
</style>
