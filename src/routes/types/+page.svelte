<script lang="ts">
  import { dexie } from '$lib/stores/dexie';
  import { getToastStore } from '@skeletonlabs/skeleton';
  import { liveQuery } from 'dexie';

  const toastStore = getToastStore();

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
    <button type="button" class="variant-filled btn" on:click={handleAddTypeClick}>Add Type</button>
  </div>
  <hr />
  {#if $dbTypes?.length}
    {#each $dbTypes as type (type.id)}
      <span class="h3">{type.name}</span>
    {/each}
  {/if}
</div>
