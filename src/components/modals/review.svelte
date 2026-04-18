<script lang="ts">
  import { prep } from "$db/schema/preps";
  import { trimSpaces } from "$lib/helpers/text";
  import toast from "svelte-hot-french-toast";
  import { fly, scale } from "svelte/transition";
  import Drawer from "./drawer.svelte";

  let {
    toggle = $bindable(""),
    step = $bindable(1),
    disabled = $bindable(false),
  } = $props();

  const { questions } = $derived($prep);

  let is_last = $derived.by(() => {
    return step === questions.length;
  });

  const stepper = (direction: "L" | "R") => {
    direction === "L" && step !== 1 && step--;
    direction === "R" && !is_last && step++;
  };

  type Listen = {
    value: string;
    index: number;
    by: "Q" | "A" | "AC";
    optI: number;
  };

  const listen = (data: Listen) => {
    const { index, by, optI } = data;

    const value = trimSpaces(data.value);

    if (!data) return;

    prep.update((prep) => {
      if (by === "Q") prep.questions[index].title = value;
      if (by === "A") prep.questions[index].options[optI] = value;
      if (by === "AC") prep.questions[index].answer_code = parseInt(value);

      return prep;
    });

    toast.success("Prep updated");
  };
</script>

<Drawer top>
  <h3>
    <button class="ghost" onclick={() => (toggle = "")}> return</button>
    <span> Review & Submit </span>
  </h3>

  <form>
    <input type="hidden" name="prep" value={JSON.stringify($prep)} />

    <div class="course">
      <div class="ghost">{$prep.course_title || "No course selected"}</div>
      <div class="ghost">{$prep.topic || "No topic selected"}</div>
    </div>

    {#key step}
      <div in:fly={{ x: -500 }}>
        <div class="info ghost">
          Question: ({step}/{questions.length})
        </div>
        <div>
          {#each questions as { title, options, answer_code }, index}
            {#if step === index + 1}
              <div class="question">
                <textarea
                  onchange={() => {
                    listen({ by: "Q", value: title, index, optI: 0 });
                  }}
                  value={title}
                ></textarea>
              </div>

              <div class="options">
                {#each options as opt, optI}
                  {@const id = `option_${optI}`}
                  {@const checked = optI === answer_code}
                  <div class="inline-control">
                    <input
                      type="text"
                      name={id}
                      {id}
                      onchange={({ currentTarget }) => {
                        const value = currentTarget.value;
                        listen({ by: "A", value, index, optI });
                      }}
                      value={opt}
                    />
                    <input
                      type="radio"
                      {id}
                      name="option"
                      {checked}
                      onchange={() => {
                        listen({ by: "AC", value: `${optI}`, index, optI });
                      }}
                    />
                  </div>
                {/each}
              </div>
            {/if}
          {/each}
        </div>
      </div>
    {/key}

    <div class="flow-wide">
      <button class="ghost" type="button" onclick={() => stepper("L")}>
        previous
      </button>

      {#if is_last}
        <button in:scale>submit prep</button>
      {:else}
        <button
          in:scale
          type="button"
          class="ghost"
          onclick={() => stepper("R")}
        >
          next question
        </button>
      {/if}
    </div>
  </form>
</Drawer>

<style>
  form {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    justify-content: space-between;
    height: 85vh;
    margin-top: 3rem;
    font-size: 0.9rem;

    .flow-wide button {
      border-radius: 2rem;
    }
  }

  .course .ghost {
    justify-content: start;
  }

  .options {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .info.ghost {
    width: max-content;
    padding-block: var(--gap-nano);
  }

  h3 {
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
    border-bottom: var(--border);
    padding: var(--gap-micro) var(--gap-small);
    position: fixed;
    top: 0;
    background-color: var(--bg-color);
    z-index: 10;

    button {
      border-radius: 2rem;
      font-size: 0.8rem;
      padding: var(--gap-micro) var(--gap-base);
    }
  }
</style>
