import React from 'react';
import { PuzzleRow } from '@/components/puzzle/puzzlerow/PuzzleRow';

export interface Puzzle {
  id: string;
  name: string;
  description?: string;
  difficulty?: string;
}

interface PuzzleViewProps {
  puzzles: Puzzle[];
  onPlay: (puzzleId: string) => void;
}

export function PuzzleView({ puzzles, onPlay }: PuzzleViewProps) {
  return (
    <div className="space-y-4">
      {puzzles.map(puzzle => (
        <PuzzleRow key={puzzle.id} puzzle={puzzle} onPlay={onPlay} />
      ))}
    </div>
  );
}
