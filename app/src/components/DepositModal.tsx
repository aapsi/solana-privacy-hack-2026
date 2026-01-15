'use client';

import { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { X, ArrowDownToLine, AlertCircle, Loader2 } from 'lucide-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface DepositModalProps {
  onClose: () => void;
  onSuccess: (amount: number) => void;
}

export function DepositModal({ onClose, onSuccess }: DepositModalProps) {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [walletBalance, setWalletBalance] = useState<number | null>(null);

  // Fetch wallet balance on mount
  useState(() => {
    if (publicKey) {
      connection.getBalance(publicKey).then(balance => {
        setWalletBalance(balance / LAMPORTS_PER_SOL);
      });
    }
  });

  const handleDeposit = async () => {
    if (!publicKey || !amount) return;

    setLoading(true);
    setError('');

    try {
      const depositAmount = parseFloat(amount);

      if (isNaN(depositAmount) || depositAmount <= 0) {
        throw new Error('Invalid amount');
      }

      if (walletBalance && depositAmount > walletBalance) {
        throw new Error('Insufficient balance');
      }

      // TODO: Replace with actual program instruction
      // For now, simulate deposit
      await new Promise(resolve => setTimeout(resolve, 2000));

      onSuccess(depositAmount);
    } catch (err: any) {
      setError(err.message || 'Deposit failed');
    } finally {
      setLoading(false);
    }
  };

  const setMaxAmount = () => {
    if (walletBalance) {
      // Leave some SOL for fees
      setAmount(Math.max(0, walletBalance - 0.01).toFixed(4));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl p-6 w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <ArrowDownToLine className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Deposit to Vault</h3>
              <p className="text-xs text-zinc-500">Funds enter the privacy shield</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <label className="block text-sm text-zinc-400 mb-2">Amount (SOL)</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-green-500 transition-colors"
            />
            <button
              onClick={setMaxAmount}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-zinc-700 hover:bg-zinc-600 px-2 py-1 rounded transition-colors"
            >
              MAX
            </button>
          </div>
          {walletBalance !== null && (
            <p className="text-xs text-zinc-500 mt-2">
              Wallet balance: {walletBalance.toFixed(4)} SOL
            </p>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-zinc-800/50 rounded-lg p-4 mb-4">
          <p className="text-sm text-zinc-400">
            <span className="text-green-500 font-medium">Note:</span> After depositing, your funds enter the private vault.
            All trades and withdrawals will be unlinkable to this wallet.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm mb-4">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleDeposit}
          disabled={loading || !amount}
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 px-4 rounded-xl transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Depositing...
            </>
          ) : (
            <>
              <ArrowDownToLine className="w-4 h-4" />
              Deposit {amount || '0'} SOL
            </>
          )}
        </button>
      </div>
    </div>
  );
}
