import React from 'react';
import { cn } from '@/lib/utils';
import { BoardTileLocation, BoardTile, getChainColor, Row, Col } from '@/types';
import { PlayerTile } from '../playertile/PlayerTile';

interface BoardLocationProps {
  location: BoardTileLocation;
  placedTile: BoardTile | null; // Tile placed here, if any
  className?: string;
}

// Function to convert row/col to letter/number string
export const formatTileId = (row: number, col: number): string => {
  const letter = String.fromCharCode('A'.charCodeAt(0) + row);
  const number = col + 1;
  return `${number}${letter}`;
};

export function BoardLocation({ location, placedTile, className }: BoardLocationProps) {
  const displayId = formatTileId(location.row, location.col);

  return (
    <div
      className={cn(
        'h-12 w-12 flex items-center justify-center border border-neutral-700',
        'bg-neutral-800 text-neutral-500 text-xs font-medium',
        // onPlaceTile && !placedTile ? 'cursor-pointer hover:bg-neutral-700' : '', // Removed conditional styling
         // TODO: Add specific chain colors if a tile is placed
        className,
      )}
      // onClick={handleClick} // Removed onClick
      title={displayId} // Tooltip for the location
    >
      {placedTile ? (
        // Render the placed player tile (non-interactive version maybe?)
        // If the placedTile has a chainId, use the chain color; otherwise, default to black
        <PlayerTile
          tile={{ id: placedTile.tileId, row: location.row as Row, col: location.col as Col}}
          className={`border-none text-white ${'chainId' in placedTile && placedTile.chainId ? getChainColor(placedTile.chainId) : 'bg-black'}`}
        />
      ) : (
        // Show the location ID faintly on empty tiles
        <span className="opacity-50">{displayId}</span>
      )}
    </div>
  );
}