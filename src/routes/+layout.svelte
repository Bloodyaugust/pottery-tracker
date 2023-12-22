<script lang="ts">
  import {
    AppBar,
    AppShell,
    initializeStores,
    Drawer,
    getDrawerStore,
    autoModeWatcher,
    Modal,
    type ModalComponent,
    Toast,
  } from '@skeletonlabs/skeleton';
  import Navigation from '$lib/navigation.svelte';
  import newPieceModal from '$lib/modals/newPieceModal.svelte';
  import PhotoViewer from '$lib/modals/photoViewer.svelte';

  import '../app.pcss';

  initializeStores();

  const modalRegistry: Record<string, ModalComponent> = {
    newPieceModal: { ref: newPieceModal },
    photoViewer: { ref: PhotoViewer },
  };

  const drawerStore = getDrawerStore();

  function drawerOpen(): void {
    drawerStore.open({});
  }
</script>

<svelte:head>
  {@html `<script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}
  {@html `<link rel="manifest" href="manifest.json" />`}
</svelte:head>

<Drawer>
  <Navigation />
</Drawer>
<Modal components={modalRegistry} />
<Toast />
<AppShell slotSidebarLeft="bg-surface-500/5 w-0 lg:w-64">
  <svelte:fragment slot="header">
    <AppBar>
      <svelte:fragment slot="lead">
        <div class="flex items-center">
          <button class="btn btn-sm mr-4 lg:hidden" on:click={drawerOpen}>
            <span>
              <svg viewBox="0 0 100 80" class="fill-token h-4 w-4">
                <rect width="100" height="20" />
                <rect y="30" width="100" height="20" />
                <rect y="60" width="100" height="20" />
              </svg>
            </span>
          </button>
          <strong class="text-xl uppercase">Pottery Tracker</strong>
        </div>
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>
  <svelte:fragment slot="sidebarLeft"><Navigation /></svelte:fragment>
  <!-- (sidebarRight) -->
  <!-- (pageHeader) -->
  <!-- Router Slot -->
  <div class="body-container">
    <slot />
  </div>
  <!-- ---- / ---- -->
  <!-- (pageFooter) -->
  <!-- (footer) -->
</AppShell>

<style>
  .body-container {
    padding: 1rem;
  }
</style>
