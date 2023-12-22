import type { Photo } from '$lib/types/photo';
import { writable } from 'svelte/store';

export const photoViewerPhoto = writable<Photo | undefined>(undefined);
