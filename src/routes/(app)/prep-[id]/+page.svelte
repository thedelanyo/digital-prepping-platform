<script lang="ts">
  import { applyAction, enhance } from "$app/forms";
  import Main from "$components/layouts/main.svelte";
  import Explanation from "$components/modals/explanation.svelte";
  import Scorecard from "$components/modals/scorecard.svelte";
  import Svg from "$components/modals/svg.svelte";
  import { getPreplet, savePreplet } from "$db/connections/dexie.js";
  import { preplet } from "$db/schema/preps.js";
  import { chevronLeftIcons, chevronRightIcons } from "$lib/client/icons.js";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { onMount } from "svelte";
  import toast from "svelte-hot-french-toast";
  import { fly, scale } from "svelte/transition";

  let { data, form } = $props();

  let { id, stage } = $derived(data);

  let prep = $derived($preplet.preps.find((p) => p.stage === stage));
  let selected = $derived<number | null>(prep ? prep.selected : null);
  let length = $derived(data.preps.length + 1);
  let direction = $derived("L");
  let answered = $derived(prep ? "YES" : "NO");
  let explain = $derived("");

  onMount(async () => {
    $preplet = await getPreplet(id);
  });

  const submit: SubmitFunction = () => {
    return async ({ result }) => {
      await applyAction(result);

      form?.message && toast[form.state](form.message);
      stage = form?.stage || stage;
      direction = form?.direction || direction;

      if (selected !== null && form?.answer !== undefined) {
        prep = { stage, selected, answer: form.answer };

        const success = selected === prep.answer;

        success ? toast.success("That's right!") : toast.error("Not quite");

        const preps = [...$preplet.preps, prep];

        preplet.update((prep) => {
          success && prep.score.totalCorrect++;
          !success && prep.score.totalWrong++;

          return { ...prep, preps };
        });
      }
    };
  };

  const load = (_: any) => {
    $effect(() => {
      preplet.subscribe(async (value) => {
        await savePreplet(value);
      });
    });
  };
</script>

<Main>
  <section {@attach load}>
    {#each data.preps as { title, options, explanation }, prepIndex}
      {@const index = prepIndex + 1}

      {#if index === stage}
        <div class="prep" in:fly={{ x: -500 }}>
          <div class="question">
            <div>
              <span>Question {index} of {length}</span>

              {#if answered === "YES"}
                <button
                  in:scale
                  class="ghost"
                  onclick={() => (explain = explanation)}
                >
                  explain
                </button>
              {:else}
                <button style="opacity: 0;">explain</button>
              {/if}
            </div>

            <p>{title}</p>
          </div>

          <form
            class="options"
            method="POST"
            use:enhance={submit}
            action="?/getAnswer"
          >
            <input type="hidden" name="stage" value={stage} />
            <input type="hidden" name="answered" value={answered} />

            {#each options as option, i}
              {@const answer = prep?.answer}
              {@const ans = i === answer && selected === answer}
              {@const success = i === answer && selected !== null}
              {@const danger = i !== answer && selected === i}
              {@const checked = selected === i}
              {@const disabled = answered === "YES"}

              <button onclick={() => (selected = i)} {disabled}>
                <label
                  class="radio"
                  for="opt_{i}"
                  class:success
                  class:ans
                  class:danger
                >
                  <input
                    {disabled}
                    {checked}
                    type="radio"
                    id="opt_{i}"
                    name="option"
                  />
                  <span>{option}</span>
                </label>
              </button>
            {/each}
          </form>
        </div>
      {/if}
    {/each}

    {#if stage === length}
      <Scorecard />
    {/if}
  </section>

  <form class="footer" method="POST" use:enhance={submit} action="?/stepper">
    <button class="ghost" onclick={() => history.back()} type="button">
      return
    </button>

    <input type="hidden" name="answered" value={answered} />
    <input type="hidden" name="direction" value={direction} />
    <input type="hidden" name="stage" value={stage} />
    <input type="hidden" name="length" value={length} />
    <input type="hidden" name="id" value={id} />

    <div>
      <button class="ghost step">
        <Svg ds={chevronLeftIcons} dimension="30" />
      </button>

      <button class="ghost step" onclick={() => (direction = "R")}>
        <Svg ds={chevronRightIcons} dimension="30" />
      </button>
    </div>
  </form>

  {#if explain}
    <Explanation bind:explain />
  {/if}
</Main>

<style>
  section {
    margin-bottom: 2rem;
  }

  .prep {
    margin-top: -1.5rem;
    gap: 3rem;

    .question {
      font-size: 1.1rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;

      div {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 0.9rem;

        button {
          padding: var(--gap-nano) 1.3rem;
          border-radius: 2rem;
        }
      }
    }

    .options {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .radio {
        justify-content: start;
        font-size: 0.8rem;
        padding-block: var(--gap-smallest);
      }
    }
  }

  .footer {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: var(--gap-smallest);
    border-top: var(--border);
    background-color: var(--bg-color);

    div {
      display: flex;
      flex-direction: row;
      gap: 2rem;

      .ghost {
        width: 3.5rem;
      }
    }

    .ghost {
      padding: var(--gap-micro) var(--gap-small);
    }
  }

  .ans {
    color: var(--success-color);
    background-color: var(--success-bg);
    border: var(--border);
    border-color: var(--success-color);
  }

  form.options {
    button {
      display: contents;
    }
  }
</style>
