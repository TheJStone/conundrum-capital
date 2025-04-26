import { z } from 'zod';
import type { Tile } from './tile';

/** Price Tiers */
export type PriceTierKey = 'low' | 'medium' | 'high';

/** Static configuration data for a hotel chain */
export interface ChainConfig {
  id: ChainId;
  name: string; // e.g., "Imperial", "Continental"
  color: string; // Tailwind color class, e.g., "bg-purple-500"
  tier: PriceTierKey;
}

export const CHAIN_METADATA: Record<ChainId, Omit<ChainConfig, 'id'>> = {
  Swipe:    { name: 'Swipe',    color: 'bg-indigo-500',  tier: 'low'    },
  AirDnB:   { name: 'AirDnB',   color: 'bg-rose-500',    tier: 'low'    },
  OpenWhy:  { name: 'OpenWhy',  color: 'bg-teal-500',    tier: 'medium' },
  Suber:    { name: 'Suber',    color: 'bg-amber-500',   tier: 'medium' },
  Canvas:   { name: 'Canvas',   color: 'bg-emerald-500', tier: 'medium' },
  SpaceEx:  { name: 'SpaceEx',  color: 'bg-sky-500',     tier: 'high'   },
  Figment:  { name: 'Figment',  color: 'bg-purple-500',  tier: 'high'   },
};

/**
 * Returns the color for a given chain ID.
 * @param chainId The ChainId to look up.
 * @returns The Tailwind color class for the chain.
 */
export function getChainColor(chainId: ChainId): string {
  return CHAIN_METADATA[chainId]?.color ?? 'bg-gray-500';
}

/** Canonical chain names (7 in classic Acquire) */
export type ChainId = string;
export const ChainIdSchema = z.string();

export const ALL_CHAINS: ChainId[] = [
  'Swipe',
  'AirDnB',
  'OpenWhy',
  'Suber',
  'Canvas',
  'SpaceEx',
  'Figment',
];

/** Dynamic data for one active chain on the board */
export interface ChainState {
  chainId: ChainId;
  /** Ordered list for easy flood-fill or rendering */
  tiles: Tile[];
  isSafe: boolean; // true at 11+ tiles
  /** Calculated on every mutation via price table */
  sharePrice: number;
}