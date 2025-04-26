import React from 'react';
import { CHAIN_METADATA, getChainColor } from '@/types/chain';
import type { ChainId } from '@/types';

interface ChainSelectorProps {
  promptText: string;
  chains: ChainId[];
  onSelect: (chain: ChainId) => void;
}

export function ChainSelector({ promptText, chains, onSelect }: ChainSelectorProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <div className="w-full text-sm text-neutral-300 mb-1">{promptText}</div>
      {chains.map(chainId => (
        <button
          key={chainId}
          className={`px-3 py-2 rounded font-bold text-white shadow ${getChainColor(chainId)} hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-white`}
          onClick={() => onSelect(chainId)}
        >
          {CHAIN_METADATA[chainId]?.name || chainId}
        </button>
      ))}
    </div>
  );
}
