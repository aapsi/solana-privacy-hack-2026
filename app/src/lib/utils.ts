import { PublicKey, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';

/**
 * Truncate a Solana address for display
 */
export function truncateAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Format SOL amount with proper decimals
 */
export function formatSol(lamports: number): string {
  return (lamports / LAMPORTS_PER_SOL).toFixed(4);
}

/**
 * Format USD amount
 */
export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Format large numbers with abbreviations
 */
export function formatNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(2) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(2) + 'K';
  }
  return num.toFixed(2);
}

/**
 * Validate a Solana public key
 */
export function isValidPublicKey(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

/**
 * Sleep for a given number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate a random keypair for fresh wallet withdrawals
 */
export async function generateFreshWallet(): Promise<{
  publicKey: string;
  secretKey: Uint8Array;
}> {
  const { Keypair } = await import('@solana/web3.js');
  const keypair = Keypair.generate();
  return {
    publicKey: keypair.publicKey.toString(),
    secretKey: keypair.secretKey,
  };
}

/**
 * Get SOL price in USD (mock for now)
 */
export async function getSolPrice(): Promise<number> {
  // TODO: Integrate with real price API (CoinGecko, Jupiter, etc.)
  return 150; // Mock price
}

/**
 * Calculate swap output amount
 */
export function calculateSwapOutput(
  inputAmount: number,
  inputPrice: number,
  outputPrice: number,
  feeBps: number = 30
): number {
  const inputValue = inputAmount * inputPrice;
  const feeMultiplier = 1 - feeBps / 10000;
  return (inputValue * feeMultiplier) / outputPrice;
}

/**
 * Format transaction signature for explorer link
 */
export function getExplorerUrl(
  signature: string,
  network: 'mainnet-beta' | 'devnet' | 'testnet' = 'devnet'
): string {
  return `https://explorer.solana.com/tx/${signature}?cluster=${network}`;
}

/**
 * Format address for explorer link
 */
export function getAddressExplorerUrl(
  address: string,
  network: 'mainnet-beta' | 'devnet' | 'testnet' = 'devnet'
): string {
  return `https://explorer.solana.com/address/${address}?cluster=${network}`;
}

/**
 * Check if we're running on mobile
 */
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
