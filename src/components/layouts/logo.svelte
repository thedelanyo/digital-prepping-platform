<script>
  let { size = "35" } = $props();
</script>

<div aria-label="Logo">
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="200" height="200" rx="100" fill="currentColor" />
    <circle
      cx="100.222"
      cy="100.222"
      r="54.8889"
      stroke="var(--bg-color)"
      stroke-width="12"
    />
    <circle cx="100.222" cy="100.222" r="33.3333" fill="var(--bg-color)" />
  </svg>
</div>
