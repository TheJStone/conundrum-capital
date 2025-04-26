import React from 'react';
import { useRouter } from 'next/router';

interface GameOverlayProps {
  status: 'WON' | 'LOST' | 'ACTIVE' | 'CLOSED';
  onReset: () => void;
}

export function GameOverlay({ status, onReset }: GameOverlayProps) {
  const router = useRouter();
  if (status !== 'WON' && status !== 'LOST') return null;

  const isWin = status === 'WON';
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-auto" style={{ background: 'rgba(0,0,0,.4)' }}>
      <div className={`text-3xl font-bold px-10 py-8 rounded-lg shadow-lg mb-6 ${isWin ? 'bg-green-800 text-white' : 'bg-red-800 text-white'} bg-opacity-90`}>
        {isWin ? 'Congratulations, you win!' : 'Oh no, you folded. Try again!'}
      </div>
      <div className="flex space-x-4">
        <button
          className={`px-6 py-3 rounded bg-white font-bold text-lg shadow ${isWin ? 'text-green-800' : 'text-red-800'}`}
          onClick={onReset}
        >
          Reset Game
        </button>
        <button
          className="px-6 py-3 rounded bg-blue-800 text-white font-bold text-lg shadow"
          onClick={() => router.push('/')}
        >
          Try Another Puzzle
        </button>
      </div>
    </div>
  );
}
