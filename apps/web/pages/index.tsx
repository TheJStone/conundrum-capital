import { Header } from '@/components/layout/header/header';
import { PuzzleView, Puzzle } from '@/components/puzzle/puzzleview/PuzzleView';
import { useRouter } from 'next/router';
import { trpc } from '@/lib/trpc';
import Instructions from '@/components/puzzle/instructions/Instructions';

function mapPuzzleDbToPuzzle(p: any): Puzzle {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? undefined,
    difficulty: p.difficulty ?? undefined,
  };
}

export default function IndexPage() {
  const router = useRouter();
  const { data, isLoading, error } = trpc['puzzle.list'].useQuery();
  const puzzles: Puzzle[] | undefined = data?.map(mapPuzzleDbToPuzzle);

  const handlePlay = (puzzleId: string) => {
    router.push({ pathname: '/game', query: { puzzleId } });
  };

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Header />
      <main className="flex-grow p-4 sm:p-6 lg:p-8">
        <Instructions />
        <div className="mx-auto max-w-2xl">
          {isLoading && <div className="text-white">Loading puzzles...</div>}
          {error && <div className="text-red-400">Failed to load puzzles.</div>}
          {puzzles && <PuzzleView puzzles={puzzles} onPlay={handlePlay} />}
        </div>
      </main>
    </div>
  );
}
