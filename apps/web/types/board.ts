import { ChainId } from './chain';

export interface BoardTile {
  chainId: ChainId | null;
  tileId: string;
}

export interface BoardTileLocation {
  row: number;
  col: number;
}

export type Board = (BoardTile | null)[][];