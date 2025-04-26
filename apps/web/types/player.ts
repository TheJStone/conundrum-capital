import type { ChainId } from './chain';
import type { Tile } from './tile';

/** Solo player only, but keep object for future multiplayer / AI */
export interface PlayerState {
  playerName: string;
  netWorth: number;
  cash: number;
  rack: Tile[]; // ≤6 tiles in hand
  /** owned share certificates */
  shares: Record<ChainId, number>;
}