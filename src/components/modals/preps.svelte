<script lang="ts">
  import { bookmarkIcons, shareIcons, userIcons } from "$lib/client/icons";
  import { sharer } from "$lib/client/sharer";
  import { slugify, truncateString } from "$lib/helpers/text";
  import Callout from "./callout.svelte";
  import Hero from "./hero.svelte";
  import Svg from "./svg.svelte";

  type Prep = {
    id: string;
    creatorName: string;
    creatorId: string;
    title: string;
    topics: string;
    courseId: string;
  };

  let { preps = [] as Prep[], tab = "" } = $props();
</script>

<div class="preps">
  {#each preps as prep}
    {@const { courseId, creatorId, creatorName } = prep}
    {@const { id, topics, title } = prep}
    {@const [, prepId] = id.split(":")}
    {@const href = `/prep-${prepId}`}

    <div class="prep">
      <a {href} class="title">
        {truncateString(title, 48)} read more
      </a>

      <div class="topics">
        {#each topics.split(",") as topic}
          {@const search = encodeURIComponent(topic)}
          {@const link = `/preps?course=${courseId}&search=${search}`}
          <a href={link} data-sveltekit-replacestate>
            #{slugify(topic)}
          </a>
        {/each}
      </div>

      <div class="author">
        <a class="ghost" {href}>take prep</a>

        {#if tab === "others" && creatorId}
          {@const link = `/preps?course=${courseId}&author=${creatorId}`}
          <a href={link} class="ghost icon" data-sveltekit-replacestate>
            <Svg ds={userIcons} dimension="33" />
          </a>
        {/if}

        <button class="ghost icon">
          <Svg ds={bookmarkIcons} dimension="33" />
        </button>

        <button class="ghost icon" onclick={() => sharer({ url: href })}>
          <Svg ds={shareIcons} filled dimension="33" />
        </button>
      </div>
    </div>
  {:else}
    <div class="empty">
      <Hero size="10" />

      <Callout info>
        {#if tab === "you"}
          You haven't created any preps in this course yet.
          <a href="/create">Create prep</a>
        {/if}

        {#if tab === "others"}
          We couldn't find any matching preps.
          <a href="/create">Create a prep</a>
        {/if}
      </Callout>
    </div>
  {/each}
</div>

<style>
  .preps {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1.5rem;

    .prep {
      display: flex;
      flex-direction: column;
      box-shadow: var(--shadow-inset);
      padding: var(--gap-smallest);
      border-radius: var(--radius-base);
      width: 100%;
      gap: var(--gap-smallest);

      .title {
        color: currentColor;
      }

      .topics {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 1rem;

        a {
          text-transform: lowercase;
          font-size: 0.9rem;
        }
      }

      .author {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: var(--gap-smallest);

        .ghost {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          padding: var(--gap-nano) var(--gap-small);
          border-radius: 2rem;

          &.icon {
            border: none;
            padding: 0;
          }
        }
      }
    }
  }

  .empty {
    display: flex;
    flex-direction: column;
    margin-top: 2rem;
    gap: 2rem;
  }
</style>
