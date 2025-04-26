// Simple deep clone utility for immutable GameState updates
import type { GameState } from '@/types';

/**
 * Deep clone for GameState, restoring any Set fields after JSON parse/stringify.
 * Currently, only looseTiles is restored to a Set.
 */
export function deepClone(gameState: GameState): GameState {
  // const cloned = JSON.parse(JSON.stringify(gameState));
  // // If looseTiles should be a Set, convert it back
  // if (cloned.looseTiles) {
  //   cloned.looseTiles = new Set(cloned.looseTiles);
  // }
  // TODO fix deep cloning
  return gameState;
}
