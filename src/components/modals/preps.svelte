<script lang="ts">
  type Preps = {
    id: string;
    creator_name: string;
    creator_id: string;
    question: string;
  };

  let { preps = [] as Preps[] } = $props();
</script>

<div class="preps">
  {#each preps as { id, question, creator_name, creator_id }}
    {@const [, prepId] = id.split(":")}
    {@const creator = `${creator_id}:${creator_name}`}
    <a href="/app/prep-{prepId}?creator={creator}">{question}</a>
  {/each}
</div>

<style>
  .preps {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-top: -1rem;

    a {
      color: currentColor;
      font-size: 1.5rem;
      border: var(--border);
      padding: 1.5rem;
      border-radius: var(--radius-base);
    }
  }
</style>
