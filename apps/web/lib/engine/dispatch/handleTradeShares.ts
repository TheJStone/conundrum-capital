import type { GameState } from '@/types/gamestate';
import type { Move } from '@/types/move';
import { deepClone } from '../utils/deepClone';
import type { ChainId } from '@/types';

/**
 * Handles trading shares (2-for-1) for a defunct chain in a merger.
 * Throws { type: 'illegalmoves', message: string } on illegal moves.
 * Returns {next: GameState}
 */
export function handleTradeShares(state: GameState, move: Move & { kind: 'TRADE_SHARES' }): { next: GameState } {
  const { chain, amount } = move;
  const next: GameState = deepClone(state);

  // Validate chain is defunct (not in next.chains)
  if (next.chains[chain]) {
    throw { type: 'illegalmoves', message: 'Cannot trade shares for active chain' };
  }

  // Validate player owns enough shares
  if ((next.player.shares[chain] || 0) < amount) {
    throw { type: 'illegalmoves', message: 'Not enough shares to trade' };
  }

  // Validate amount is even (2-for-1)
  if (amount % 2 !== 0) {
    throw { type: 'illegalmoves', message: 'Must trade shares in pairs (2-for-1)' };
  }

  // Find survivor chain (the only one left in next.chains)
  const survivorIds = Object.keys(next.chains);
  if (survivorIds.length !== 1) {
    throw { type: 'illegalmoves', message: 'No survivor chain found for trade' };
  }
  const survivor = survivorIds[0] as ChainId;

  // Remove shares from player, add half as survivor shares
  next.player.shares[chain] -= amount;
  next.bank.sharesRemaining[chain] += amount;
  const gained = amount / 2;
  next.player.shares[survivor] = (next.player.shares[survivor] || 0) + gained;
  next.bank.sharesRemaining[survivor] -= gained;

  next.validMoves = ["SELL_SHARES", "BUY_SHARES", "END_TURN"];
  return { next };
}
