import { ChainId } from '@/types';
import { CHAIN_METADATA } from '@/types/chain'; // Import the new metadata

// Define the pricing structure using adjusted, more modern share price values
interface PriceTier {
  low: number;
  medium: number;
  high: number;
}

interface PriceRule {
  minTiles: number;
  maxTiles: number; // Inclusive
  prices: PriceTier;
}

// Constant data structure for share prices based on chain length and tier
const SHARE_PRICE_RULES: ReadonlyArray<PriceRule> = [
  // Tiles        Low (L/T)   Medium (A/F/W)   High (C/I) - Adjusted Prices
  { minTiles: 2,  maxTiles: 3,  prices: { low: 10, medium: 15, high: 20 } },   // 2 – 3
  { minTiles: 4,  maxTiles: 4,  prices: { low: 15, medium: 20, high: 25 } },   // 4
  { minTiles: 5,  maxTiles: 5,  prices: { low: 20, medium: 25, high: 30 } },   // 5
  { minTiles: 6,  maxTiles: 6,  prices: { low: 25, medium: 30, high: 35 } },   // 6
  { minTiles: 7,  maxTiles: 7,  prices: { low: 30, medium: 35, high: 40 } },   // 7
  { minTiles: 8,  maxTiles: 8,  prices: { low: 35, medium: 40, high: 45 } },   // 8
  { minTiles: 9,  maxTiles: 9,  prices: { low: 40, medium: 45, high: 50 } },   // 9
  { minTiles: 10, maxTiles: 10, prices: { low: 45, medium: 50, high: 55 } },   // 10
  { minTiles: 11, maxTiles: 11, prices: { low: 50, medium: 55, high: 60 } },   // 11
  { minTiles: 12, maxTiles: 12, prices: { low: 55, medium: 60, high: 65 } },   // 12
  { minTiles: 13, maxTiles: 14, prices: { low: 60, medium: 65, high: 70 } },   // 13 – 14
  { minTiles: 15, maxTiles: 16, prices: { low: 65, medium: 70, high: 75 } },   // 15 – 16
  { minTiles: 17, maxTiles: 18, prices: { low: 70, medium: 75, high: 80 } },   // 17 – 18
  { minTiles: 19, maxTiles: 20, prices: { low: 75, medium: 80, high: 85 } },   // 19 – 20
  { minTiles: 21, maxTiles: 25, prices: { low: 80, medium: 85, high: 90 } },   // 21 – 25
  { minTiles: 26, maxTiles: 30, prices: { low: 85, medium: 90, high: 95 } },   // 26 – 30
  { minTiles: 31, maxTiles: 40, prices: { low: 90, medium: 95, high: 100 } },  // 31 – 40
  { minTiles: 41, maxTiles: Infinity, prices: { low: 100, medium: 150, high: 200 } }, // 41 +
];

/**
 * Calculates the current price per share for a given hotel chain.
 *
 * @param chainId - The identifier of the hotel chain.
 * @param chainLength - The number of tiles currently in the chain.
 * @returns The price per share, or 0 if the chain is too small or invalid.
 */
export const calculateSharePrice = (chainId: ChainId, chainLength: number): number => {
  // Chains must have at least 2 tiles to have a share price according to the table.
  if (chainLength < 2) {
    return 0; // Or handle as per specific game rules for chains < 2 tiles.
  }

  // Get the price tier directly from the metadata
  const metadata = CHAIN_METADATA[chainId];
  if (!metadata) {
    console.error(`Invalid or unhandled ChainId provided: ${chainId}`);
    // Decide on error handling: return 0, throw error, etc.
    return 0;
  }
  const tierKey = metadata.tier;

  // Find the price rule corresponding to the current chain length.
  const rule = SHARE_PRICE_RULES.find(
    (r) => chainLength >= r.minTiles && chainLength <= r.maxTiles
  );

  if (!rule) {
    // This case should ideally not be reached if SHARE_PRICE_RULES covers all lengths >= 2.
    console.error(`No price rule found for chainLength: ${chainLength}. This indicates an issue with SHARE_PRICE_RULES definition.`);
    return 0; // Fallback, consider throwing an error if this state is critical.
  }

  // Return the price based on the chain's tier and length.
  return rule.prices[tierKey];
};

/**
 * Calculates the bonus amount for a given shareholder position in a hotel chain.
 *
 * @param chainId - The identifier of the hotel chain.
 * @param chainLength - The number of tiles currently in the chain.
 * @param position - The position of the shareholder (0 for main shareholder, 1 for secondary shareholder).
 */
export const calculateBonus = (chainId: ChainId, chainLength: number, position: number): number => {
  const sharePrice = calculateSharePrice(chainId, chainLength);

  // If the share price is 0 (e.g., chain too small), the bonus is also 0.
  if (sharePrice === 0) {
    return 0;
  }

  if (position === 0) {
    // Main shareholder bonus (10x)
    return sharePrice * 10;
  } else if (position === 1) {
    // Secondary shareholder bonus (5x)
    return sharePrice * 5;
  }

  // No bonus for other positions or if position is invalid
  return 0;
};
