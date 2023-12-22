import { writable } from 'svelte/store';

export const storagePersistent = writable<boolean | undefined>(undefined);
