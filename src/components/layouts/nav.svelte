<script>
  import Drawer from "$components/modals/drawer.svelte";
  import Svg from "$components/modals/svg.svelte";
  import { courses } from "$lib/client/courses";
  import { arrowRightIcons, homeIcons, userIcons } from "$lib/client/icons";

  let { is_open = $bindable(false) } = $props();

  const onclick = () => {
    is_open = false;
  };
</script>

<Drawer title="Navigation" onclose={onclick}>
  <div class="nav">
    <div class="courses">
      <div class="flow-wide">
        <a href="/" class="ghost" {onclick}>
          <span>Home</span>
          <Svg ds={homeIcons} />
        </a>

        <a href="/profile" class="ghost" {onclick}>
          <span>Profile</span>
          <Svg ds={userIcons} />
        </a>
      </div>

      {#each courses as { id, title }}
        <a href="/preps?course={id}" class="ghost" {onclick}>
          <span>{title}</span>
          <Svg ds={arrowRightIcons} />
        </a>
      {/each}
    </div>
  </div>
</Drawer>

<style>
  .nav {
    padding: 2rem 1rem;
  }

  .courses {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    a.ghost {
      display: flex;
      flex-direction: row;
      align-items: center;
      color: currentColor;
      justify-content: space-between;
      padding: 0.6rem 1rem;
    }

    .flow-wide .ghost {
      width: 100%;
    }
  }
</style>
