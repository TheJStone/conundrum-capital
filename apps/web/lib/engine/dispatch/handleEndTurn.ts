import type { GameState } from '@/types/gamestate';
import type { Move } from '@/types/move';
import { deepClone } from '../utils/deepClone';
import type { ChainId } from '@/types';

/**
 * Handles ending the turn, incrementing, and checking win/lose.
 * Throws { type: 'illegalmoves', message: string } on illegal moves.
 * Returns {next: GameState}
 */
export function handleEndTurn(state: GameState, move: Move & { kind: 'END_TURN' }): { next: GameState } {
  const next: GameState = deepClone(state);
  // Increment turn
  next.turn += 1;

  // Compute net worth (cash + shares * price)
  let netWorth = next.player.cash;
  for (const chainId in next.player.shares) {
    const shares = next.player.shares[chainId as ChainId] || 0;
    const chain = next.chains[chainId as ChainId];
    if (chain) {
      netWorth += shares * chain.sharePrice;
    }
  }
  next.player.netWorth = netWorth;

  // Check win/lose
  let allChainsSafe = true;
  let anyChainOver41 = false;
  for (const chainId in next.chains) {
    const chain = next.chains[chainId as ChainId];
    if (chain) {
      if (!chain.isSafe) allChainsSafe = false;
      if (chain.tiles.length >= 41) anyChainOver41 = true;
    }
  }
  const isGameOver = (allChainsSafe || anyChainOver41) || next.turn >= next.turnLimit;
  const wonGame = next.player.netWorth >= next.parScore;
  if (wonGame) {
    next.status = 'WON';
    next.validMoves = [];
  } else if (isGameOver) {
    next.status = 'LOST';
    next.validMoves = [];
  } else {
    next.status = 'ACTIVE';
    next.validMoves = ["PLACE_TILE"];
  }

  return { next };
}
