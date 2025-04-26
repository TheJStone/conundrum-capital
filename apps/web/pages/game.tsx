import { Header } from '@/components/layout/header/header';
import { Game } from '@/components/game/game/Game';
import { useRouter } from 'next/router';

export default function GamePage() {
  const router = useRouter();
  const puzzleId = typeof router.query.puzzleId === 'string' ? router.query.puzzleId : undefined;

  return (
    <div className="flex h-screen flex-col bg-black overflow-hidden">
      <Header />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-hidden">
        <div className="mx-auto max-w-7xl h-full">
          {puzzleId ? (
            <Game puzzleId={puzzleId} />
          ) : (
            <div className="text-white">No puzzle selected.</div>
          )}
        </div>
      </main>
    </div>
  );
}
