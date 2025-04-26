import React from 'react';

interface GameHeaderProps {
  puzzleName: string;
  puzzleId: string;
  parScore: number;
  onReset?: () => void;
  resetting?: boolean;
}

const GameHeader: React.FC<GameHeaderProps> = ({ puzzleName, puzzleId, parScore, onReset, resetting }) => (
  <div className="w-full bg-neutral-800 text-white py-4 px-6 flex items-center justify-between border-b border-neutral-700 sticky top-0 z-20" style={{ minHeight: '60px' }}>
    <div className="text-lg font-semibold">
      Puzzle: {puzzleName || puzzleId}
    </div>
    <div className="flex items-center gap-4">
      <div className="text-lg">
        Target Net Worth: <span className="font-bold">{parScore}</span>
      </div>
      {onReset && (
        <button
          className={`ml-4 px-4 py-2 rounded bg-red-500 hover:bg-red-400 text-white font-bold text-sm shadow ${resetting ? 'opacity-60 cursor-not-allowed' : ''}`}
          onClick={onReset}
          disabled={resetting}
        >
          {resetting ? 'Resetting...' : 'Reset Game'}
        </button>
      )}
    </div>
  </div>
);

export default GameHeader;
