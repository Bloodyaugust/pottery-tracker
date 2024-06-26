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
  import { convertToBase64 } from '$lib/util/image';

  export let data: PageData;

  const singleSelectPopupSettings: PopupSettings = {
    event: 'focus-click',
    target: '',
    placement: 'bottom',
  };

  const modalStore = getModalStore();
  const toastStore = getToastStore();

  let piece = liveQuery(() => dexie.pieces.get(data.id));
  let dbTypes = liveQuery(() => dexie.types.toCollection().sortBy('sortOrder'));
  let dbSaleStages = liveQuery(() => dexie.saleStages.toCollection().sortBy('sortOrder'));

  let files: FileList;
  let fileInput: HTMLInputElement;
  let price: number = 0;
  let soldAmount: number = 0;
  let soldDate: string = '';
  let typeSearch: string = '';
  let saleStageSearch: string = '';

  $: hydratedPiece = $piece
    ? $piece
    : {
        id: '',
        photoIDs: '',
        createdAt: '',
        type: '',
        number: 100,
        saleStage: '',
        price: 0,
        soldDate: '',
        soldAmount: 0,
      };
  $: types = $dbTypes ? $dbTypes : [];
  $: saleStages = $dbSaleStages ? $dbSaleStages : [];
  $: typeOptions = types.map((pieceType) => ({ label: pieceType.name, value: pieceType.id }));
  $: saleStageOptions = saleStages.map((saleStage) => ({
    label: saleStage.name,
    value: saleStage.id,
  }));
  $: selectedType = typeOptions
    ? types.find((pieceType) => pieceType.id === hydratedPiece.type)
    : undefined;
  $: selectedSaleStage = saleStageOptions
    ? saleStages.find((saleStage) => saleStage.id === hydratedPiece.saleStage)
    : undefined;

  $: photos = liveQuery(() => dexie.photos.bulkGet(hydratedPiece.photoIDs.split(',')));
  $: hydratedPhotos = $photos ? ($photos.filter((photo) => photo !== undefined) as Photo[]) : [];
  $: selectedType, setTypeSearch(selectedType?.name || '');
  $: selectedSaleStage, setSaleStageSearch(selectedSaleStage?.name || '');
  $: hydratedPiece, setPrice(hydratedPiece.price);
  $: hydratedPiece, setSoldAmount(hydratedPiece.soldAmount);
  $: hydratedPiece, setSoldDate(hydratedPiece.soldDate);

  function setPrice(value: number) {
    price = value;
  }

  function setSoldAmount(value: number) {
    soldAmount = value;
  }

  function setSoldDate(value: string) {
    soldDate = value;
  }

  function setTypeSearch(value: string) {
    typeSearch = value;
  }

  function setSaleStageSearch(value: string) {
    saleStageSearch = value;
  }

  async function handleSaleStageSelect(event: CustomEvent<AutocompleteOption<string>>) {
    await dexie.pieces.update(hydratedPiece.id, {
      saleStage: event.detail.value,
    });

    toastStore.trigger({
      message: 'Piece Saved!',
    });
  }
  async function handleAddPhotos() {
    const photoIDs: string[] = [];

    if (files) {
      for (const file of files) {
        const fileBase64 = await convertToBase64(file);

        const newPhotoID = (await dexie.photos.add({
          id: crypto.randomUUID(),
          base64: fileBase64 as string,
          stage: 'test',
          createdAt: new Date().toISOString(),
        })) as string;

        photoIDs.push(newPhotoID);
      }
    }

    for (const photoID of photoIDs) {
      await dexie.pieces.update(hydratedPiece.id, {
        photoIDs: hydratedPiece.photoIDs + `,${photoID}`,
      });
    }

    fileInput.value = '';
  }
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
  async function handlePriceBlur() {
    await dexie.pieces.update(hydratedPiece.id, {
      price,
    });

    toastStore.trigger({
      message: 'Piece Saved!',
    });
  }
  async function handleSoldAmountBlur() {
    await dexie.pieces.update(hydratedPiece.id, {
      soldAmount,
    });

    toastStore.trigger({
      message: 'Piece Saved!',
    });
  }
  async function handleSoldDateBlur() {
    await dexie.pieces.update(hydratedPiece.id, {
      soldDate,
    });

    toastStore.trigger({
      message: 'Piece Saved!',
    });
  }
</script>

<div class="flex flex-col gap-4">
  <h2 class="h2">{hydratedPiece.number}</h2>
  <div class="flex gap-4">
    <div class="flex gap-2">
      <label class="label">
        <span>Type</span>
        <input
          autocomplete="off"
          class="autocomplete input p-2"
          type="search"
          name="type-search"
          bind:value={typeSearch}
          placeholder="Select a type..."
          use:popup={{ ...singleSelectPopupSettings, target: 'type' }}
        />
        <div
          class="card max-h-48 w-full max-w-sm overflow-y-auto border p-4"
          tabindex="-1"
          data-popup="type"
        >
          <Autocomplete
            bind:input={typeSearch}
            options={typeOptions}
            on:selection={handleTypeSelect}
            regionItem="border-b-2"
          />
        </div>
      </label>
      <label class="label">
        <span>Sale Stage</span>
        <input
          autocomplete="off"
          class="autocomplete input p-2"
          type="search"
          name="sale-stage-search"
          bind:value={saleStageSearch}
          placeholder="Select a type..."
          use:popup={{ ...singleSelectPopupSettings, target: 'saleStage' }}
        />
        <div
          class="card max-h-48 w-full max-w-sm overflow-y-auto border p-4"
          tabindex="-1"
          data-popup="saleStage"
        >
          <Autocomplete
            bind:input={saleStageSearch}
            options={saleStageOptions}
            on:selection={handleSaleStageSelect}
            regionItem="border-b-2"
          />
        </div>
      </label>
    </div>
  </div>
  <div class="flex gap-4">
    <div class="flex flex-col gap-2">
      <label for="price">Price</label>
      <input
        type="number"
        class="input p-2"
        id="price"
        bind:value={price}
        on:blur={handlePriceBlur}
      />
    </div>
  </div>

  {#if selectedSaleStage?.name === 'Sold'}
    <div class="flex gap-4">
      <div class="flex flex-col gap-2">
        <label for="sold-amount">Sale Amount</label>
        <input
          type="number"
          class="input p-2"
          id="sold-amount"
          bind:value={soldAmount}
          on:blur={handleSoldAmountBlur}
        />
      </div>
      <div class="flex flex-col gap-2">
        <label for="sold-date">Sale Date</label>
        <input
          type="date"
          class="input p-2"
          id="sold-date"
          bind:value={soldDate}
          on:blur={handleSoldDateBlur}
        />
      </div>
    </div>
  {/if}

  <div class="flex gap-4">
    <div class="flex flex-col gap-2">
      <label for="addPhotos">Add Photos</label>
      <input
        class="input p-2"
        type="file"
        accept="image/*"
        capture="environment"
        id="addPhotos"
        multiple
        bind:files
        bind:this={fileInput}
        on:change={handleAddPhotos}
      />
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
