<script lang="ts">
  import Close from "$components/buttons/close.svelte";
  import { fade, fly } from "svelte/transition";

  let {
    tag = "div",
    tall = true,
    title = "",
    top = false,
    children,
    onclose = null,
    size = "1.3",
  } = $props();

  const onclick = (e: MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    onclose && onclose();
  };
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="drawer" {onclick} transition:fade>
  <div
    class:noTitle={!title}
    class:top
    class="wrapper"
    transition:fly={{ y: 800, duration: 500 }}
  >
    {#if title}
      <div title="head" style="font-size: {size}rem;">
        <p class="title">{title}</p>

        <Close onclick={onclose} />
      </div>
    {/if}

    <svelte:element this={tag} class="content" class:tall>
      {@render children()}
    </svelte:element>
  </div>
</div>

<style>
  .drawer {
    display: block;
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    backdrop-filter: blur(10px);
    z-index: 600;
    border-radius: 0;
    background-color: transparent;
    color: currentColor;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    color: inherit;
    position: fixed;
    right: 0;
    left: 0;
    bottom: 0;
    overflow-y: scroll;
    background-color: var(--bg-color);
    border-radius: 0.5rem 0.5rem 0 0;

    &.top {
      top: 0;
    }

    &.noTitle {
      border-top: var(--border);
      border-radius: 0.5rem 0.5rem 0 0;
    }

    & [title="head"] {
      padding: var(--gap-micro);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-radius: 0.5rem 0.5rem 0 0;
      position: sticky;
      top: 0;
      background-color: inherit;
      z-index: 50;
      border-block: var(--border);
      text-transform: capitalize;

      & .title {
        font-size: 1.1rem;
      }
    }
  }

  .content {
    max-height: 45rem;
  }

  @media (min-width: 50em) {
    .wrapper {
      left: 50%;
      transform: translateX(-50%);
      width: 40rem;
    }
  }
</style>
