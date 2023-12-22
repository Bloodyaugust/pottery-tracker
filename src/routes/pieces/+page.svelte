<script lang="ts">
  import { db } from '$lib/stores/dexie';
  import { liveQuery } from 'dexie';

  let dbPieces = liveQuery(() => db.pieces.toArray());
</script>

<div class="flex flex-col gap-4">
  {#if $dbPieces}
    {#each $dbPieces as piece (piece.id)}
      <div class="flex justify-between !rounded-sm bg-surface-500 !p-4">
        <div class="flex flex-col">
          <span class="h3">{piece.name}</span>
          <!-- <span>{piece.description}</span> -->
        </div>
        <div class="flex flex-col self-end">
          <!-- <span class="variant-filled chip">{piece.stages[0].stage}</span> -->
        </div>
      </div>
    {/each}
  {/if}
</div>

<button type="button" class="variant-filled-primary btn btn-lg fixed bottom-4 right-4">Add</button>
