<script lang="ts">
  import { base } from '$app/paths';
  import { dexie } from '$lib/stores/dexie';
  import { saleStageFilter, typeFilter } from '$lib/stores/filters';
  import { photoViewerPhoto } from '$lib/stores/photoViewer';
  import type { Photo } from '$lib/types/photo';
  import type { HydratedPiece } from '$lib/types/piece';
  import { getModalStore } from '@skeletonlabs/skeleton';
  import { liveQuery } from 'dexie';

  const modalStore = getModalStore();

  let dbPieces = liveQuery(() => dexie.pieces.toCollection().reverse().sortBy('createdAt'));
  let dbPhotos = liveQuery(() => dexie.photos.toCollection().sortBy('createdAt'));
  let dbTypes = liveQuery(() => dexie.types.toCollection().sortBy('sortOrder'));
  let dbSaleStages = liveQuery(() => dexie.saleStages.toCollection().sortBy('sortOrder'));
  let hydratedPieces: HydratedPiece[] = [];
  let filteredPieces: HydratedPiece[] = [];

  $: types = $dbTypes ? $dbTypes : [];
  $: saleStages = $dbSaleStages ? $dbSaleStages : [];
  $: hydratedPieces =
    $dbPieces && $dbPhotos
      ? $dbPieces.map((piece) => ({
          ...piece,
          photos:
            piece.photoIDs !== ''
              ? (piece.photoIDs
                  .split(',')
                  .map((photoId) => $dbPhotos.find((photo) => photo.id === photoId))
                  .filter((photo) => photo !== undefined) as Photo[])
              : [],
        }))
      : [];

  $: {
    let filteringPieces = hydratedPieces;

    if ($typeFilter) {
      filteringPieces = filteringPieces.filter((piece) => piece.type === $typeFilter);
    }

    if ($saleStageFilter) {
      filteringPieces = filteringPieces.filter((piece) => piece.saleStage == $saleStageFilter);
    }

    filteredPieces = filteringPieces;
  }

  function onAddPiece() {
    modalStore.trigger({
      type: 'component',
      component: 'newPieceModal',
    });
  }

  function handlePhotoClick(photo: Photo) {
    photoViewerPhoto.update(() => photo);
    modalStore.trigger({
      type: 'component',
      component: 'photoViewer',
    });
  }

  function handleTypeClick(type: string) {
    typeFilter.update(() => type);
  }

  function handleSaleStageClick(type: string) {
    saleStageFilter.update(() => type);
  }
</script>

<div class="flex flex-col gap-4">
  {#if filteredPieces.length}
    {#each filteredPieces as piece (piece.id)}
      <div class="item flex gap-2 !rounded-sm bg-surface-500 !p-4">
        <div class="flex flex-1 flex-col gap-2 overflow-hidden">
          <a class="anchor h3" href="{base}/pieces/{piece.id}">{piece.number}</a>
          <div class="flex gap-2">
            {#if piece.type === ''}
              <span>No Type</span>
            {:else}
              <button class="variant-filled chip" on:click={() => handleTypeClick(piece.type)}>
                {types.find((pieceType) => pieceType.id === piece.type)?.name}
              </button>
              <button
                class="variant-filled chip"
                on:click={() => handleSaleStageClick(piece.saleStage)}
              >
                {saleStages.find((saleStage) => saleStage.id === piece.saleStage)?.name}
              </button>
            {/if}
            <span>${piece.price}</span>
          </div>
        </div>
        <div class="photos-container flex flex-1 gap-2 overflow-x-auto overflow-y-clip">
          {#each piece.photos as photo (photo.id)}
            <button on:click={() => handlePhotoClick(photo)}>
              <img src={photo.base64} alt={`${piece.number}`} />
            </button>
          {/each}
        </div>
      </div>
    {/each}
  {:else}
    <span>No pieces</span>
  {/if}
</div>

<button
  type="button"
  class="variant-filled-primary btn btn-lg fixed bottom-4 right-4"
  on:click={onAddPiece}
>
  Add
</button>

<style>
  img {
    height: 68px;
    object-fit: scale-down;
    max-width: 68px;
  }
  .item {
    height: 100px;
  }

  .photos-container {
    flex-direction: row-reverse;
    justify-content: end;
  }
</style>
