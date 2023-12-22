<script lang="ts">
  import { storagePersistent } from '$lib/stores/persistentStorage';
  import { getToastStore } from '@skeletonlabs/skeleton';
  import { onMount } from 'svelte';

  const toastStore = getToastStore();

  onMount(async () => {
    if ($storagePersistent === undefined) {
      const persistent = await navigator.storage.persisted();

      if (persistent) {
        storagePersistent.set(true);
      } else {
        storagePersistent.set(false);
        toastStore.trigger({
          message:
            'Persistent storage has not been enabled, your data in this app is at risk of being deleted by the browser. To fix, please save this app to your home screen or enable the permission when asked.',
          autohide: false,
          background: 'variant-filled-warning',
          action: {
            label: 'Enable Persistent Storage',
            response: async () => {
              const newPersist = await navigator.storage.persist();

              if (newPersist) {
                toastStore.trigger({
                  message: 'Persistent storage enabled!',
                });
              } else {
                toastStore.trigger({
                  message:
                    'Failed to enable persistent storage, please add this app to your home screen.',
                  autohide: false,
                  background: 'variant-filled-error',
                });
              }
            },
          },
        });
      }
    }
  });
</script>
