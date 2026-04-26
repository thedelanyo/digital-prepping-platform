<script>
  let { size = "30" } = $props();
</script>

<div aria-label="Logo">
  <svg
    width={size}
    height={size}
    viewBox="0 0 224 224"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="112" cy="112" r="106" stroke="currentColor" stroke-width="12" />
    <circle
      cx="112"
      cy="112"
      r="79.5"
      fill="currentColor"
      stroke="currentColor"
    />
  </svg>
</div>

<style>
  div {
    color: currentColor;
  }

  div svg {
    color: currentColor;
  }
</style>
