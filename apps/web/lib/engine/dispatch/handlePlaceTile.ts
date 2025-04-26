import type { GameState } from '@/types/gamestate';
import type { Move } from '@/types/move';
import { calculateSharePrice, calculateBonus } from '../utils/price';
import { deepClone } from '@/lib/engine/utils/deepClone';
import { isCellEmpty, isTileInRack, getAdjacentTiles } from '../utils/boardUtils';
import type { ChainId } from '@/types';
import { tileIdToTile } from '../utils/boardUtils';

/**
 * Handles placing a tile on the board, enforcing all adjacency/merge/found-chain rules.
 * Throws { type: 'illegalmoves', message: string } on illegal moves.
 * Returns {next: GameState}
 */
export function handlePlaceTile(state: GameState, move: Move & { kind: 'PLACE_TILE' }): { next: GameState } {
  const { tile } = move;
  const next: GameState = deepClone(state);

  // 1. Validate tile is in rack and cell is empty
  if (!isTileInRack(next.player.rack, tile)) {
    throw { type: 'illegalmoves', message: 'Tile is not in rack' };
  }
  if (!isCellEmpty(next.board, tile.row, tile.col)) {
    throw { type: 'illegalmoves', message: 'Cell is not empty' };
  }

  // Remove tile from rack
  next.player.rack = next.player.rack.filter(t => t.id !== tile.id);

  // 2. Detect adjacency
  const adjacent = getAdjacentTiles(next.board, tile);
  const adjacentChains = Array.from(new Set(adjacent.map(t => t.chainId).filter(Boolean)));
  const adjacentLoose = Array.from(new Set(adjacent.filter(t => !t.chainId)));
  const isAdjacentToChain = adjacentChains.length > 0;
  const isAdjacentToLoose = adjacentLoose.length > 0;

  // 3. Determine if this creates a new chain, merges, or just extends
  if (!isAdjacentToChain && !isAdjacentToLoose) {
    // Isolated loose tile, nothing else to do
    next.board[tile.row]![tile.col] = { chainId: null, tileId: tile.id };
    next.looseTiles.add(tile.id);
    next.validMoves = ["BUY_SHARES", "END_TURN"];
    return { next };
  }

  if (!isAdjacentToChain && isAdjacentToLoose) {
    // Cluster of loose tiles: check if cluster size >= 2 to found a chain
    next.board[tile.row]![tile.col] = { chainId: null, tileId: tile.id };
    next.validMoves = ['FOUND_CHAIN'];
    const newChainTiles = adjacent.map(t => tileIdToTile(t.tileId)!);
    newChainTiles.push(tile);
    next.newChainTiles = newChainTiles;
    return { next };
  }

  // If adjacent to one chain, just add to that chain
  if (adjacentChains.length === 1) {
    const chainId = adjacentChains[0] as ChainId;
    // Add tile to chain
    next.chains[chainId]!.tiles.push(tile);
    next.board[tile.row]![tile.col] = { chainId, tileId: tile.id };
    next.looseTiles.delete(tile.id);

    // If there are any adjacent loose tiles, handle them
    for (const loose of adjacentLoose) {
      const looseTile = tileIdToTile(loose.tileId)!;
      next.chains[chainId]!.tiles.push(looseTile);
      next.board[looseTile.row]![looseTile.col] = { chainId, tileId: looseTile.id };
      next.looseTiles.delete(looseTile.id);
    }
    // Update share price and safety
    const newSize = next.chains[chainId]!.tiles.length;
    next.chains[chainId]!.sharePrice = calculateSharePrice(chainId, newSize);
    next.chains[chainId]!.isSafe = newSize >= 11;
    next.validMoves = ["BUY_SHARES", "END_TURN"];
    return { next };
  }

  // If adjacent to multiple chains, merge needed
  if (adjacentChains.length > 1) {
    // Determine sizes
    const sizes = adjacentChains.map(cid => next.chains[cid as ChainId]?.tiles.length || 0);
    const maxSize = Math.max(...sizes);
    const survivors = adjacentChains.filter((cid, idx) => sizes[idx] === maxSize);
    if (survivors.length > 1) {
      // Tie: need user decision
      next.validMoves = ['MERGE_DECISION'];
      next.survivorOptions = survivors as ChainId[];
      next.defuncts = adjacentChains.filter(cid => !survivors.includes(cid) && cid !== null) as ChainId[];
      next.looseTiles.delete(tile.id);
      next.board[tile.row]![tile.col] = { chainId: null, tileId: tile.id };
      next.mergingTile = tile;
      return { next };
    } else {
      // Clear winner: perform merge automatically
      const survivorId = survivors[0] as ChainId;
      // Merge all tiles into survivor, remove defunct chains
      for (const cid of adjacentChains) {
        if (cid === survivorId) continue;
        const defunct = next.chains[cid as ChainId]!;
        // Payouts (majority only, position 0)
        const bonus = calculateBonus(cid as ChainId, defunct.tiles.length, 0);
        next.player.cash += bonus;
        // Add defunct tiles to survivor
        next.chains[survivorId]!.tiles.push(...defunct.tiles);
        // Update share price after adding defunct tiles
        next.chains[survivorId]!.sharePrice = calculateSharePrice(survivorId, next.chains[survivorId]!.tiles.length);
        // Remove chain from board and state
        for (const t of defunct.tiles) {
          next.board[t.row]![t.col] = { chainId: survivorId, tileId: t.id };
        }
        delete next.chains[cid as ChainId];
      }
      // Add the placed tile
      next.chains[survivorId]!.tiles.push(tile);
      next.board[tile.row]![tile.col] = { chainId: survivorId, tileId: tile.id };
      next.looseTiles.delete(tile.id);
      // Update survivor chain sharePrice and safety (after all tiles added)
      const survivorSize = next.chains[survivorId]!.tiles.length;
      next.chains[survivorId]!.sharePrice = calculateSharePrice(survivorId, survivorSize);
      next.chains[survivorId]!.isSafe = survivorSize >= 11;
      next.validMoves = ["TRADE_SHARES", "SELL_SHARES", "BUY_SHARES", "END_TURN"];
      return { next };
    }
  }

  throw { type: 'illegalmoves', message: 'Unknown placement scenario' };
}
