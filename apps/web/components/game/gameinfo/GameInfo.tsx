import React from 'react';
import { GameTables } from '../gametables/GameTables';
import { GameLog } from '../gamelog/GameLog';
import { PlayerState, BankState, ChainState, GameLogEntry } from '@/types';

interface GameInfoProps {
  players: PlayerState[];
  bank: BankState;
  chains: ChainState[];
  logs: GameLogEntry[];
}

export function GameInfo({ players, bank, chains, logs }: GameInfoProps) {
  return (
    <div className="flex flex-col space-y-4">
      <GameTables players={players} bank={bank} chains={chains} />
      <GameLog logs={logs} />
    </div>
  );
}