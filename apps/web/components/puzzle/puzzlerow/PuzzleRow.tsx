import React from 'react';
import { useRouter } from 'next/router';
import { Puzzle } from '@/components/puzzle/puzzleview/PuzzleView';

interface PuzzleRowProps {
  puzzle: Puzzle;
  onPlay: (puzzleId: string) => void;
}

export function PuzzleRow({ puzzle, onPlay }: PuzzleRowProps) {
  return (
    <div className="flex items-center justify-between bg-neutral-800 rounded-lg p-4 shadow">
      <div>
        <div className="font-bold text-lg text-white">{puzzle.name}</div>
        <div className="text-neutral-300 text-sm mb-1">{puzzle.description}</div>
        <div className="text-xs text-blue-300">Difficulty: {puzzle.difficulty || 'N/A'}</div>
      </div>
      <button
        className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-400 text-white font-bold ml-4"
        onClick={() => onPlay(puzzle.id)}
      >
        Play
      </button>
    </div>
  );
}
