<script lang="ts">
  import Main from "$components/layouts/main.svelte";
  import Svg from "$components/modals/svg.svelte";
  import { chevronLeftIcons, chevronRightIcons } from "$lib/client/icons.js";
  import { fly } from "svelte/transition";

  let { data } = $props();

  let step = $state(1);

  const stepper = (direction: "L" | "R") => {
    direction === "L" && step !== 1 && step--;
    direction === "R" && step !== data.preps.length && step++;
  };
</script>

<Main>
  <section>
    {#each data.preps as { question, options }, i}
      {@const index = i + 1}

      {#if index === step}
        <div class="prep" in:fly={{ x: -500 }}>
          <div class="indicator">
            Question {index} of {data.preps.length}
          </div>

          <p class="question">
            {question}
          </p>

          <div class="options">
            {#each options as option, i}
              <label class="radio" for="opt_{i}">
                <input type="radio" id="opt_{i}" name="option" />
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
      <button class="ghost step" type="button" onclick={() => stepper("L")}>
        <Svg ds={chevronLeftIcons} dimension="30" />
      </button>
      <button type="button" class="ghost step" onclick={() => stepper("R")}>
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
      gap: 1rem;

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
</style>
