import type { Photo } from '$lib/types/photo';
import type { Piece } from '$lib/types/piece';
import type { Stage } from '$lib/types/stage';
import type { StageHistory } from '$lib/types/stageHistory';
import Dexie, { type Table } from 'dexie';

export class MySubClassedDexie extends Dexie {
  pieces!: Table<Piece>;
  photos!: Table<Photo>;
  stages!: Table<Stage>;
  stageHistories!: Table<StageHistory>;

  constructor() {
    super('myDatabase');
    this.version(1).stores({
      pieces: 'id, name',
      photos: 'id',
      stages: 'id, sortOrder',
      stageHistories: 'id',
    });

    this.on('populate', async () => {
      this.stages.add({
        id: await crypto.randomUUID(),
        name: 'Bisque Firing',
        createdAt: new Date().toISOString(),
        sortOrder: 0,
      });
      this.stages.add({
        id: await crypto.randomUUID(),
        name: 'Second Firing',
        createdAt: new Date().toISOString(),
        sortOrder: 1,
      });
    });
  }
}

export const dexie = new MySubClassedDexie();
