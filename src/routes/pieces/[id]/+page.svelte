<script lang="ts">
  import { dexie } from '$lib/stores/dexie';
  import { liveQuery } from 'dexie';
  import {
    Autocomplete,
    getModalStore,
    getToastStore,
    popup,
    type AutocompleteOption,
    type PopupSettings,
  } from '@skeletonlabs/skeleton';
  import type { PageData } from './$types';
  import type { Photo } from '$lib/types/photo';
  import { photoViewerPhoto } from '$lib/stores/photoViewer';

  export let data: PageData;

  const singleSelectPopupSettings: PopupSettings = {
    event: 'focus-click',
    target: 'popupAutocomplete',
    placement: 'bottom',
  };

  const modalStore = getModalStore();
  const toastStore = getToastStore();

  let piece = liveQuery(() => dexie.pieces.get(data.id));
  let dbTypes = liveQuery(() => dexie.types.toCollection().sortBy('sortOrder'));
  let dbSaleStages = liveQuery(() => dexie.saleStages.toCollection().sortBy('sortOrder'));

  let typeSearch: string = '';

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
  $: typeOptions = types.map((pieceType) => ({ label: pieceType.name, value: pieceType.id }));
  $: selectedType = typeOptions
    ? types.find((pieceType) => pieceType.id === hydratedPiece.type)
    : undefined;

  $: photos = liveQuery(() => dexie.photos.bulkGet(hydratedPiece.photoIDs.split(',')));
  $: hydratedPhotos = $photos ? ($photos.filter((photo) => photo !== undefined) as Photo[]) : [];

  async function handleTypeSelect(event: CustomEvent<AutocompleteOption<string>>) {
    await dexie.pieces.update(hydratedPiece.id, {
      type: event.detail.value,
    });

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
      <label class="label">
        <span>Type</span>
        <input
          class="autocomplete input p-2"
          type="search"
          name="autocomplete-search"
          bind:value={typeSearch}
          placeholder="Select a type..."
          use:popup={singleSelectPopupSettings}
        />
        <div
          class="card max-h-48 w-full max-w-sm overflow-y-auto border p-4"
          tabindex="-1"
          data-popup="popupAutocomplete"
        >
          <Autocomplete
            bind:input={hydratedPiece.type}
            options={typeOptions}
            on:selection={handleTypeSelect}
            regionItem="border-b-2"
          />
        </div>
      </label>
      <span>{saleStages.find((saleStage) => saleStage.id === hydratedPiece.saleStage)?.name}</span>
    </div>
  </div>

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
