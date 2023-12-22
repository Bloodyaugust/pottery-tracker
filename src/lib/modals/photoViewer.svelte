<script lang="ts">
  import { photoViewerPhoto } from '$lib/stores/photoViewer';
</script>

<div class="card p-4">
  {#if $photoViewerPhoto}
    <img src={$photoViewerPhoto.base64} alt={$photoViewerPhoto.stage} />
  {/if}
</div>
