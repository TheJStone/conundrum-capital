import type { GameState } from '@/types/gamestate';
import type { Move } from '@/types/move';
import { deepClone } from '../utils/deepClone';
import { calculateSharePrice } from '../utils/price';

/**
 * Handles buying up to 3 shares per chain per turn.
 * Throws { type: 'illegalmoves', message: string } on illegal moves.
 * Returns {next: GameState}
 */
export function handleBuyShares(state: GameState, move: Move & { kind: 'BUY_SHARES' }): { next: GameState } {
  // purchases: Record<ChainId, number>
  const { purchases } = move as any;
  const next: GameState = deepClone(state);

  // Validate purchases is a Record<ChainId, number>
  if (!purchases || typeof purchases !== 'object') {
    throw { type: 'illegalmoves', message: 'Invalid purchases' };
  }

  // Calculate total shares and total cost
  let totalCost = 0;
  let totalShares = 0;
  for (const chain in purchases) {
    const amount = purchases[chain];
    if (amount < 0 || amount > 3) {
      throw { type: 'illegalmoves', message: 'Can only buy 0-3 shares per chain per turn' };
    }
    if ((next.bank.sharesRemaining[chain] || 0) < amount) {
      throw { type: 'illegalmoves', message: `Not enough shares in bank for ${chain}` };
    }
    const sharePrice = calculateSharePrice(chain, next.chains[chain]?.tiles.length || 0);
    totalCost += sharePrice * amount;
    totalShares += amount;
  }
  if (next.player.cash < totalCost) {
    throw { type: 'illegalmoves', message: 'Insufficient cash' };
  }
  if (totalShares > 3) {
    throw { type: 'illegalmoves', message: 'Can only buy 3 shares total per turn' };
  }
  // Deduct cash, add shares to player, remove from bank
  next.player.cash -= totalCost;
  for (const chain in purchases) {
    const amount = purchases[chain];
    if (amount > 0) {
      next.player.shares[chain] = (next.player.shares[chain] || 0) + amount;
      next.bank!.sharesRemaining![chain] -= amount;
    }
  }

  next.validMoves = ["END_TURN"];
  return { next };
}
