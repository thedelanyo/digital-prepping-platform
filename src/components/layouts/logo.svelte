<script>
  let { size = "35", color = "currentColor" } = $props();
</script>

<div aria-label="Logo">
  <svg
    width={size}
    height={size}
    viewBox="0 0 244 244"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="122" cy="122" r="110" stroke={color} stroke-width="15" />
    <circle cx="122" cy="122" r="60" fill={color} stroke={color} />
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
