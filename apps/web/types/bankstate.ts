import type { ChainId } from './chain';

/** Bank pool for remaining shares */
export interface BankState {
  sharesRemaining: Record<ChainId, number>; // starts at 25 each
}