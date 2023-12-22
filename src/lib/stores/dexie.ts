import type { Piece } from '$lib/types/piece';
import Dexie, { type Table } from 'dexie';

export class MySubClassedDexie extends Dexie {
  pieces!: Table<Piece>;

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      pieces: '++id, name',
    });
  }
}

export const db = new MySubClassedDexie();
