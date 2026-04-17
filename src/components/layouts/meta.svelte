<script lang="ts">
  import { page } from "$app/state";
  import { site } from "$lib/client/site";
  import { onMount } from "svelte";

  let meta = $derived(page.data.meta || site);

  let { description, title } = $derived(meta);

  let { url, origin } = $derived.by(() => {
    const { origin } = page.url;
    const url = `${origin}${page.url.pathname}`;

    return { url, origin };
  });

  let imageSrc = $derived.by(() => {
    const { image } = meta;
    const src = image.startsWith("/") ? image : `/${image}`;
    return image.startsWith("http") ? image : `${origin}${src}`;
  });

  let isDark = $state(false);
  let themeColor = $derived(isDark ? "#efefef" : "#151515");

  onMount(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    isDark = media.matches;

    media.addEventListener("change", (e) => {
      isDark = e.matches;
    });
  });
</script>

<svelte:head>
  <title>{title}</title>

  <meta name="theme-color" content={themeColor} />

  <meta name="title" content={title} />
  <meta name="description" content={description} />

  <meta property="og:type" content="website" />
  <meta property="og:url" content={url} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />

  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={url} />
  <meta property="twitter:title" content={title} />
  <meta property="twitter:description" content={description} />
  <meta property="og:image" content={imageSrc} />
  <meta property="twitter:image" content={imageSrc} />
</svelte:head>
