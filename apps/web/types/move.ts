import { ChainId, ChainIdSchema } from './chain';
import type { Tile } from './tile';
import { TileSchema } from './tile';
import { z } from 'zod';

export type Move =
  | { kind: 'PLACE_TILE'; tile: Tile }                      // always first
  | { kind: 'FOUND_CHAIN'; choose: ChainId }                // if needed
  | { kind: 'MERGE_DECISION'; survivor: ChainId }           // size-tie choice
  | { kind: 'SELL_SHARES'; chain: ChainId; amount: number } // defunct chain
  | { kind: 'TRADE_SHARES'; chain: ChainId; amount: number }/*2-for-1*/
  | { kind: 'BUY_SHARES'; purchases: Record<ChainId, number> }  // ≤3 total/turn
  | { kind: 'END_TURN' };

export type MoveType =
  | 'PLACE_TILE'
  | 'FOUND_CHAIN'
  | 'MERGE_DECISION'
  | 'SELL_SHARES'
  | 'TRADE_SHARES'
  | 'BUY_SHARES'
  | 'END_TURN';

// Zod schema for Move
export const MoveSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('PLACE_TILE'), tile: TileSchema }),
  z.object({ kind: z.literal('FOUND_CHAIN'), choose: ChainIdSchema }),
  z.object({ kind: z.literal('MERGE_DECISION'), survivor: ChainIdSchema }),
  z.object({ kind: z.literal('SELL_SHARES'), chain: ChainIdSchema, amount: z.number() }),
  z.object({ kind: z.literal('TRADE_SHARES'), chain: ChainIdSchema, amount: z.number() }),
  z.object({ kind: z.literal('BUY_SHARES'), purchases: z.record(ChainIdSchema, z.number()) }),
  z.object({ kind: z.literal('END_TURN') }),
]);