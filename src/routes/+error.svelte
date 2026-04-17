<script lang="ts">
  import { page } from "$app/state";
  import Hero from "$components/modals/hero.svelte";

  const getErrorMessage = (message: string) => {
    return !message || message === "Not Found"
      ? `Sorry, we couldn't find the resource or page you are looking for`
      : message;
  };
</script>

<section>
  <div>
    <Hero />
  </div>

  <div>
    <h1>Oops! Not found.</h1>

    <p>
      {getErrorMessage(page.error?.message || "")}. This might be due to a
      broken link, a mistyped URL, or the page may have been moved or deleted.
      Please
      <a href="/">return to the homepage.</a>
    </p>
  </div>
</section>
