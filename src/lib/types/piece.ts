import type { Photo } from './photo';

export type Piece = {
  id: string;
  createdAt: string;
  photoIDs: string;
  number: number;
  type: string;
  price: number;
  saleStage: string;
  soldDate: string;
  soldAmount: number;
};

export type HydratedPiece = Piece & {
  photos: Photo[];
};
