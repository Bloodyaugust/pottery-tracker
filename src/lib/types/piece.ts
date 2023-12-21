import type { Firing } from './firing';
import type { Photo } from './photo';
import type { StageHistory } from './stageHistory';

export type Piece = {
  name: string;
  id: string;
  createdAt: string;
  tags: string[];
  photos: Photo[];
  description: string;
  size: string;
  weight: string;
  clayType: string;
  glaze: string;
  stages: StageHistory[];
  firings: Firing[];
};
