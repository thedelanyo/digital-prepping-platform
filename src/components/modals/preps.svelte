<script lang="ts">
  import { shareIcons } from "$lib/client/icons";
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

  let { preps = [] as Prep[], tab = "", toggle = $bindable("") } = $props();
</script>

<div class="preps">
  {#each preps as prep}
    {@const { courseId, creatorId, creatorName } = prep}
    {@const { id, topics, title } = prep}
    {@const [, prepId] = id.split(":")}
    {@const href = `/prep-${prepId}`}

    <div class="prep">
      <a {href}>{title}</a>

      <div class="topics">
        {#each topics.split(",") as topic}
          {@const search = encodeURIComponent(topic)}
          <a href="/preps?course={courseId}&search={search}">
            #{slugify(topic)}
          </a>
        {/each}
      </div>

      <div class="author">
        {#if tab === "others" && creatorId}
          <a href="/preps?course={courseId}&author={creatorId}" class="ghost">
            <span>{truncateString(creatorName.split(" ")[0], 10)}</span>
          </a>
        {/if}

        {#if tab === "local"}
          <button onclick={() => (toggle = prepId)}>publish</button>
        {/if}

        <a class="ghost" {href}>start prep</a>

        <button class="ghost" onclick={() => sharer({ url: href })}>
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
    gap: 2rem;

    .prep {
      display: flex;
      flex-direction: column;
      gap: var(--gap-small);
      box-shadow: var(--shadow-inset);
      padding: var(--gap-smallest);
      border-radius: var(--radius-base);
      font-size: 1.1rem;
      width: 100%;

      & > a {
        color: currentColor;
      }

      .topics {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem 1rem;

        a {
          text-transform: lowercase;
          font-size: 1rem;
        }
      }

      .author {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 1rem;

        .ghost {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          padding: var(--gap-nano) var(--gap-small);
          border-radius: 2rem;

          &:last-child {
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
