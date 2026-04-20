<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import Main from "$components/layouts/main.svelte";
  import Svg from "$components/modals/svg.svelte";
  import { preppings } from "$db/schema/preps.js";
  import { chevronLeftIcons, chevronRightIcons } from "$lib/client/icons.js";
  import { getLocalData, setLocalData } from "$lib/client/local.js";
  import toast from "svelte-hot-french-toast";
  import { fly } from "svelte/transition";

  let { data } = $props();

  let current = $state(parseInt(page.url.searchParams.get("current") || "1"));
  let item = $derived($preppings.find(({ stage }) => stage === current));
  let selection = $derived<number | null>(item ? item.selection : null);

  const step = (direction: "L" | "R") => {
    if (direction === "R" && !item) {
      toast.info("Question not answered.");
      return;
    }

    direction === "L" && current !== 1 && current--;
    direction === "R" && current !== data.preps.length && current++;

    goto(`?current=${current}`);
  };

  const submit = (index: number, answer_code: number) => {
    selection = index;

    const success = index === answer_code && selection === answer_code;

    success ? toast.success("Yay!") : toast.error("Oh noo");
    $preppings = [...$preppings, { stage: current, selection, score: 0 }];
  };

  const load = (_: any) => {
    $preppings = getLocalData("preppings", $preppings);

    $effect(() => {
      preppings.subscribe((value) => {
        setLocalData("preppings", value);
      });

      return () => {
        localStorage.removeItem("preppings");
      };
    });
  };
</script>

<Main>
  <section use:load>
    {#each data.preps as { question, options, answer_code }, i}
      {@const index = i + 1}

      {#if index === current}
        <div class="prep" in:fly={{ x: -500 }}>
          <div class="indicator">
            Question {index} of {data.preps.length}
          </div>

          <p class="question">
            {question}
          </p>

          <div class="options">
            {#each options as option, i}
              {@const ans = i === answer_code && selection === answer_code}
              {@const success = i === answer_code && selection !== null}
              {@const disabled = selection !== null}
              {@const checked = selection === i}
              <label class="radio" for="opt_{i}" class:success class:ans>
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

    gap: 2rem;

    .question {
      border: var(--border);
      padding: var(--gap-small);
      border-radius: var(--radius-large);
      font-size: 1.5rem;
    }

    .indicator {
      padding: var(--gap-micro);
      border: var(--border);
      width: max-content;
      margin-bottom: -1rem;
      border-radius: var(--radius-large);
      font-size: 0.9rem;
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
