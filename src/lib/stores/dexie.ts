import type { Photo } from '$lib/types/photo';
import type { Piece } from '$lib/types/piece';
import type { PieceType } from '$lib/types/pieceType';
import type { SaleStage } from '$lib/types/saleStage';
import Dexie, { type Table } from 'dexie';

export class MySubClassedDexie extends Dexie {
  pieces!: Table<Piece>;
  photos!: Table<Photo>;
  types!: Table<PieceType>;
  saleStages!: Table<SaleStage>;

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      pieces: 'id, number',
      photos: 'id',
      types: 'id',
      saleStages: 'id',
    });

    this.on('populate', async () => {
      this.types.add({
        id: await crypto.randomUUID(),
        name: 'Mug/Cup',
        createdAt: new Date().toISOString(),
        sortOrder: 0,
      });
      this.types.add({
        id: await crypto.randomUUID(),
        name: 'Vase',
        createdAt: new Date().toISOString(),
        sortOrder: 1,
      });
      this.types.add({
        id: await crypto.randomUUID(),
        name: 'Planter',
        createdAt: new Date().toISOString(),
        sortOrder: 2,
      });
      this.types.add({
        id: await crypto.randomUUID(),
        name: 'Spoon Rest',
        createdAt: new Date().toISOString(),
        sortOrder: 3,
      });
      this.types.add({
        id: await crypto.randomUUID(),
        name: 'Oil Bottle',
        createdAt: new Date().toISOString(),
        sortOrder: 4,
      });
      this.types.add({
        id: await crypto.randomUUID(),
        name: 'Ash Tray',
        createdAt: new Date().toISOString(),
        sortOrder: 5,
      });
      this.types.add({
        id: await crypto.randomUUID(),
        name: 'Bowl',
        createdAt: new Date().toISOString(),
        sortOrder: 6,
      });

      this.saleStages.add({
        id: await crypto.randomUUID(),
        name: 'Ready',
        createdAt: new Date().toISOString(),
        sortOrder: 0,
      });
      this.saleStages.add({
        id: await crypto.randomUUID(),
        name: 'Second',
        createdAt: new Date().toISOString(),
        sortOrder: 1,
      });
      this.saleStages.add({
        id: await crypto.randomUUID(),
        name: 'Sold',
        createdAt: new Date().toISOString(),
        sortOrder: 2,
      });
      this.saleStages.add({
        id: await crypto.randomUUID(),
        name: 'Broken/Write-off',
        createdAt: new Date().toISOString(),
        sortOrder: 3,
      });
    });
  }
}

export const dexie = new MySubClassedDexie();
