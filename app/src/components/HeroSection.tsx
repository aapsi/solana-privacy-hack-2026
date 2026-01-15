'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Ghost, Shield, EyeOff, Zap } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4">
      {/* Main Hero */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6">
          <Ghost className="w-4 h-4 text-green-500" />
          <span className="text-green-500 text-sm font-medium">Private Trading on Solana</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Trade Memecoins
          <br />
          <span className="gradient-text">Like a Ghost</span>
        </h1>

        <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
          No copy trading. No wallet tracking. No front-running.
          <br />
          Your trades are invisible.
        </p>

        <WalletMultiButton />
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <FeatureCard
          icon={<EyeOff className="w-6 h-6" />}
          title="Hidden Amounts"
          description="Trade sizes are encrypted. Nobody sees how much you're buying."
        />
        <FeatureCard
          icon={<Shield className="w-6 h-6" />}
          title="Unlinkable Wallets"
          description="Withdraw to any address. No connection to your deposit."
        />
        <FeatureCard
          icon={<Zap className="w-6 h-6" />}
          title="Anti-Copy Trading"
          description="Your alpha stays yours. Impossible to follow your trades."
        />
      </div>

      {/* Powered By */}
      <div className="mt-16 text-center">
        <p className="text-zinc-500 text-sm mb-4">Powered by</p>
        <div className="flex items-center justify-center gap-8 opacity-50">
          <span className="text-zinc-400">Solana</span>
          <span className="text-zinc-400">Privacy Cash</span>
          <span className="text-zinc-400">ShadowWire</span>
          <span className="text-zinc-400">Helius</span>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="glass rounded-2xl p-6 hover:border-green-500/30 transition-colors">
      <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm">{description}</p>
    </div>
  );
}
