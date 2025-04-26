import React from 'react';
import { PlayerTable } from '../playertable/PlayerTable';
import { BankTable } from '../banktable/BankTable';
import { PlayerState, BankState, ChainState } from '@/types';

interface GameTablesProps {
  players: PlayerState[];
  bank: BankState;
  chains: ChainState[];
}

export function GameTables({ players, bank, chains }: GameTablesProps) {
  return (
    <div className="space-y-2">
      <PlayerTable players={players} chains={chains} />
      <BankTable bank={bank} chains={chains} />
    </div>
  );
}