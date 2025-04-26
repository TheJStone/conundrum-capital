import React, { useState } from 'react';
import { CHAIN_METADATA } from '@/types/chain';
import type { ChainId } from '@/types';
import type { ChainState } from '@/types/chain';

interface BuySharesProps {
  availableChains: Record<ChainId, ChainState | undefined>;
  onFund: (purchases: Record<ChainId, number>) => void;
  onCancel: () => void;
  loading: boolean;
  playerCash: number;
}

export function BuyShares({
  availableChains,
  onFund,
  onCancel,
  loading,
  playerCash,
}: BuySharesProps) {
  const [buyShares, setBuyShares] = useState<Record<ChainId, number>>({});
  const [error, setError] = useState<string | null>(null);
  const chainToSharePrice: { chainId: ChainId; sharePrice: number }[] = Object.keys(availableChains).filter(cid => availableChains[cid] !== undefined).map(cid => ({
    chainId: cid,
    sharePrice: availableChains[cid]!.sharePrice,
  }));

  function getTotalSharesAndCost() {
    let shares = 0, cost = 0;
    for (const { chainId, sharePrice } of chainToSharePrice) {
      const count = buyShares[chainId] || 0;
      shares += count;
      cost += count * sharePrice;
    }
    return { shares, cost };
  }
  function changeBuyShares(cid: ChainId, delta: number) {
    setBuyShares(prev => {
      const next = { ...prev, [cid]: Math.max(0, (prev[cid] || 0) + delta) };
      const total = Object.values(next).reduce((a, b) => a + b, 0);
      if (total > 3) return prev;
      return next;
    });
    setError(null);
  }
  function handleFund() {
    const { shares, cost } = getTotalSharesAndCost();
    if (shares < 1 || shares > 3) {
      setError('Must buy 1-3 shares total');
      return;
    }
    if (cost > playerCash) {
      setError('Insufficient cash');
      return;
    }
    setError(null);
    // Only include purchases with > 0 shares
    const filtered = Object.fromEntries(Object.entries(buyShares).filter(([_, v]) => v > 0));
    onFund(filtered);
    setBuyShares({});
  }

  const { shares, cost } = getTotalSharesAndCost();

  return (
    <div className="bg-neutral-800 p-4 rounded shadow mt-2">
      <div className="mb-2 text-sm text-neutral-300">Select shares to buy (max 3 total):</div>
      {chainToSharePrice.map(({ chainId, sharePrice }) => (
        <div key={chainId} className="flex items-center gap-2 mb-1">
          <span className={`w-20 font-bold ${'bg-' + (CHAIN_METADATA[chainId]?.color || 'gray')}`}>{CHAIN_METADATA[chainId]?.name || chainId}</span>
          <button onClick={() => changeBuyShares(chainId, -1)} disabled={(buyShares[chainId]||0)===0 || loading} className="px-2 py-1 bg-neutral-700 rounded text-white">-</button>
          <span className="w-6 text-center">{buyShares[chainId]||0}</span>
          <button onClick={() => changeBuyShares(chainId, 1)} disabled={(buyShares[chainId]||0)>=3 || shares>=3 || loading} className="px-2 py-1 bg-neutral-700 rounded text-white">+</button>
          <span className="ml-2 text-neutral-400 text-xs">${sharePrice} ea</span>
        </div>
      ))}
      <div className="mt-2 flex items-center gap-4">
        <span className="text-neutral-200">Total: ${cost}</span>
        <button
          className={`px-4 py-2 rounded font-bold ${cost > playerCash || shares < 1 ? 'bg-neutral-600 text-neutral-400' : 'bg-blue-700 hover:bg-blue-600 text-white'}`}
          onClick={handleFund}
          disabled={cost > playerCash || shares < 1 || loading}
        >Fund</button>
        <button className="px-3 py-2 rounded bg-neutral-700 text-white" onClick={onCancel} disabled={loading}>Cancel</button>
      </div>
      {error && <div className="mt-2 text-red-400 text-sm">{error}</div>}
    </div>
  );
}
