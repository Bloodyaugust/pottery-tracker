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

  let dbStages = liveQuery(() => dexie.stages.toCollection().sortBy('sortOrder'));

  $: stageOptions = $dbStages
    ? $dbStages.map((dbStage) => ({ label: dbStage.name, value: dbStage.id }))
    : [];

  let name: string = '';
  let tags: string = '';
  let description: string = '';
  let stage: string = '';
  let stageID: string = '';
  let files: FileList;

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

    let creatingStage;
    if (stageID === '') {
      creatingStage = await dexie.stageHistories.add({
        id: await crypto.randomUUID(),
        stage: $dbStages[0].id,
        startedAt: new Date().toISOString(),
      });
    } else {
      creatingStage = await dexie.stageHistories.add({
        id: await crypto.randomUUID(),
        stage: stageID,
        startedAt: new Date().toISOString(),
      });
    }

    await dexie.pieces.add({
      id: crypto.randomUUID(),
      name,
      photoIDs: photoIDs.join(','),
      createdAt: new Date().toISOString(),
      tags,
      description,
      size: '',
      weight: '',
      clayType: '',
      glaze: '',
      stageIDs: creatingStage,
      firingIDs: '',
    });

    toastStore.trigger({
      message: 'Piece added!',
      timeout: 2000,
    });
    modalStore.close();
  }

  function handleStageSelect(event: CustomEvent<AutocompleteOption<string>>): void {
    stage = event.detail.label;
    stageID = event.detail.value;
  }
</script>

<div class="card p-4">
  <form class="form flex flex-col gap-4" on:submit|preventDefault={handleSubmit}>
    <label class="label">
      <span>Name</span>
      <input class="input p-2" type="text" placeholder="Pot" bind:value={name} required />
    </label>
    <label class="label">
      <span>Tags</span>
      <input class="input p-2" type="text" placeholder="new,amazing" bind:value={tags} />
    </label>
    <label class="label">
      <span>Stage</span>
      <input
        class="autocomplete input p-2"
        type="search"
        name="autocomplete-search"
        bind:value={stage}
        placeholder="Select a stage..."
        use:popup={stagePopupSettings}
      />
      <div
        class="card max-h-48 w-full max-w-sm overflow-y-auto border p-4"
        tabindex="-1"
        data-popup="popupAutocomplete"
      >
        <Autocomplete
          bind:input={stage}
          options={stageOptions}
          on:selection={handleStageSelect}
          regionItem="border-b-2"
        />
      </div>
    </label>
    <label class="label">
      <span>Description</span>
      <textarea
        class="textarea p-2"
        rows="4"
        placeholder="Description for the piece. Notes can go here, too!"
        bind:value={description}
      />
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
