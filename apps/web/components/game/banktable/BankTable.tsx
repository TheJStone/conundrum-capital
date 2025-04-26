import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BankState, ChainState, getChainColor } from '@/types';

interface BankTableProps {
  bank: BankState;
  chains: ChainState[];
}

export function BankTable({ bank, chains }: BankTableProps) {
  return (
    <Table>
      <TableHeader>
         {/* Header row only needed if multiple rows in body */}
        <TableRow className="border-neutral-700">
           <TableHead className="text-neutral-400">Bank</TableHead>
           {chains.map(chain => (
            <TableHead key={chain.chainId} className={`text-center ${getChainColor(chain.chainId)}`}>
              {chain.chainId}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow className="border-neutral-700 hover:bg-neutral-800">
          <TableCell className="font-medium text-neutral-200">Bank Shares</TableCell>
           {chains.map(chain => (
            <TableCell key={chain.chainId} className="text-center text-neutral-300">
              {bank.sharesRemaining[chain.chainId] ?? '-'}
            </TableCell>
           ))}
        </TableRow>
         <TableRow className="border-neutral-700 hover:bg-neutral-800">
          <TableCell className="font-medium text-neutral-200">Chain Size</TableCell>
            {chains.map(chain => (
            <TableCell key={chain.chainId} className="text-center text-neutral-300">
               {chain.tiles.length}
            </TableCell>
           ))}
        </TableRow>
         <TableRow className="border-b border-neutral-700 hover:bg-neutral-800">
          <TableCell className="font-medium text-neutral-200">Share Price</TableCell>
           {chains.map(chain => (
            <TableCell key={chain.chainId} className="text-center text-neutral-300">
              {chain.sharePrice ? `$${chain.sharePrice}` : '-'}
            </TableCell>
           ))}
        </TableRow>
      </TableBody>
    </Table>
  );
}