<script lang="ts">
  import { getDrawerStore } from '@skeletonlabs/skeleton';
  import { page } from '$app/stores';
  import { base } from '$app/paths';

  const drawerStore = getDrawerStore();

  function drawerClose(): void {
    drawerStore.close();
  }
</script>

<nav class="list-nav p-4">
  <ul>
    <li>
      <a
        class="anchor"
        class:active={$page.url.pathname === '/'}
        href="{base}/"
        on:click={drawerClose}
      >
        Dashboard
      </a>
    </li>
    <li>
      <a
        class="anchor"
        class:active={$page.url.pathname === '/pieces'}
        href="{base}/pieces"
        on:click={drawerClose}
      >
        Pieces
      </a>
    </li>
    <li>
      <a
        class="anchor"
        class:active={$page.url.pathname === '/types'}
        href="{base}/types"
        on:click={drawerClose}
      >
        Types
      </a>
    </li>
    <li>
      <a
        class="anchor"
        class:active={$page.url.pathname === '/export'}
        href="{base}/export"
        on:click={drawerClose}
      >
        Export
      </a>
    </li>
  </ul>
</nav>

<style>
  .active {
    background-color: rgb(var(--color-primary-500) / 0.1);
  }
</style>
