'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { VaultCard } from '@/components/VaultCard';
import { DepositModal } from '@/components/DepositModal';
import { WithdrawModal } from '@/components/WithdrawModal';
import { SwapInterface } from '@/components/SwapInterface';
import { HeroSection } from '@/components/HeroSection';

export default function Home() {
  const { connected } = useWallet();
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [vaultBalance, setVaultBalance] = useState<number>(0);

  if (!connected) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <HeroSection />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-zinc-400">Trade privately. Stay invisible.</p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vault Card */}
          <div className="lg:col-span-1">
            <VaultCard
              balance={vaultBalance}
              onDeposit={() => setShowDeposit(true)}
              onWithdraw={() => setShowWithdraw(true)}
            />
          </div>

          {/* Swap Interface */}
          <div className="lg:col-span-2">
            <SwapInterface vaultBalance={vaultBalance} />
          </div>
        </div>

        {/* Privacy Status */}
        <div className="mt-8 glass rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <h3 className="text-lg font-semibold">Privacy Status</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <p className="text-zinc-400 mb-1">Wallet Link</p>
              <p className="text-green-400 font-medium">Broken</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <p className="text-zinc-400 mb-1">Trade Amounts</p>
              <p className="text-green-400 font-medium">Hidden</p>
            </div>
            <div className="bg-zinc-800/50 rounded-lg p-4">
              <p className="text-zinc-400 mb-1">Copy Protection</p>
              <p className="text-green-400 font-medium">Active</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDeposit && (
        <DepositModal
          onClose={() => setShowDeposit(false)}
          onSuccess={(amount) => {
            setVaultBalance(prev => prev + amount);
            setShowDeposit(false);
          }}
        />
      )}
      {showWithdraw && (
        <WithdrawModal
          onClose={() => setShowWithdraw(false)}
          maxAmount={vaultBalance}
          onSuccess={(amount) => {
            setVaultBalance(prev => prev - amount);
            setShowWithdraw(false);
          }}
        />
      )}
    </main>
  );
}
