<script lang="ts">
  import { dexie } from '$lib/stores/dexie';
  import type { Stage } from '$lib/types/stage';
  import { onMount } from 'svelte';

  let stages: Stage[] = [];
  let newStage: string;

  onMount(async () => {
    stages = await dexie.stages.toCollection().sortBy('sortOrder');
  });

  async function handleSubmit() {
    await dexie.stages.add({
      id: await crypto.randomUUID(),
      name: newStage,
      createdAt: new Date().toISOString(),
      sortOrder: stages.length,
    });

    stages = await dexie.stages.toCollection().sortBy('sortOrder');

    newStage = '';
  }
  async function handleRemoveStageClick(removingStage: Stage) {
    await dexie.transaction('rw', dexie.stages, async () => {
      stages = stages.filter((stage) => stage.id !== removingStage.id);

      await dexie.stages.delete(removingStage.id);

      let index = 0;
      for (const stage of stages) {
        await dexie.stages.update(stage.id, {
          sortOrder: index,
        });

        index++;
      }
    });
  }
  async function handleMoveStage(stage: Stage, direction: 'up' | 'down') {
    const swappingStageSortOrder: number =
      direction === 'up' ? stage.sortOrder - 1 : stage.sortOrder + 1;

    await dexie.transaction('rw', dexie.stages, async () => {
      const swappingStage = await dexie.stages
        .where('sortOrder')
        .equals(swappingStageSortOrder)
        .first();

      if (swappingStage) {
        if (direction === 'up') {
          await dexie.stages.update(swappingStage.id, {
            sortOrder: swappingStage.sortOrder + 1,
          });
        } else {
          await dexie.stages.update(swappingStage.id, {
            sortOrder: swappingStage.sortOrder - 1,
          });
        }
      }

      await dexie.stages.update(stage.id, {
        sortOrder: swappingStageSortOrder,
      });
    });

    stages = await dexie.stages.toCollection().sortBy('sortOrder');
  }
</script>

<div class="flex flex-col gap-4">
  {#if stages.length === 0}
    <span>No stages yet! Add one below.</span>
  {:else}
    {#each stages as stage, index (stage.id)}
      <div class="card flex items-center justify-between p-4">
        <span>{stage.name}</span>
        <div class="flex gap-2">
          <button
            class="variant-filled btn btn-sm max-h-8 self-center"
            on:click={() => handleRemoveStageClick(stage)}
          >
            Remove
          </button>
          <div class="flex flex-col gap-2">
            <button
              class="btn-icon btn-icon-sm"
              disabled={stages.length === 1 || index === 0}
              on:click={() => handleMoveStage(stage, 'up')}
            >
              🔼
            </button>
            <button
              class="btn-icon btn-icon-sm"
              disabled={stages.length === 1 || index === stages.length - 1}
              on:click={() => handleMoveStage(stage, 'down')}
            >
              🔽
            </button>
          </div>
        </div>
      </div>
    {/each}
  {/if}
  <hr />
  <form class="form flex flex-col gap-4" on:submit|preventDefault={handleSubmit}>
    <label class="label">
      <span>Name</span>
      <input
        class="input p-2"
        type="text"
        placeholder="Bisque Firing"
        bind:value={newStage}
        required
      />
    </label>
    <input class="input mt-4 p-2" type="submit" value="Add Stage" />
  </form>
</div>
