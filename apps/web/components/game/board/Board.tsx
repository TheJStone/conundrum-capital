import React from 'react';
import { BoardLocation } from '../boardlocation/BoardLocation';
import { BoardTileLocation, BoardTile } from '@/types';

const ROWS = 9; // A-I
const COLS = 12; // 1-12

interface BoardProps {
  placedTiles: Record<string, BoardTile>; // Keyed by tile ID like "1A"
}

export function Board({ placedTiles }: BoardProps) {
  const boardTiles = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const location: BoardTileLocation = { row: r, col: c };
      const tileId = `${c + 1}${String.fromCharCode('A'.charCodeAt(0) + r)}`;
      const placedTile = placedTiles[tileId] || null;
      boardTiles.push(
        <BoardLocation
          key={tileId}
          location={location}
          placedTile={placedTile}
        />
      );
    }
  }

  return (
    <div className="grid grid-cols-12 gap-0.5 bg-neutral-900 p-1 rounded">
      {boardTiles}
    </div>
  );
}