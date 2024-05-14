<script lang="ts">
  import { dexie } from '$lib/stores/dexie';
  import { convertToBase64 } from '$lib/util/image';
  import {
    Autocomplete,
    getModalStore,
    getToastStore,
    popup,
    type AutocompleteOption,
    type PopupSettings,
  } from '@skeletonlabs/skeleton';
  import { liveQuery } from 'dexie';

  const stagePopupSettings: PopupSettings = {
    event: 'focus-click',
    target: 'popupAutocomplete',
    placement: 'bottom',
  };

  const modalStore = getModalStore();
  const toastStore = getToastStore();

  let dbTypes = liveQuery(() => dexie.types.toCollection().sortBy('sortOrder'));
  let dbSaleStages = liveQuery(() => dexie.saleStages.toCollection().sortBy('sortOrder'));
  let dbNumPieces = liveQuery(() => dexie.pieces.toCollection().count());

  $: typeOptions = $dbTypes
    ? $dbTypes.map((dbType) => ({ label: dbType.name, value: dbType.id }))
    : [];
  $: saleStageOptions = $dbSaleStages
    ? $dbSaleStages.map((dbSaleStage) => ({ label: dbSaleStage.name, value: dbSaleStage.id }))
    : [];
  $: nextPieceNum = $dbNumPieces ? $dbNumPieces + 100 : 100;

  let files: FileList;
  let price: number = 0;
  let type: string = '';
  let typeID: string = '';

  async function handleSubmit() {
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

    await dexie.pieces.add({
      id: crypto.randomUUID(),
      photoIDs: photoIDs.join(','),
      createdAt: new Date().toISOString(),
      type: typeID,
      number: nextPieceNum,
      price,
      saleStage: saleStageOptions[0].value,
      soldAmount: 0,
      soldDate: '',
    });

    toastStore.trigger({
      message: 'Piece added!',
      timeout: 2000,
    });
    modalStore.close();
  }

  function handleTypeSelect(event: CustomEvent<AutocompleteOption<string>>): void {
    type = event.detail.label;
    typeID = event.detail.value;
  }
</script>

<div class="card p-4">
  <form class="form flex flex-col gap-4" on:submit|preventDefault={handleSubmit}>
    <label class="label">
      <span>Number</span>
      <input class="input p-2" type="text" bind:value={nextPieceNum} required disabled />
    </label>
    <label class="label">
      <span>Price</span>
      <input class="input p-2" type="text" bind:value={price} required />
    </label>
    <label class="label">
      <span>Type</span>
      <input
        class="autocomplete input p-2"
        type="search"
        name="autocomplete-search"
        bind:value={type}
        placeholder="Select a type..."
        use:popup={stagePopupSettings}
        autocomplete="off"
      />
      <div
        class="card max-h-48 w-full max-w-sm overflow-y-auto border p-4"
        tabindex="-1"
        data-popup="popupAutocomplete"
      >
        <Autocomplete
          bind:input={type}
          options={typeOptions}
          on:selection={handleTypeSelect}
          regionItem="border-b-2"
        />
      </div>
    </label>
    <label class="label">
      <span>Photos</span>
      <input
        class="input p-2"
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        bind:files
      />
    </label>
    <input class="input mt-4 p-2" type="submit" value="Add Piece" />
  </form>
</div>
