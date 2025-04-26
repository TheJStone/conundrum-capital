import type {
  GameState,
  Move,
} from '@/types';
import { PuzzleLevel } from '@repo/database';
import { init } from './init';
import { handlePlaceTile } from './dispatch/handlePlaceTile';
import { handleFoundChain } from './dispatch/handleFoundChain';
import { handleMergeDecision } from './dispatch/handleMergeDecision';
import { handleSellShares } from './dispatch/handleSellShares';
import { handleTradeShares } from './dispatch/handleTradeShares';
import { handleBuyShares } from './dispatch/handleBuyShares';
import { handleEndTurn } from './dispatch/handleEndTurn';
import type { ChainId } from '@/types';

export interface Engine {
  /** Start from puzzle seed + reproducible RNG seed */
  init(level: PuzzleLevel, rngSeed?: string): GameState;

  /** Apply one move and return new immutable state */
  dispatch(state: GameState, move: Move): GameState;

}

export class GameEngine implements Engine {
  init(level: PuzzleLevel, rngSeed?: string): GameState {
    const state = init(level, rngSeed);
    return this.calculateNetWorth(state);
  }

  dispatch(state: GameState, move: Move): GameState {
    let next: GameState;
    switch (move.kind) {
      case 'PLACE_TILE':
        next = handlePlaceTile(state, move).next;
        break;
      case 'FOUND_CHAIN':
        next = handleFoundChain(state, move).next;
        break;
      case 'MERGE_DECISION':
        next = handleMergeDecision(state, move).next;
        break;
      case 'SELL_SHARES':
        next = handleSellShares(state, move).next;
        break;
      case 'TRADE_SHARES':
        next = handleTradeShares(state, move).next;
        break;
      case 'BUY_SHARES':
        next = handleBuyShares(state, move).next;
        break;
      case 'END_TURN':
        next = handleEndTurn(state, move).next;
        break;
      default:
        throw new Error(`Unknown move kind: ${(move as any).kind}`);
    }
    return this.calculateNetWorth(next);
  }

  /**
   * Calculates and sets net worth in the given GameState (cash + shares * share price).
   * Returns the updated state with netWorth field set.
   */
  calculateNetWorth(state: GameState): GameState {
    let netWorth = state.player.cash;
    for (const chainId of Object.keys(state.player.shares)) {
      const shares = state.player.shares[chainId as ChainId] || 0;
      const chain = state.chains[chainId as ChainId];
      if (chain) {
        netWorth += shares * chain.sharePrice;
      }
    }
    return { ...state, player: { ...state.player, netWorth } };
  }
}