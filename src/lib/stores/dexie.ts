import type { Photo } from '$lib/types/photo';
import type { Piece } from '$lib/types/piece';
import Dexie, { type Table } from 'dexie';

export class MySubClassedDexie extends Dexie {
  pieces!: Table<Piece>;
  photos!: Table<Photo>;

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      pieces: 'id, name',
      photos: 'id',
    });
  }
}

export const dexie = new MySubClassedDexie();
