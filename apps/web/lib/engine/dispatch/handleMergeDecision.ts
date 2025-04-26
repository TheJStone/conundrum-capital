import type { GameState } from '@/types/gamestate';
import type { Move } from '@/types/move';
import { calculateBonus } from '../utils/price';
import { deepClone } from '../utils/deepClone';
import type { ChainId } from '@/types';

/**
 * Handles a merge decision (when two or more chains are tied in size).
 * Throws { type: 'illegalmoves', message: string } on illegal moves.
 * Returns {next: GameState}
 */
export function handleMergeDecision(state: GameState, move: Move & { kind: 'MERGE_DECISION' }): { next: GameState } {
  const { survivor } = move;
  const next: GameState = deepClone(state);

  // Find all chains adjacent to the last placed tile (simulate from state)
  // Here, we will just operate on all chains except the survivor
  const mergingChains = next.survivorOptions!.filter(cid => cid !== survivor);
  mergingChains.push(...next.defuncts!);

  const survivorChain = next.chains[survivor];
  if (!survivorChain) {
    throw { type: 'illegalmoves', message: 'Survivor chain not found' };
  }
  // Apply majority payouts (hardcode at position 0 for now)
  for (const cid of mergingChains) {
    const chain = next.chains[cid as ChainId];
    if (!chain) continue;
    const bonus = calculateBonus(cid as ChainId, chain.tiles.length, 0);
    next.player.cash += bonus;
    // Remove all tiles from board, will be reassigned to survivor
    for (const t of chain.tiles) {
      next.board[t.row]![t.col] = { chainId: survivor, tileId: t.id };
    }
    survivorChain.tiles.push(...chain.tiles);
    delete next.chains[cid as ChainId];
  }

  const mergeTile = next.mergingTile;
  if (!mergeTile) {
    throw { type: 'illegalmoves', message: 'Merging tile not found' };
  }
  next.board[mergeTile.row]![mergeTile.col] = { chainId: survivor, tileId: mergeTile.id };
  survivorChain.tiles.push(mergeTile);

  // Update survivor chain
  survivorChain.sharePrice = calculateBonus(survivor as ChainId, survivorChain.tiles.length, 0);
  survivorChain.isSafe = survivorChain.tiles.length >= 11;

  // Enqueue optional SELL moves (for now, just set validMoves)
  next.validMoves = ["TRADE_SHARES", "SELL_SHARES", "BUY_SHARES", "END_TURN"];
  next.survivorOptions = null;
  next.defuncts = null;
  next.mergingTile = null;
  return { next };
}
