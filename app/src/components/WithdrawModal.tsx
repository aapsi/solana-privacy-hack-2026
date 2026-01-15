'use client';

import { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { X, ArrowUpFromLine, AlertCircle, Loader2, Shield } from 'lucide-react';
import { PublicKey } from '@solana/web3.js';

interface WithdrawModalProps {
  onClose: () => void;
  maxAmount: number;
  onSuccess: (amount: number) => void;
}

export function WithdrawModal({ onClose, maxAmount, onSuccess }: WithdrawModalProps) {
  const { publicKey } = useWallet();
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [useFreshWallet, setUseFreshWallet] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleWithdraw = async () => {
    if (!amount) return;

    setLoading(true);
    setError('');

    try {
      const withdrawAmount = parseFloat(amount);

      if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
        throw new Error('Invalid amount');
      }

      if (withdrawAmount > maxAmount) {
        throw new Error('Insufficient vault balance');
      }

      // Validate recipient address if using custom address
      if (!useFreshWallet && recipient) {
        try {
          new PublicKey(recipient);
        } catch {
          throw new Error('Invalid Solana address');
        }
      }

      // TODO: Replace with actual program instruction
      // For now, simulate withdrawal
      await new Promise(resolve => setTimeout(resolve, 2000));

      onSuccess(withdrawAmount);
    } catch (err: any) {
      setError(err.message || 'Withdrawal failed');
    } finally {
      setLoading(false);
    }
  };

  const setMaxAmount_ = () => {
    setAmount(maxAmount.toFixed(4));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass rounded-2xl p-6 w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <ArrowUpFromLine className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Withdraw from Vault</h3>
              <p className="text-xs text-zinc-500">Send to any wallet (unlinkable)</p>
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
              onClick={setMaxAmount_}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-zinc-700 hover:bg-zinc-600 px-2 py-1 rounded transition-colors"
            >
              MAX
            </button>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            Available: {maxAmount.toFixed(4)} SOL
          </p>
        </div>

        {/* Destination Toggle */}
        <div className="mb-4">
          <label className="block text-sm text-zinc-400 mb-2">Destination</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setUseFreshWallet(true)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                useFreshWallet
                  ? 'bg-green-500/20 border border-green-500 text-green-500'
                  : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white'
              }`}
            >
              Fresh Wallet (Safer)
            </button>
            <button
              onClick={() => setUseFreshWallet(false)}
              className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                !useFreshWallet
                  ? 'bg-green-500/20 border border-green-500 text-green-500'
                  : 'bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white'
              }`}
            >
              Custom Address
            </button>
          </div>
        </div>

        {/* Custom Address Input */}
        {!useFreshWallet && (
          <div className="mb-4">
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter Solana address..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors font-mono"
            />
          </div>
        )}

        {/* Privacy Notice */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 mb-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-green-400 font-medium mb-1">Privacy Protected</p>
            <p className="text-xs text-zinc-400">
              {useFreshWallet
                ? 'We\'ll generate a fresh wallet for you. Maximum privacy.'
                : 'Using a custom address. Make sure it\'s not linked to your identity.'}
            </p>
          </div>
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
          onClick={handleWithdraw}
          disabled={loading || !amount || (!useFreshWallet && !recipient)}
          className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-3 px-4 rounded-xl transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Withdrawing...
            </>
          ) : (
            <>
              <ArrowUpFromLine className="w-4 h-4" />
              Withdraw {amount || '0'} SOL
            </>
          )}
        </button>
      </div>
    </div>
  );
}
