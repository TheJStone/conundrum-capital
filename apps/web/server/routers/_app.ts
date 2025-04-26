import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { db, PuzzleLevel } from '@repo/database';
import { procedure, router } from '../trpc';
import { GameEngine } from '@/lib/engine/engine';
import { MoveSchema } from '@/types/move';

// Zod schemas
const IdSchema = z.object({ id: z.string() });
const GameSubmitSchema = z.object({
  puzzleId: z.string(),
  moves: z.array(MoveSchema),
  userId: z.string(),
});

// Router
export const appRouter = router({
  // List up to 50 puzzles
  'puzzle.list': procedure.query(async () => {
    try {
      return await db.puzzleLevel.findMany({ take: 50 });
    } catch (err) {
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch puzzles' });
    }
  }),

  // Get puzzle by id
  'puzzle.byId': procedure.input(IdSchema).query(async ({ input }) => {
    try {
      return await db.puzzleLevel.findUniqueOrThrow({ where: { id: input.id } });
    } catch (err) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Puzzle not found' });
    }
  }),

  // Get game by puzzleId + userId
  'game.active': procedure.input(z.object({ puzzleId: z.string(), userId: z.string() })).query(async ({ input }) => {
    try {
      const game = await db.game.findFirst({
        where: { puzzleId: input.puzzleId, userId: input.userId, status: 'ACTIVE' },
        orderBy: { completedAt: 'desc' },
      });
      return game;
    } catch (err) {
      return null;
    }
  }),

  // Close a game (set status to CLOSED)
  'game.close': procedure.input(z.object({ puzzleId: z.string(), userId: z.string() })).mutation(async ({ input }) => {
    const { puzzleId, userId } = input;
    try {

      let game = await db.game.findFirst({ where: { puzzleId, userId, status: 'ACTIVE' } });
      if (!game) {
        return null;
      }
      const closed = await db.game.update({
        where: { id: game.id },
        data: { status: 'CLOSED', completedAt: new Date() },
      });
      return closed;
    } catch (err) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Game not found' });
    }
  }),

  // Submit a game (run engine, store result)
  'game.submit': procedure.input(GameSubmitSchema).mutation(async ({ input }) => {
    const { puzzleId, moves, userId } = input;
    try {
      // 1. Find the puzzle
      // need to cast because parsed fields are not included at compile time
      const dbPuzzle = await db.puzzleLevel.findUniqueOrThrow({ where: { id: puzzleId } }) as unknown as PuzzleLevel;

      // 2. Run engine
      const engine = new GameEngine();
      let state = engine.init(dbPuzzle);
      for (const move of moves) {
        state = engine.dispatch(state, move);
      }

      // 3. Find existing game for this puzzleId + userId + active status
      let game = await db.game.findFirst({ where: { puzzleId, userId, status: 'ACTIVE' } });
      if (game) {
        // Update existing game
        game = await db.game.update({
          where: { id: game.id },
          data: {
            moves: JSON.stringify(moves),
            netWorth: state.player.netWorth,
            status: state.status,
            turnsUsed: state.turn,
            completedAt: new Date(),
          },
        });
      } else {
        // Create new game
        game = await db.game.create({
          data: {
            puzzleId,
            userId,
            moves: JSON.stringify(moves),
            netWorth: state.player.netWorth,
            status: state.status,
            turnsUsed: state.turn,
            completedAt: new Date(),
          },
        });
      }

      // 4. Return result
      return state;
    } catch (err) {
      console.error('Error submitting game:', err);
      throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Failed to submit game', cause: err });
    }
  }),
});

// Export router type
export type AppRouter = typeof appRouter;