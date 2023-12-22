<script lang="ts">
  import { dexie } from '$lib/stores/dexie';
  import { convertToBase64 } from '$lib/util/image';

  let name: string;
  let tags: string;
  let description: string;
  let files: FileList;
  async function handleSubmit() {
    const photoIDs: string[] = [];
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

    await dexie.pieces.add({
      id: crypto.randomUUID(),
      name,
      photoIDs: photoIDs.join(','),
      createdAt: new Date().toISOString(),
      tags,
      description,
    });
  }
</script>

<div class="card p-4">
  <form class="form flex flex-col gap-4" on:submit|preventDefault={handleSubmit}>
    <label class="label">
      <span>Name</span>
      <input class="input p-2" type="text" placeholder="Pot" bind:value={name} />
    </label>
    <label class="label">
      <span>Tags</span>
      <input class="input p-2" type="text" placeholder="new,amazing" bind:value={tags} />
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
      <input class="input p-2" type="file" accept="image/*" multiple bind:files />
    </label>
    <input class="input mt-4 p-2" type="submit" value="Add Piece" />
  </form>
</div>
