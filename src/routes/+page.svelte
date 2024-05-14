<script lang="ts">
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { dexie } from '$lib/stores/dexie';
  import { getToastStore } from '@skeletonlabs/skeleton';
  import { liveQuery } from 'dexie';

  const toastStore = getToastStore();

  let dbPieces = liveQuery(() => dexie.pieces.toCollection().reverse().sortBy('createdAt'));
  let pieceNumberSearch: string = '';

  function handleGoToPieceClick() {
    const pieceNumber: number = parseInt(pieceNumberSearch, 10);

    if (!isNaN(pieceNumber)) {
      const navigatingPiece = $dbPieces.find((piece) => piece.number === pieceNumber);

      if (navigatingPiece) {
        goto(`${base}/pieces/${navigatingPiece.id}`);
      } else {
        pieceNumberSearch = '';
        toastStore.trigger({
          message: 'Piece not found',
          background: 'variant-filled-error',
        });
      }
    } else {
      pieceNumberSearch = '';
      toastStore.trigger({
        message: 'Search must be a number',
        background: 'variant-filled-error',
      });
    }
  }
</script>

<div class="flex flex-col gap-2">
  <div class="flex gap-2">
    <label for="piece-number">Piece Number</label>
    <input
      type="text"
      class="input p-2"
      bind:value={pieceNumberSearch}
      placeholder="100"
      id="piece-number"
    />
    <button
      type="button"
      class="variant-filled btn"
      on:click={handleGoToPieceClick}
      disabled={pieceNumberSearch === ''}
    >
      Go To Piece
    </button>
  </div>
</div>
