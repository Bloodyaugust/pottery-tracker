import { writable } from 'svelte/store';

export const tagFilter = writable<string | undefined>(undefined);
