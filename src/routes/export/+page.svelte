<script lang="ts">
  import { dexie } from '$lib/stores/dexie';
  import type { Piece } from '$lib/types/piece';
  import { ProgressRadial } from '@skeletonlabs/skeleton';
  import { liveQuery } from 'dexie';

  let dbPieces = liveQuery(() => dexie.pieces.toCollection().reverse().sortBy('createdAt'));
  let dbTypes = liveQuery(() => dexie.types.toArray());

  let csvUrl: string;

  function handleExportPressed() {
    let csvString: string = 'number,type,price';

    $dbPieces.forEach((piece) => {
      csvString += `\r\n${piece.number},${$dbTypes.find((type) => type.id === piece.type)?.name},${
        piece.price
      }`;
    });

    csvUrl = URL.createObjectURL(new Blob([csvString], { type: 'octet/stream' }));
  }
</script>

<div class="flex flex-col items-center gap-4">
  {#if !$dbPieces || !$dbTypes}
    <ProgressRadial track="stroke-primary-500" />
  {:else}
    {#if $dbPieces && !csvUrl}
      <button class="variant-filled btn" on:click={handleExportPressed}>
        Export {$dbPieces.length} Pieces to CSV
      </button>
    {/if}
    {#if csvUrl}
      <a
        class="variant-filled btn"
        href={csvUrl}
        download="pottery-tracker-export.csv"
        on:click={() => {
          csvUrl = '';
        }}
      >
        Download CSV
      </a>
    {/if}
  {/if}
</div>
