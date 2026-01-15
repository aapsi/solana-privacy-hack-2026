'use client';

import { useState } from 'react';
import { ArrowDownUp, ChevronDown, Eye, EyeOff, Loader2, Lock } from 'lucide-react';

interface SwapInterfaceProps {
  vaultBalance: number;
}

interface Token {
  symbol: string;
  name: string;
  icon: string;
  balance?: number;
}

const TOKENS: Token[] = [
  { symbol: 'SOL', name: 'Solana', icon: '◎' },
  { symbol: 'BONK', name: 'Bonk', icon: '🐕' },
  { symbol: 'WIF', name: 'dogwifhat', icon: '🐶' },
  { symbol: 'POPCAT', name: 'Popcat', icon: '🐱' },
  { symbol: 'MEW', name: 'cat in a dogs world', icon: '😺' },
  { symbol: 'PNUT', name: 'Peanut the Squirrel', icon: '🥜' },
];

export function SwapInterface({ vaultBalance }: SwapInterfaceProps) {
  const [fromToken, setFromToken] = useState<Token>(TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(TOKENS[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [showFromSelector, setShowFromSelector] = useState(false);
  const [showToSelector, setShowToSelector] = useState(false);
  const [hideAmount, setHideAmount] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSwap = async () => {
    if (!fromAmount) return;
    setLoading(true);
    // TODO: Implement actual swap with privacy SDK
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setFromAmount('');
  };

  const switchTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  // Mock exchange rate
  const getExchangeRate = () => {
    if (fromToken.symbol === 'SOL') return 1000000;
    if (toToken.symbol === 'SOL') return 0.000001;
    return 1;
  };

  const toAmount = fromAmount ? (parseFloat(fromAmount) * getExchangeRate()).toFixed(2) : '';

  return (
    <div className="glass rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Private Swap</h3>
          <p className="text-sm text-zinc-400">Amounts are hidden from chain observers</p>
        </div>
        <button
          onClick={() => setHideAmount(!hideAmount)}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          {hideAmount ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {hideAmount ? 'Hidden' : 'Visible'}
        </button>
      </div>

      {/* From Token */}
      <div className="bg-zinc-800/50 rounded-xl p-4 mb-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-400">From</span>
          <span className="text-sm text-zinc-400">
            Balance: {hideAmount ? '••••' : vaultBalance.toFixed(2)} {fromToken.symbol}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 bg-transparent text-2xl font-semibold focus:outline-none"
          />
          <div className="relative">
            <button
              onClick={() => setShowFromSelector(!showFromSelector)}
              className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg px-3 py-2 transition-colors"
            >
              <span className="text-xl">{fromToken.icon}</span>
              <span className="font-medium">{fromToken.symbol}</span>
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            </button>
            {showFromSelector && (
              <TokenSelector
                tokens={TOKENS}
                onSelect={(token) => {
                  setFromToken(token);
                  setShowFromSelector(false);
                }}
                onClose={() => setShowFromSelector(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Switch Button */}
      <div className="flex justify-center -my-3 relative z-10">
        <button
          onClick={switchTokens}
          className="bg-zinc-700 hover:bg-zinc-600 rounded-xl p-2 transition-colors border-4 border-dark-100"
        >
          <ArrowDownUp className="w-5 h-5" />
        </button>
      </div>

      {/* To Token */}
      <div className="bg-zinc-800/50 rounded-xl p-4 mt-2 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-400">To</span>
          <span className="text-sm text-zinc-400">
            Balance: {hideAmount ? '••••' : '0.00'} {toToken.symbol}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={hideAmount && toAmount ? '••••••' : toAmount}
            readOnly
            placeholder="0.00"
            className="flex-1 bg-transparent text-2xl font-semibold focus:outline-none text-zinc-400"
          />
          <div className="relative">
            <button
              onClick={() => setShowToSelector(!showToSelector)}
              className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg px-3 py-2 transition-colors"
            >
              <span className="text-xl">{toToken.icon}</span>
              <span className="font-medium">{toToken.symbol}</span>
              <ChevronDown className="w-4 h-4 text-zinc-400" />
            </button>
            {showToSelector && (
              <TokenSelector
                tokens={TOKENS}
                onSelect={(token) => {
                  setToToken(token);
                  setShowToSelector(false);
                }}
                onClose={() => setShowToSelector(false)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Privacy Indicator */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <Lock className="w-4 h-4 text-green-500" />
        <span className="text-zinc-400">
          Swap amount will be <span className="text-green-500">encrypted</span> using Bulletproofs
        </span>
      </div>

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={loading || !fromAmount || vaultBalance === 0}
        className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold py-4 px-4 rounded-xl transition-colors text-lg"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Swapping Privately...
          </>
        ) : vaultBalance === 0 ? (
          'Deposit funds first'
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Swap Privately
          </>
        )}
      </button>

      {/* Rate Info */}
      {fromAmount && (
        <div className="mt-4 text-center text-sm text-zinc-400">
          1 {fromToken.symbol} ≈ {getExchangeRate().toLocaleString()} {toToken.symbol}
        </div>
      )}
    </div>
  );
}

function TokenSelector({
  tokens,
  onSelect,
  onClose,
}: {
  tokens: Token[];
  onSelect: (token: Token) => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 bg-zinc-800 border border-zinc-700 rounded-xl p-2 min-w-[180px] z-50 shadow-xl">
        {tokens.map((token) => (
          <button
            key={token.symbol}
            onClick={() => onSelect(token)}
            className="w-full flex items-center gap-3 px-3 py-2 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <span className="text-xl">{token.icon}</span>
            <div className="text-left">
              <p className="font-medium">{token.symbol}</p>
              <p className="text-xs text-zinc-400">{token.name}</p>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
