import React from 'react';
import { PlayerTile } from '../playertile/PlayerTile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tile } from '@/types';

interface TileRackProps {
  tiles: Tile[];
  onPlaceTile: (tile: Tile) => void;
  canPlaceTile: boolean;
}

export function TileRack({ tiles, onPlaceTile, canPlaceTile }: TileRackProps) {
  return (
    <Card className="bg-neutral-850 border-neutral-700">
      <CardHeader className="p-3">
        <CardTitle className="text-sm text-neutral-300">Your Tiles</CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0 flex space-x-2">
        {tiles.map((tile) => (
          <PlayerTile
            key={tile.id}
            tile={tile}
            onClick={canPlaceTile ? onPlaceTile : undefined}
          />
        ))}
         {/* Add placeholders if less than 6 tiles */}
         {Array.from({ length: Math.max(0, 10 - tiles.length) }).map((_, index) => (
           <div key={`placeholder-${index}`} className="h-12 w-12 rounded border border-dashed border-neutral-700 bg-neutral-800" />
         ))}
      </CardContent>
    </Card>
  );
}