<script>
  let {
    filled = false,
    color = "currentColor",
    title = "",
    dimension = "28",
    ds = [""],
    stroke = 1.5,
    view = 24,
  } = $props();

  let fill = $derived(!stroke || filled ? color : "none");
</script>

<div>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    {fill}
    width={dimension}
    height={dimension}
    viewBox="0 0 {view} {view}"
    stroke-width={stroke}
    stroke="currentColor"
    class="w-6 h-6"
    aria-label={title}
  >
    {#each ds as d}
      <path {d} />
    {/each}
  </svg>
</div>

<style>
  div {
    display: flex;
    align-items: center;
    font-size: 0;
    margin: 0;
    padding: 0;
    flex-shrink: 0;
  }
</style>
