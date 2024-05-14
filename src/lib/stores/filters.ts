import { writable } from 'svelte/store';

export const typeFilter = writable<string | undefined>(undefined);
export const saleStageFilter = writable<string | undefined>(undefined);
