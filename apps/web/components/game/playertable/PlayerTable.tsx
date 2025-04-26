import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlayerState, ChainState, getChainColor } from '@/types';

interface PlayerTableProps {
  players: PlayerState[];
  chains: ChainState[];
}

export function PlayerTable({ players, chains }: PlayerTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-neutral-700">
          <TableHead className="text-neutral-400">Player</TableHead>
          {chains.map(chain => (
            <TableHead key={chain.chainId} className={`text-center ${getChainColor(chain.chainId)}`}>
              {chain.chainId}
            </TableHead>
          ))}
          <TableHead className="text-right text-neutral-400">Cash</TableHead>
          <TableHead className="text-right text-neutral-400">Net</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((player) => (
          <TableRow key={player.playerName} className="border-neutral-700 hover:bg-neutral-800">
            <TableCell className="font-medium text-neutral-200">{player.playerName}</TableCell>
             {chains.map(chain => (
               <TableCell key={chain.chainId} className="text-center text-neutral-300">
                 {player.shares[chain.chainId] ?? 0}
               </TableCell>
             ))}
            <TableCell className="text-right text-neutral-300">${player.cash.toLocaleString()}</TableCell>
            <TableCell className="text-right text-neutral-300">${player.netWorth.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}