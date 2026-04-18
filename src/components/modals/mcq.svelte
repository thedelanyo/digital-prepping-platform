<script>
  import { prep } from "$db/schema/preps";
  import { trimSpaces } from "$lib/helpers/text";
  import toast from "svelte-hot-french-toast";
  import Drawer from "./drawer.svelte";

  let { toggle = $bindable("") } = $props();

  let options = $state(["", "", ""]);
  let title = $state("");
  let answer_code = $state(0);

  const max = 20;

  const onclick = () => {
    if (!title) {
      toast.error("Please enter a prep question");
      return;
    }

    const opts = options.filter((option) => option);

    if (opts.length < 2) {
      toast.error("Please provide at least two possible answers");
      return;
    }

    if (!opts[answer_code]) {
      toast.error("Please select a valid answer");
      return;
    }

    if ($prep.questions.length >= max) {
      toast.error(`You can only add up to ${max} questions`);
      return;
    }

    if (opts.some((option) => option.length > 50)) {
      toast.error("One of the answers is too long");
      return;
    }

    if (title.length > 100) {
      toast.error("The question is too long");
      return;
    }

    title = trimSpaces(title);
    options = opts.map((option) => trimSpaces(option));

    $prep.questions = [...$prep.questions, { title, answer_code, options }];

    toast.success("MCQ added");

    options = ["", "", ""];
    title = "";
    answer_code = 0;

    toggle = $prep.questions.length === max ? "" : toggle;
  };
</script>

<Drawer
  title="{$prep.questions.length} MCQs added"
  onclose={() => (toggle = "")}
>
  <form>
    <div>
      <label for="question">Enter a prep question</label>
      <textarea name="question" id="question" bind:value={title}></textarea>
    </div>

    <div class="options">
      <label for="question">Enter possible answers</label>

      {#each options as _, index}
        {@const id = `option_${index}`}
        {@const checked = index === answer_code}
        <div class="inline-control">
          <input type="text" name={id} {id} bind:value={options[index]} />
          <input
            type="radio"
            {id}
            name="option"
            onchange={() => {
              answer_code = index;
            }}
            {checked}
          />
        </div>
      {/each}
    </div>

    <button type="button" {onclick}>add MCQ</button>
  </form>
</Drawer>

<style>
  form {
    display: flex;
    flex-direction: column;
    padding: 2rem 1rem;
    gap: 2rem;

    input[type="radio"] {
      width: 3rem;
    }
  }
</style>
