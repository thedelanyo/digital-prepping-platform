<script lang="ts">
  import { enhance } from "$app/forms";
  import Drawer from "./drawer.svelte";
  import Spinner from "./spinner.svelte";

  let { loading = false, submit = null } = $props();
</script>

<Drawer>
  <form method="POST" use:enhance={submit}>
    <div class="div">
      <label for="name">Enter your name</label>
      <input type="text" name="name" id="name" />
    </div>

    <button>
      <Spinner {loading} />
      <span>submit</span>
    </button>
  </form>
</Drawer>

<style>
  form {
    display: flex;
    flex-direction: column;
    padding: 2rem 1rem;
    gap: 3rem;
  }
</style>
