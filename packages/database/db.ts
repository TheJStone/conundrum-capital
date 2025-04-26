import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';
import { Move, MoveSchema } from '../../apps/web/types/move';

interface BoardTile {
  chainId: string;
  tileId: string;
}

// Zod schemas for validation/parsing
const TileSchema = z.string();
const BoardTileSchema = z.object({
  chainId: z.string().nullable(),
  tileId: TileSchema,
});

const BoardTileArraySchema = z.array(BoardTileSchema)
const TileArraySchema = z.array(TileSchema);
const MoveArraySchema = z.array(MoveSchema);

// Zod schema for initialShares
const InitialSharesSchema = z.record(z.string(), z.number());

export type PuzzleLevel = Omit<Prisma.PuzzleLevelGetPayload<{}>, 'seedTiles' | 'initialRack' | 'initialShares'> & {
  parsedSeedTiles: BoardTile[];
  parsedInitialRack: string[];
  parsedInitialShares: Record<string, number>;
};

export type Game = Omit<Prisma.GameGetPayload<{}>, 'moves'> & {
  parsedMoves: Move[];
};

// Define the extension arguments using Prisma.defineExtension
const extension = Prisma.defineExtension({
  result: {
    puzzleLevel: {
      // Computed field for seedTiles
      parsedSeedTiles: {
        needs: { seedTiles: true },
        compute(level: any): BoardTile[] { // Explicit any to suppress error
          try {
            // Basic check
            if (typeof level.seedTiles !== 'string') {
              console.error("seedTiles is not a string:", level.seedTiles);
              return [];
            }
            return BoardTileArraySchema.parse(JSON.parse(level.seedTiles));
          } catch (error) {
            console.error("Failed to parse seedTiles:", error);
            // Return default or throw, depending on desired behavior
            return [];
          }
        },
      },
      // Computed field for initialRack
      parsedInitialRack: {
        needs: { initialRack: true },
        compute(level: any): string[] { // Explicit any to suppress error
           try {
            if (typeof level.initialRack !== 'string') {
               console.error("initialRack is not a string:", level.initialRack);
               return [];
             }
            return TileArraySchema.parse(JSON.parse(level.initialRack));
          } catch (error) {
            console.error("Failed to parse initialRack:", error);
            return [];
          }
        },
      },
      // Computed field for initialShares
      parsedInitialShares: {
        needs: { initialShares: true },
        compute(level: any): Record<string, number> { // Explicit any to suppress error
          try {
            if (typeof level.initialShares !== 'string') {
               console.error("initialShares is not a string:", level.initialShares);
               return {}; // Return empty object on type error
             }
            return InitialSharesSchema.parse(JSON.parse(level.initialShares));
          } catch (error) {
            console.error("Failed to parse initialShares:", error);
            return {}; // Return empty object on parsing error
          }
        },
      },
    },
    game: {
      // Computed field for moves
      parsedMoves: {
        needs: { moves: true },
        compute(game: any): Move[] { // Explicit any to suppress error
          try {
            if (typeof game.moves !== 'string') {
               console.error("moves is not a string:", game.moves);
               return [];
             }
            return MoveArraySchema.parse(JSON.parse(game.moves));
          } catch (error) {
            console.error("Failed to parse moves:", error);
            return [];
          }
        },
      },
    },
  },
});

// Apply the extension
const prisma = new PrismaClient().$extends(extension)

export const db = prisma;
