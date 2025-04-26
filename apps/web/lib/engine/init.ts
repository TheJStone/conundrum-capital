import {
  GameState,
  ChainId,
  ChainState,
  PlayerState,
  BankState,
  Tile,
  BoardTile,
  ALL_CHAINS
} from '@/types';
import { tileIdToTile } from './utils/boardUtils';
import { BOARD_WIDTH, BOARD_HEIGHT, TOTAL_SHARES_PER_CHAIN } from '@/types';
import { PuzzleLevel } from '@repo/database';
import { calculateSharePrice } from './utils/price';

// Helper to convert letter/value from db.ts Tile to row/col


export const init = (level: PuzzleLevel, rngSeed?: string): GameState => {
  const seed = rngSeed ?? 'deterministic-seed';

    const board: (BoardTile | null)[][] = Array.from({ length: BOARD_HEIGHT }, () =>
      Array(BOARD_WIDTH).fill(null));

    const looseTiles = new Set<string>();
    const chainTilesMap = new Map<ChainId, Tile[]>();
    level.parsedSeedTiles.forEach((boardTile) => {
      const { chainId: chainIdString, tileId } = boardTile;
      const tile = tileIdToTile(tileId);
      if (tile && tile.row !== null && tile.col !== null) {
        const chainId = chainIdString as ChainId;
        board[tile.row]![tile.col] = { chainId, tileId };
        chainTilesMap.set(chainId, [...(chainTilesMap.get(chainId) ?? []), tile]);
      }
      if (chainIdString === null) {
        looseTiles.add(tileId);
      }
    });

    const chains = ALL_CHAINS.reduce(
      (acc, chainId) => {
        // Use the chainTiles map built during parsedSeedTiles iteration
        const chainTiles = chainTilesMap.get(chainId) ?? [];
        acc[chainId] = chainTiles.length > 0 ? {
          chainId,
          tiles: chainTiles,
          isSafe: chainTiles.length >= 11,
          sharePrice: calculateSharePrice(chainId, chainTiles.length)
        } : undefined;
        return acc;
      },
      {} as Record<ChainId, ChainState | undefined>,
    );

    const player: PlayerState = {
      playerName: 'Mark And-Reason',
      netWorth: 0,
      cash: level.initialCash,
      shares: ALL_CHAINS.reduce(
        (acc, chainId) => {
          acc[chainId] = level.parsedInitialShares[chainId] ?? 0;
          return acc;
        },
        {} as Record<ChainId, number>,
      ),
      // Use 'rack' as defined in PlayerState, starts empty
      rack: level.parsedInitialRack.map((tile) => tileIdToTile(tile)).filter((tile): tile is Tile => tile !== null),
    };

    const bankSharesRemaining = ALL_CHAINS.reduce(
      (acc: Record<ChainId, number>, chainId) => {
        // Force type assertion as number to resolve checker issue
        acc[chainId] = TOTAL_SHARES_PER_CHAIN - (player.shares[chainId] as number);
        return acc;
      },
      {} as Record<ChainId, number>,
    );
    const bank: BankState = {
      sharesRemaining: bankSharesRemaining,
    };

    const initialState: GameState = {
      turn: 0,
      rngSeed: seed,
      board,
      looseTiles,
      chains,
      player,
      bank,
      status: 'ACTIVE',
      validMoves: ["PLACE_TILE"],
      puzzleId: level.id,
      puzzleName: level.name,
      parScore: level.parScore,
      turnLimit: level.turnLimit,
      survivorOptions: null,
      defuncts: null,
      mergingTile: null,
      newChainTiles: null,
    };

    return initialState;
  }