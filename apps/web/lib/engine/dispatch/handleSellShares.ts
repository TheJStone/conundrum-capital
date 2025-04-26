import type { GameState } from '@/types/gamestate';
import type { Move } from '@/types/move';
import { deepClone } from '../utils/deepClone';
import { calculateSharePrice } from '../utils/price';
import type { ChainId } from '@/types';

/**
 * Handles selling shares for a defunct chain in a merger.
 * Throws { type: 'illegalmoves', message: string } on illegal moves.
 * Returns {next: GameState}
 */
export function handleSellShares(state: GameState, move: Move & { kind: 'SELL_SHARES' }): { next: GameState } {
  const { chain, amount } = move;
  const next: GameState = deepClone(state);

  // Validate chain is defunct (not in next.chains)
  if (next.chains[chain]) {
    throw { type: 'illegalmoves', message: 'Cannot sell shares for active chain' };
  }

  // Validate player owns enough shares
  if ((next.player.shares[chain] || 0) < amount) {
    throw { type: 'illegalmoves', message: 'Not enough shares to sell' };
  }

  // Add cash, return shares to bank
  // Assume last known share price is stored in state (or pass as param)
  // For now, use a fixed price (e.g., 100) as placeholder
  const sharePrice = calculateSharePrice(chain, next.chains[chain as ChainId]?.tiles.length || 0); // TODO: Pass/share price from merger context
  next.player.cash += amount * sharePrice;
  next.player.shares[chain] -= amount;
  next.bank.sharesRemaining[chain] += amount;

  next.validMoves = ["TRADE_SHARES", "BUY_SHARES", "END_TURN"];
  return { next };
}
