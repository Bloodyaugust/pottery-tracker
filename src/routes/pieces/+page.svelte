<script lang="ts">
  import { pieces } from '$lib/stores/pieces';
</script>

<div class="flex flex-col gap-4">
  {#each $pieces as piece, i (piece.id)}
    <div class="flex justify-between !rounded-sm bg-surface-500 !p-4">
      <div class="flex flex-col">
        <span class="h3">{piece.name}</span>
        <span>{piece.description}</span>
      </div>
      <div class="flex flex-col self-end">
        <span class="variant-filled chip">{piece.stages[0].stage}</span>
      </div>
    </div>
  {/each}
</div>

<button type="button" class="variant-filled-primary btn btn-lg fixed bottom-4 right-4">Add</button>
