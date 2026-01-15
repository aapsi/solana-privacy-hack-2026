'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { Ghost, ArrowDownToLine, ArrowUpFromLine, Lock } from 'lucide-react';

interface VaultCardProps {
  balance: number;
  onDeposit: () => void;
  onWithdraw: () => void;
}

export function VaultCard({ balance, onDeposit, onWithdraw }: VaultCardProps) {
  const { publicKey } = useWallet();

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="glass rounded-2xl p-6 glow-green">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
            <Ghost className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold">Private Vault</h3>
            <p className="text-xs text-zinc-500">
              {publicKey ? truncateAddress(publicKey.toString()) : 'Not connected'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-green-500 text-xs">
          <Lock className="w-3 h-3" />
          <span>Secured</span>
        </div>
      </div>

      {/* Balance */}
      <div className="mb-6">
        <p className="text-zinc-400 text-sm mb-1">Vault Balance</p>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{balance.toFixed(2)}</span>
          <span className="text-zinc-400">SOL</span>
        </div>
        <p className="text-zinc-500 text-sm mt-1">
          ≈ ${(balance * 150).toFixed(2)} USD
        </p>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onDeposit}
          className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-black font-semibold py-3 px-4 rounded-xl transition-colors"
        >
          <ArrowDownToLine className="w-4 h-4" />
          Deposit
        </button>
        <button
          onClick={onWithdraw}
          disabled={balance === 0}
          className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3 px-4 rounded-xl transition-colors"
        >
          <ArrowUpFromLine className="w-4 h-4" />
          Withdraw
        </button>
      </div>

      {/* Privacy Note */}
      <div className="mt-4 bg-zinc-800/50 rounded-lg p-3">
        <p className="text-xs text-zinc-400">
          <span className="text-green-500">Tip:</span> Withdraw to a fresh wallet for maximum privacy.
        </p>
      </div>
    </div>
  );
}
