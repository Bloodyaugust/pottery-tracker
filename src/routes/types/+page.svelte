<script lang="ts">
  import { dexie } from '$lib/stores/dexie';
  import type { PieceType } from '$lib/types/pieceType';
  import { getModalStore, getToastStore, type ModalSettings } from '@skeletonlabs/skeleton';
  import { liveQuery } from 'dexie';

  const toastStore = getToastStore();
  const modalStore = getModalStore();

  let dbTypes = liveQuery(() => dexie.types.toCollection().sortBy('sortOrder'));
  let newType: string = '';

  async function handleAddTypeClick() {
    await dexie.types.add({
      id: await crypto.randomUUID(),
      name: newType,
      createdAt: new Date().toISOString(),
      sortOrder: $dbTypes.length,
    });

    newType = '';
    toastStore.trigger({
      message: 'Type added!',
    });
  }

  async function handleRemoveTypeClick(type: PieceType) {
    new Promise<boolean>((resolve) => {
      const confirmModal: ModalSettings = {
        type: 'confirm',
        title: 'Confirm Type Removal',
        body: `Are you sure you want to remove the ${type.name} type?`,
        response: (r: boolean) => {
          resolve(r);
        },
      };

      modalStore.trigger(confirmModal);
    }).then((confirmed) => {
      if (confirmed) {
        dexie.types.delete(type.id);
      }
    });
  }
</script>

<div class="flex flex-col gap-4">
  <div class="flex justify-between gap-2">
    <div class="flex flex-col gap-2">
      <label for="new-type">New Type</label>
      <input
        type="text"
        class="input p-2"
        placeholder="A new type"
        id="new-type"
        bind:value={newType}
      />
    </div>
    <button
      type="button"
      class="variant-filled btn"
      on:click={handleAddTypeClick}
      disabled={newType === ''}
    >
      Add Type
    </button>
  </div>
  <hr />
  {#if $dbTypes?.length}
    {#each $dbTypes as type (type.id)}
      <div class="flex">
        <span class="h3 p-4">{type.name}</span>
        <button
          class="variant-filled-warning btn"
          on:click={() => {
            handleRemoveTypeClick(type);
          }}
        >
          Remove Type
        </button>
      </div>
    {/each}
  {/if}
</div>
