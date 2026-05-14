<script lang="ts">
  let {
    info = false,
    success = false,
    danger = false,
    warn = false,
    children,
  } = $props();
</script>

<div class:info class:success class:danger class:warn class="callout">
  <p>{@render children()}</p>
</div>

<style>
  div {
    padding: var(--gap-small);
    border-radius: var(--radius-base);
    border: var(--border);
  }

  div.info {
    border-color: var(--info-color);
    color: var(--info-color);
  }

  div.danger {
    border-color: var(--danger-color);
    color: var(--danger-color);
  }

  div.warn {
    border-color: var(--warn-color);
    color: var(--warn-color);
  }

  div.success {
    border-color: var(--success-color);
    color: var(--success-color);
  }

  :global(.callout a) {
    text-decoration: underline;
    color: currentColor;
    text-underline-offset: 4px;
  }
</style>
