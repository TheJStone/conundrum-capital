import type { Board, BoardTile } from '@/types';
import type { Tile } from '@/types';
import type { Row, Col } from '@/types';
import { BOARD_WIDTH, BOARD_HEIGHT } from '@/types/common';

/** Returns true if the board cell at (row, col) is empty */
export function isCellEmpty(board: Board, row: number, col: number): boolean {
  return board[row]?.[col] == null;
}

/** Returns true if the tile is in the player's rack */
export function isTileInRack(rack: Tile[], tile: Tile): boolean {
  return rack.some(t => t.id === tile.id);
}

export function tileIdToTile(tileId: string): Tile | null {
  const colNum = parseInt(tileId.slice(0, -1)) - 1; // Extract number from "1A" -> 0
  const rowNum = tileId.slice(-1).charCodeAt(0) - 'A'.charCodeAt(0); // Extract letter "1A" -> 0

  if (
    colNum >= 0 &&
    colNum < BOARD_WIDTH &&
    rowNum >= 0 &&
    rowNum < BOARD_HEIGHT
  ) {
    return { row: rowNum as Row, col: colNum as Col, id: tileId };
  }
  console.warn("Invalid tileId data:", tileId);
  return null;
};

/** Get adjacent tiles to the given tile on the board (orthogonal only) */
export function getAdjacentTiles(board: Board, tile: Tile): BoardTile[] {
  const deltas: [number, number][] = [
    [0, 1], [1, 0], [0, -1], [-1, 0],
  ];
  const adj: BoardTile[] = [];
  for (const [dr, dc] of deltas) {
    const r = tile.row + dr;
    const c = tile.col + dc;
    const row = board[r];
    if (row && row[c]) {
      adj.push(row[c]!);
    }
  }
  return adj;
}

// /** Flood-fill to find all connected loose tiles (not part of a chain) */
// export function findLooseCluster(board: Board, tile: Tile, looseTiles: Set<string>): Tile[] {
//   const visited = new Set<string>();
//   const cluster: Tile[] = [];
//   function dfs(t: Tile) {
//     if (visited.has(t.id) || !looseTiles.has(t.id)) return;
//     visited.add(t.id);
//     cluster.push(t);
//     for (const adj of getAdjacentLooseTiles(board, t, looseTiles)) {
//       dfs(adj);
//     }
//   }
//   dfs(tile);
//   return cluster;
// }

// export function getAdjacentLooseTiles(board: Board, tile: Tile, looseTiles: Set<string>): Tile[] {
//   const deltas: [number, number][] = [
//     [0, 1], [1, 0], [0, -1], [-1, 0],
//   ];
//   const adj: Tile[] = [];
//   for (const [dr, dc] of deltas) {
//     const r = tile.row + dr;
//     const c = tile.col + dc;
//     if (board[r]?.[c] == null) {
//       // Only add if the tile is loose
//       const id = `${String.fromCharCode(65 + r)}${c + 1}`;
//       if (looseTiles.has(id)) {
//         adj.push({ row: r as Row, col: c as Col, id });
//       }
//     }
//   }
//   return adj;
// }
