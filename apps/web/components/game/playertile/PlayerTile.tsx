import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tile } from '@/types';

interface PlayerTileProps {
  tile: Tile;
  onClick?: (tile: Tile) => void;
  className?: string;
}

export function PlayerTile({ tile, onClick, className }: PlayerTileProps) {

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        'h-12 w-12 font-bold text-xs border-2 border-neutral-600', // Base style, removed conditional border
        onClick ? 'cursor-pointer hover:bg-neutral-700' : 'cursor-default',
        className
      )}
      onClick={() => onClick?.(tile)}
    >
      {tile.id}
    </Button>
  );
}