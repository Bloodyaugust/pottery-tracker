<script lang="ts">
  import { getDrawerStore } from '@skeletonlabs/skeleton';
  import { page } from '$app/stores';

  const drawerStore = getDrawerStore();

  function drawerClose(): void {
    drawerStore.close();
  }
  console.log($page.url.pathname);
</script>

<nav class="list-nav p-4">
  <ul>
    <li>
      <a class="anchor" class:active={$page.url.pathname === '/'} href="/" on:click={drawerClose}>
        Dashboard
      </a>
    </li>
    <li>
      <a
        class="anchor"
        class:active={$page.url.pathname === '/pieces'}
        href="/pieces"
        on:click={drawerClose}
      >
        Pieces
      </a>
    </li>
    <li>
      <a
        class="anchor"
        class:active={$page.url.pathname === '/todo'}
        href="/todo"
        on:click={drawerClose}
      >
        Todo
      </a>
    </li>
    <li>
      <a
        class="anchor"
        class:active={$page.url.pathname === '/test-tiles'}
        href="/test-tiles"
        on:click={drawerClose}
      >
        Test Tiles
      </a>
    </li>
    <li>
      <a
        class="anchor"
        class:active={$page.url.pathname === '/stages'}
        href="/stages"
        on:click={drawerClose}
      >
        Stages
      </a>
    </li>
  </ul>
</nav>

<style>
  .active {
    background-color: rgb(var(--color-primary-500) / 0.1) !important;
  }
</style>
