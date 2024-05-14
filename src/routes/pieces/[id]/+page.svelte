<script lang="ts">
  import { dexie } from '$lib/stores/dexie';
  import { liveQuery } from 'dexie';
  import type { PageData } from './$types';
  import type { Photo } from '$lib/types/photo';
  import { getModalStore, getToastStore } from '@skeletonlabs/skeleton';
  import { photoViewerPhoto } from '$lib/stores/photoViewer';

  export let data: PageData;

  const modalStore = getModalStore();
  const toastStore = getToastStore();

  let piece = liveQuery(() => dexie.pieces.get(data.id));
  let dbTypes = liveQuery(() => dexie.types.toCollection().sortBy('sortOrder'));
  let dbSaleStages = liveQuery(() => dexie.saleStages.toCollection().sortBy('sortOrder'));

  $: hydratedPiece = $piece
    ? $piece
    : {
        id: '',
        photoIDs: '',
        createdAt: '',
        type: '',
        number: 100,
        saleStage: '',
      };
  $: types = $dbTypes ? $dbTypes : [];
  $: saleStages = $dbSaleStages ? $dbSaleStages : [];

  $: photos = liveQuery(() => dexie.photos.bulkGet(hydratedPiece.photoIDs.split(',')));
  $: hydratedPhotos = $photos ? ($photos.filter((photo) => photo !== undefined) as Photo[]) : [];

  async function handleSubmit() {
    toastStore.trigger({
      message: 'Piece Saved!',
    });
  }
  async function handlePhotoClick(photo: Photo) {
    photoViewerPhoto.update(() => photo);
    modalStore.trigger({
      type: 'component',
      component: 'photoViewer',
    });
  }
</script>

<div class="flex flex-col gap-4">
  <div class="flex gap-4">
    <h2 class="h2">{hydratedPiece.number}</h2>
    <div class="flex gap-2">
      <span>{types.find((pieceType) => pieceType.id === hydratedPiece.type)?.name}</span>
      <span>{saleStages.find((saleStage) => saleStage.id === hydratedPiece.saleStage)?.name}</span>
    </div>
  </div>

  <form class="form flex flex-col gap-4" on:submit|preventDefault={handleSubmit}>
    <input class="input mt-4 p-2" type="submit" value="Save Piece" />
  </form>
  <div class="photos-container flex flex-1 gap-2 overflow-x-auto overflow-y-clip">
    {#each hydratedPhotos as photo (photo.id)}
      <button on:click={() => handlePhotoClick(photo)}>
        <img src={photo.base64} alt={`${hydratedPiece.number}`} />
      </button>
    {/each}
  </div>
</div>

<style>
  .photos-container {
    flex-direction: row-reverse;
    justify-content: end;
  }
</style>
