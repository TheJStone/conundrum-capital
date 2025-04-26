import type { ChainId } from './chain';
import type { ChainState } from './chain';
import type { PlayerState } from './player';
import type { BankState } from './bankstate';
import type { BoardTile } from './board';
import type { MoveType } from './move';
import type { Tile } from './tile';
/** Immutable snapshot of the game at any moment */
export interface GameState {
  turn: number;
  rngSeed: string;               // for deterministic replays
  board: (BoardTile | null)[][];   // 12x9 grid; null = empty | loose
  looseTiles: Set<string>;       // tileids not yet in a chain
  chains: Record<ChainId, ChainState | undefined>;
  player: PlayerState;
  bank: BankState;
  status: 'ACTIVE' | 'WON' | 'LOST' | 'CLOSED';
  validMoves: MoveType[];
  puzzleId: string;              // connects to Prisma level row
  puzzleName: string;
  parScore: number;
  turnLimit: number;
  survivorOptions: ChainId[] | null; // for merge decision
  defuncts: ChainId[] | null; // for merge decision
  mergingTile: Tile | null; // for merge decision
  newChainTiles: Tile[] | null; // for found chain
}