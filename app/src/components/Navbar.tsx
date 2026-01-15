'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Ghost } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="border-b border-zinc-800 bg-dark-100/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Ghost className="w-8 h-8 text-green-500" />
          <span className="text-xl font-bold">
            Ghost<span className="text-green-500">Buys</span>
          </span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-zinc-400 hover:text-white transition-colors">
            Dashboard
          </a>
          <a href="#" className="text-zinc-400 hover:text-white transition-colors">
            History
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors">
            Docs
          </a>
        </div>

        {/* Wallet Button */}
        <WalletMultiButton />
      </div>
    </nav>
  );
}
