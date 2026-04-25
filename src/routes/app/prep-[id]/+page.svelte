<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Main from "$components/layouts/main.svelte";
  import Scorecard from "$components/modals/scorecard.svelte";
  import Svg from "$components/modals/svg.svelte";
  import { getPreplet, savePreplet } from "$db/connections/dexie.js";
  import { preplet } from "$db/schema/preps.js";
  import { chevronLeftIcons, chevronRightIcons } from "$lib/client/icons.js";
  import { onMount } from "svelte";
  import toast from "svelte-hot-french-toast";
  import { fly } from "svelte/transition";

  let { data } = $props();

  let { id } = $derived(data);
  let current = $state(parseInt(page.url.searchParams.get("current") || "1"));
  let item = $derived($preplet.preps.find(({ stage }) => stage === current));
  let selection = $derived<number | null>(item ? item.selection : null);
  let length = $derived(data.preps.length + 1);

  const step = (direction: "L" | "R") => {
    if (direction === "R" && !item) {
      toast.info("Question not answered.");
      return;
    }

    direction === "L" && current !== 1 && current--;
    direction === "R" && current !== length && current++;

    goto(`?current=${current}`);
  };

  const submit = (index: number, answer_code: number) => {
    selection = index;

    const success = index === answer_code && selection === answer_code;

    success ? toast.success("Yay!") : toast.error("Oh noo");

    $preplet.preps = [...$preplet.preps, { stage: current, selection }];

    preplet.update((prep) => {
      success && prep.score.totalCorrect++;
      !success && prep.score.totalWrong++;

      return { ...prep };
    });
  };

  onMount(async () => {
    $preplet = await getPreplet(id);
  });

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
    {#each data.preps as { question, options, answer_code }, i}
      {@const index = i + 1}

      {#if index === current}
        <div class="prep" in:fly={{ x: -500 }}>
          <div class="question">
            <div>
              Question {index} of {length}
            </div>

            <p>
              {question}
            </p>
          </div>

          <div class="options">
            {#each options as option, i}
              {@const ans = i === answer_code && selection === answer_code}
              {@const success = i === answer_code && selection !== null}
              {@const danger = i !== answer_code && selection === i}
              {@const disabled = selection !== null}
              {@const checked = selection === i}
              <label
                class="radio"
                for="opt_{i}"
                class:success
                class:ans
                class:danger
              >
                <input
                  {checked}
                  {disabled}
                  type="radio"
                  id="opt_{i}"
                  name="option"
                  onclick={() => submit(i, answer_code)}
                />
                <span>{option}</span>
              </label>
            {/each}
          </div>
        </div>
      {/if}
    {/each}

    {#if current === length}
      <Scorecard />
    {/if}
  </section>

  <div class="footer">
    <a class="ghost" href="/">return</a>

    <div>
      <button class="ghost step" type="button" onclick={() => step("L")}>
        <Svg ds={chevronLeftIcons} dimension="30" />
      </button>
      <button type="button" class="ghost step" onclick={() => step("R")}>
        <Svg ds={chevronRightIcons} dimension="30" />
      </button>
    </div>
  </div>
</Main>

<style>
  .prep {
    margin-top: -1rem;
    gap: 3rem;

    .question {
      font-size: 1.8rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;

      div {
        font-size: 0.9rem;
      }
    }

    .options {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .radio {
        justify-content: start;
        font-size: 1rem;
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
    justify-content: space-between;
    padding: var(--gap-smallest);
    border-top: var(--border);

    button,
    .ghost {
      font-size: 0.9rem;
      padding: var(--gap-micro) var(--gap-small);
    }

    div {
      display: flex;
      gap: 2rem;
    }
  }

  .ans {
    color: var(--success-color);
    background-color: var(--success-bg);
    border: var(--border);
    border-color: var(--success-color);
  }
</style>
