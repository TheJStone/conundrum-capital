'use client'; // Needed for useState

import React, { useState, useEffect } from 'react';
import { Board } from '../board/Board';
import { TileRack } from '../tilerack/TileRack';
import { GameInfo } from '../gameinfo/GameInfo';
import { ChainSelector } from '../chainselector/ChainSelector';
import { BuyShares } from '../buyshares/BuyShares';
import { GameOverlay } from '../overlay/GameOverlay';
import GameHeader from '../gameheader/GameHeader';
import type { GameState } from '@/types/gamestate';
import {
  Tile,
  GameLogEntry,
  Move,
  BoardTile,
  ChainState,
  ChainId,
} from '@/types';
import { trpc } from '@/lib/trpc';
import { CHAIN_METADATA } from '@/types/chain';

// --- Component ---
interface GameProps {
  puzzleId: string;
}
export function Game({ puzzleId }: GameProps) {
  // TODO: Replace with real user logic
  const userId = '1';

  // Use trpc mutation for dispatching moves
  const dispatchMutation = trpc['game.submit'].useMutation();
  const closeMutation = trpc['game.close'].useMutation();

  // Store game state from backend
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [logs, setLogs] = useState<GameLogEntry[]>([]);
  const [moves, setMoves] = useState<Move[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);

  // Add trpc query for fetching existing game
  const gameActiveQuery = trpc['game.active'].useQuery({ puzzleId, userId }, { enabled: false });

  // Helper: calculate available chains to buy
  const availableChains = Object.keys(gameState?.chains || {}).filter(cid => gameState?.chains[cid] && gameState?.chains[cid]!.tiles.length > 0);
  // Handler: End Turn
  function handleEndTurn() {
    setLoading(true);
    setMoves(prevMoves => {
      const move: Move = { kind: 'END_TURN' };
      const updatedMoves = [...prevMoves, move];
      dispatchMutation.mutate(
        { puzzleId, userId, moves: updatedMoves },
        {
          onSuccess: (data: any) => {
            const fixedData: GameState = {
              ...data,
              looseTiles: new Set(Array.isArray(data.looseTiles) ? data.looseTiles : Object.keys(data.looseTiles)),
            };
            setGameState(fixedData);
            setLoading(false);
            setLogs(movesToGameLog(updatedMoves));
          },
          onError: (error) => {
            setError(error.message);
            setLoading(false);
          },
        }
      );
      return updatedMoves;
    });
  }

  // Utility: Convert Move[] to GameLogEntry[]
  function movesToGameLog(moves: Move[]): GameLogEntry[] {
    let id = 0;
    return moves.map((move) => {
      let message = '';
      switch (move.kind) {
        case 'PLACE_TILE':
          message = `Placed tile: ${move.tile.id}`;
          break;
        case 'FOUND_CHAIN':
          message = `Founded chain: ${move.choose}`;
          break;
        case 'MERGE_DECISION':
          message = `Chose survivor: ${move.survivor}`;
          break;
        case 'SELL_SHARES':
          message = `Sold ${move.amount} shares of ${move.chain}`;
          break;
        case 'TRADE_SHARES':
          message = `Traded ${move.amount} shares of ${move.chain}`;
          break;
        case 'BUY_SHARES':
          message = `Bought shares: ` + Object.entries(move.purchases).map(([chain, amt]) => `${chain}: ${amt}`).join(', ');
          break;
        case 'END_TURN':
          message = `Ended turn`;
          break;
        default:
          message = JSON.stringify(move);
      }
      return { id: id++, message };
    }).reverse(); // Show latest at top
  }

  // On mount, check for existing game and hydrate state
  useEffect(() => {
    setLoading(true);
    // Try to fetch existing game
    gameActiveQuery.refetch().then((result) => {
      if (result.data && result.data.moves) {
        // Parse moves from JSON string
        let parsedMoves: Move[] = [];
        try {
          parsedMoves = JSON.parse(result.data.moves);
        } catch {
          parsedMoves = [];
        }
        setMoves(parsedMoves);
        setLogs(movesToGameLog(parsedMoves));
        // Hydrate state from existing moves
        dispatchMutation.mutate(
          { puzzleId, userId, moves: parsedMoves },
          {
            onSuccess: (data: any) => {
              const fixedData: GameState = {
                ...data,
                looseTiles: new Set(Array.isArray(data.looseTiles) ? data.looseTiles : Object.keys(data.looseTiles)),
              };
              setGameState(fixedData);
              setLoading(false);
            },
            onError: (error) => {
              setError(error.message);
              setLoading(false);
            },
          }
        );
      } else {
        // No game found, start new
        dispatchMutation.mutate(
          { puzzleId, userId, moves: [] },
          {
            onSuccess: (data: any) => {
              const fixedData: GameState = {
                ...data,
                looseTiles: new Set(Array.isArray(data.looseTiles) ? data.looseTiles : Object.keys(data.looseTiles)),
              };
              setGameState(fixedData);
              setLoading(false);
            },
            onError: (error) => {
              setError(error.message);
              setLoading(false);
            },
          }
        );
      }
    }).catch(() => {
      // On error, start new game
      dispatchMutation.mutate(
        { puzzleId, userId, moves: [] },
        {
          onSuccess: (data: any) => {
            const fixedData: GameState = {
              ...data,
              looseTiles: new Set(Array.isArray(data.looseTiles) ? data.looseTiles : Object.keys(data.looseTiles)),
            };
            setGameState(fixedData);
            setLoading(false);
          },
          onError: (error) => {
            setError(error.message);
            setLoading(false);
          },
        }
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler for placing a tile
  const handlePlaceTileFromRack = (tileToPlace: Tile) => {
    if (!gameState) return;
    setLoading(true);
    // Append new move to moves array
    const move: Move = { kind: 'PLACE_TILE', tile: tileToPlace };
    setMoves(prevMoves => {
      const updatedMoves = [...prevMoves, move];
      // Submit the entire moves list
      dispatchMutation.mutate(
        { puzzleId, userId, moves: updatedMoves },
        {
          onSuccess: (data: any) => {
            const fixedData: GameState = {
              ...data,
              looseTiles: new Set(Array.isArray(data.looseTiles) ? data.looseTiles : Object.keys(data.looseTiles)),
            };
            setGameState(fixedData);
            setLoading(false);
            setLogs(movesToGameLog(updatedMoves));
          },
          onError: (error) => {
            setError(error.message);
            setLoading(false);
          },
        }
      );
      return updatedMoves;
    });
  };

  // Handler for selecting a chain to found
  const handleSelectChain = (chainId: string) => {
    if (!gameState) return;
    setLoading(true);
    const move: Move = { kind: 'FOUND_CHAIN', choose: chainId };
    setMoves(prevMoves => {
      const updatedMoves = [...prevMoves, move];
      dispatchMutation.mutate(
        { puzzleId, userId, moves: updatedMoves },
        {
          onSuccess: (data: any) => {
            const fixedData: GameState = {
              ...data,
              looseTiles: new Set(Array.isArray(data.looseTiles) ? data.looseTiles : Object.keys(data.looseTiles)),
            };
            setGameState(fixedData);
            setLoading(false);
            setLogs(movesToGameLog(updatedMoves));
          },
          onError: (error) => {
            setError(error.message);
            setLoading(false);
          },
        }
      );
      return updatedMoves;
    });
  };

  // Handler for merge decision (selecting survivor chain)
  const handleMergeDecision = (chainId: string) => {
    if (!gameState) return;
    setLoading(true);
    const move: Move = { kind: 'MERGE_DECISION', survivor: chainId };
    setMoves(prevMoves => {
      const updatedMoves = [...prevMoves, move];
      dispatchMutation.mutate(
        { puzzleId, userId, moves: updatedMoves },
        {
          onSuccess: (data: any) => {
            const fixedData: GameState = {
              ...data,
              looseTiles: new Set(Array.isArray(data.looseTiles) ? data.looseTiles : Object.keys(data.looseTiles)),
            };
            setGameState(fixedData);
            setLoading(false);
            setLogs(movesToGameLog(updatedMoves));
          },
          onError: (error) => {
            setError(error.message);
            setLoading(false);
          },
        }
      );
      return updatedMoves;
    });
  };

  // Handler: Buy Shares (onFund)
  function handleBuyShares(purchases: Record<ChainId, number>) {
    if (!gameState) return;
    const { shares, cost } = (() => {
      let shares = 0, cost = 0;
      for (const cid of availableChains) {
        const count = purchases[cid] || 0;
        shares += count;
        // Use actual price from gameState
        const chain = gameState.chains[cid];
        const price = chain ? chain.sharePrice : 0;
        cost += count * price;
      }
      return { shares, cost };
    })();
    if (shares < 1 || shares > 3 || cost > gameState.player.cash) return; // Defensive
    setLoading(true);
    setShowBuyShares(false);
    setMoves(prevMoves => {
      const move: Move = { kind: 'BUY_SHARES', purchases };
      const updatedMoves = [...prevMoves, move];
      dispatchMutation.mutate(
        { puzzleId, userId, moves: updatedMoves },
        {
          onSuccess: (data: any) => {
            const fixedData: GameState = {
              ...data,
              looseTiles: new Set(Array.isArray(data.looseTiles) ? data.looseTiles : Object.keys(data.looseTiles)),
            };
            setGameState(fixedData);
            setLoading(false);
            setLogs(movesToGameLog(updatedMoves));
          },
          onError: (error) => {
            setError(error.message);
            setLoading(false);
          },
        }
      );
      return updatedMoves;
    });
  }

  const [showBuyShares, setShowBuyShares] = useState(false);

  // Handler: Reset Game
  function handleResetGame() {
    console.log('Resetting game...');
    setResetting(true);
    closeMutation.mutate(
      { puzzleId, userId },
      {
        onSuccess: () => {
          // After closing, start a new game
          setMoves([]);
          setGameState(null);
          setLogs([]);
          setError(null);
          setResetting(false);
          // Start new game with empty moves
          dispatchMutation.mutate(
            { puzzleId, userId, moves: [] },
            {
              onSuccess: (data: any) => {
                const fixedData: GameState = {
                  ...data,
                  looseTiles: new Set(Array.isArray(data.looseTiles) ? data.looseTiles : Object.keys(data.looseTiles)),
                };
                setGameState(fixedData);
                setLoading(false);
              },
              onError: (error) => {
                setError(error.message);
                setLoading(false);
              },
            }
          );
        },
        onError: () => {
          setResetting(false);
        },
      }
    );
  }

  if (loading) return <div>Loading game...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!gameState) return <div>No game data.</div>;

  // Convert board state to placedTiles for Board component
  const placedTiles: Record<string, BoardTile> = {};
  for (let r = 0; r < gameState.board.length; r++) {
    for (let c = 0; c < gameState.board[r]!.length; c++) {
      const tile = gameState.board[r]![c];
      if (tile) {
        placedTiles[tile.tileId] = tile;
      }
    }
  }

  // Determine if FOUND_CHAIN is a valid move
  const showChainSelector = gameState.validMoves.includes('FOUND_CHAIN');

  const getUnusedChains = (chains: Record<ChainId, ChainState | undefined>) => {
    const ALL_CHAINS = Object.keys(CHAIN_METADATA);
    const usedChains = Object.keys(chains).filter(cid => chains[cid]);
    const unusedChains = ALL_CHAINS.filter(cid => !usedChains.includes(cid));
    return unusedChains;
  }
  // Determine if MERGE_DECISION is a valid move
  const showMergeDecisionSelector = gameState.validMoves.includes('MERGE_DECISION') && gameState.survivorOptions && gameState.survivorOptions.length > 0;

  return (
    <div className="relative h-full flex flex-col">
      <GameHeader puzzleName={gameState?.puzzleName || puzzleId} puzzleId={puzzleId} parScore={gameState?.parScore || 0} onReset={handleResetGame} resetting={resetting} />
      <GameOverlay status={gameState?.status || 'ACTIVE'} onReset={handleResetGame} />
      <div className="flex flex-col lg:flex-row p-4 bg-neutral-900 text-white flex-1 gap-4 overflow-auto">
        <div className="flex-grow flex flex-col items-center justify-start space-y-4 pt-8">
          <div className="max-w-[calc(12*3rem+11*0.125rem+0.5rem)]">
            <Board placedTiles={placedTiles} />
          </div>
          <div>
            <TileRack
            tiles={gameState.player.rack}
              onPlaceTile={handlePlaceTileFromRack}
            canPlaceTile={gameState.validMoves.includes('PLACE_TILE')}
            />
          </div>
        </div>
        {/* Right Side: Info, Log */}
        <div className="w-full md:w-[550px] flex-shrink-0 flex flex-col space-y-4">
          <GameInfo players={[gameState.player]} bank={gameState.bank} chains={Object.values(gameState.chains).filter((chain): chain is ChainState => chain !== undefined)} logs={logs} />
            <div className="flex gap-2 my-2">
            {gameState.validMoves.includes('END_TURN') && (
                <button
                  className="px-4 py-2 rounded bg-neutral-700 hover:bg-neutral-600 text-white font-bold"
                  onClick={handleEndTurn}
                  disabled={loading || showBuyShares}
                >End Turn</button>
              )}
            {gameState.validMoves.includes('BUY_SHARES') && (
                <button
                  className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-white font-bold"
                  onClick={() => setShowBuyShares(v => !v)}
                  disabled={loading}
                >Buy Shares</button>
              )}
              </div>
            {/* Render End Turn and Buy Shares buttons if valid */}
            <div>
            {/* Buy Shares Form */}
            {showBuyShares && (
              <BuyShares
              availableChains={gameState.chains}
                onFund={handleBuyShares}
                onCancel={() => setShowBuyShares(false)}
                loading={loading}
              playerCash={gameState.player.cash}
              />
            )}
            {/* Render ChainSelector below tile rack if needed */}
            {showChainSelector && (
              <ChainSelector
                promptText="Choose a new chain to found:"
              chains={getUnusedChains(gameState.chains)}
                onSelect={handleSelectChain}
              />
            )}
            {/* Render ChainSelector for merge decision if needed */}
            {showMergeDecisionSelector && (
              <ChainSelector
                promptText="Choose a survivor chain:"
              chains={gameState.survivorOptions!}
                onSelect={handleMergeDecision}
              />
            )}
            </div>
        </div>
      </div>
    </div>
  );
}
