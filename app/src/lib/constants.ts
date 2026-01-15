import { PublicKey } from '@solana/web3.js';

// Program ID - update after deployment
export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_PROGRAM_ID || 'GhsT1111111111111111111111111111111111111111'
);

// RPC Endpoints
export const HELIUS_RPC = process.env.NEXT_PUBLIC_HELIUS_RPC_URL || '';
export const QUICKNODE_RPC = process.env.NEXT_PUBLIC_QUICKNODE_RPC_URL || '';

// Network
export const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';

// Token mints (devnet)
export const TOKEN_MINTS = {
  SOL: 'So11111111111111111111111111111111111111112', // Native SOL (wrapped)
  USDC: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU', // Devnet USDC
  BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // Bonk (mainnet, for reference)
};

// Fees
export const DEPOSIT_FEE_BPS = 0; // 0% deposit fee
export const WITHDRAW_FEE_BPS = 10; // 0.1% withdraw fee
export const SWAP_FEE_BPS = 30; // 0.3% swap fee

// UI Constants
export const SUPPORTED_TOKENS = [
  { symbol: 'SOL', name: 'Solana', decimals: 9, icon: '◎' },
  { symbol: 'BONK', name: 'Bonk', decimals: 5, icon: '🐕' },
  { symbol: 'WIF', name: 'dogwifhat', decimals: 6, icon: '🐶' },
  { symbol: 'POPCAT', name: 'Popcat', decimals: 9, icon: '🐱' },
  { symbol: 'MEW', name: 'cat in a dogs world', decimals: 5, icon: '😺' },
  { symbol: 'PNUT', name: 'Peanut the Squirrel', decimals: 6, icon: '🥜' },
];
