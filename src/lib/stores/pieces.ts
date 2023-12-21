import type { Piece } from '$lib/types/piece';
import { writable } from 'svelte/store';

export const pieces = writable<Piece[]>([
  {
    name: 'Test Piece',
    id: '0',
    description: 'A cool little piece of pottery',
    stages: [
      {
        stage: 'Bisque Firing',
      },
    ],
  },
  {
    name: 'Test Piece 2',
    id: '1',
    description: 'A cool little piece of pottery',
    stages: [
      {
        stage: 'Bisque Firing',
      },
    ],
  },
]);
