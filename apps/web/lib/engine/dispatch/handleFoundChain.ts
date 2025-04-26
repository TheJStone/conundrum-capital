import type { GameState } from '@/types/gamestate';
import type { Move } from '@/types/move';
import { calculateSharePrice } from '../utils/price';
import { deepClone } from '../utils/deepClone';
import type { Col, Row } from '@/types/common';

/**
 * Handles founding a new chain from a cluster of loose tiles.
 * Throws { type: 'illegalmoves', message: string } on illegal moves.
 * Returns {next: GameState}
 */
export function handleFoundChain(state: GameState, move: Move & { kind: 'FOUND_CHAIN' }): { next: GameState } {
  const { choose } = move;
  const next: GameState = deepClone(state);

  // 1. Chosen chain must be idle (not on board)
  if (next.chains[choose]) {
    throw { type: 'illegalmoves', message: 'Chain is not idle' };
  }

  const cluster = next.newChainTiles!;
  const sharesRemaining = next.bank!.sharesRemaining!;

  // 3. Award one free share if bank > 0
  if (sharesRemaining[choose]! > 0) {
    next.player.shares[choose] = (next.player.shares[choose] || 0) + 1;
    sharesRemaining[choose]! -= 1;
  }

  // 4. Initialise ChainState and update board
  for (const t of cluster) {
    next.board[t.row as Row]![t.col as Col] = { chainId: choose, tileId: t.id };
    next.looseTiles.delete(t.id);
  }
  next.chains[choose] = {
    chainId: choose,
    tiles: cluster,
    isSafe: cluster.length >= 11,
    sharePrice: calculateSharePrice(choose, cluster.length),
  };

  next.validMoves = ["BUY_SHARES", "END_TURN"];
  next.newChainTiles = null;
  return { next };
}
