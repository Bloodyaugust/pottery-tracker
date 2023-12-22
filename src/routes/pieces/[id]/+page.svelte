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

  let synchronized: boolean = false;

  let piece = liveQuery(() => dexie.pieces.get(data.id));
  $: hydratedPiece = $piece
    ? $piece
    : {
        id: '',
        name: '',
        photoIDs: '',
        createdAt: '',
        tags: '',
        description: '',
        size: '',
        weight: '',
        clayType: '',
        glaze: '',
        stageIDs: '',
        firingIDs: '',
      };
  $: tags = hydratedPiece.tags === '' ? [] : hydratedPiece.tags.split(',');
  let description = '';

  $: if ($piece && !synchronized) {
    description = $piece.description;
    synchronized = true;
  }

  $: photos = liveQuery(() => dexie.photos.bulkGet(hydratedPiece.photoIDs.split(',')));
  $: hydratedPhotos = $photos ? ($photos.filter((photo) => photo !== undefined) as Photo[]) : [];

  async function handleTagClick(removingTag: string) {
    await dexie.pieces.update(hydratedPiece.id, {
      tags: [...tags].filter((tag) => tag !== removingTag).join(','),
    });
  }

  async function handleSubmit() {
    await dexie.pieces.update(hydratedPiece.id, {
      description: description,
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
    <h2 class="h2">{hydratedPiece.name}</h2>
    <div class="flex gap-2">
      {#each tags as tag}
        <button class="variant-filled chip" on:click={() => handleTagClick(tag)}>
          {tag} x
        </button>
      {/each}
    </div>
  </div>

  <form class="form flex flex-col gap-4" on:submit|preventDefault={handleSubmit}>
    <label class="label">
      <span>Description</span>
      <textarea
        class="textarea p-2"
        rows="4"
        placeholder="Description for the piece. Notes can go here, too!"
        bind:value={description}
      />
    </label>
    <input class="input mt-4 p-2" type="submit" value="Save Piece" />
  </form>
  <div class="photos-container flex flex-1 gap-2 overflow-x-auto overflow-y-clip">
    {#each hydratedPhotos as photo (photo.id)}
      <button on:click={() => handlePhotoClick(photo)}>
        <img src={photo.base64} alt={hydratedPiece.name} />
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
