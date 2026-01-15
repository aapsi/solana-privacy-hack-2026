# GhostBuys 👻

**Trade memecoins privately. No copy trading. No wallet tracking. No front-running.**

> Built for the Solana Privacy Hackathon 2026

## The Problem

Every memecoin trader knows the pain:
- **Copy traders** watch your wallet and front-run your buys
- **Influencers** dump on followers who copy their trades
- **Snipers** track successful wallets and steal alpha
- **MEV bots** sandwich your transactions

Your on-chain history is a liability. Every winning trade makes you a target.

## The Solution

GhostBuys lets you trade memecoins with **fully private transactions**:

- ✅ **Hidden wallet** - No one can link trades to your identity
- ✅ **Hidden amounts** - Buy/sell sizes are encrypted
- ✅ **Anti-copy** - Impossible to follow your trades
- ✅ **Anti-snipe** - Protected from front-running
- ✅ **Optional reveal** - Flex your gains when YOU choose

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                      GhostBuys Flow                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. DEPOSIT          2. TRADE            3. WITHDRAW       │
│   ┌─────────┐        ┌─────────┐         ┌─────────┐       │
│   │ Public  │   →    │ Private │    →    │ Public  │       │
│   │ Wallet  │        │ Vault   │         │ Wallet  │       │
│   └─────────┘        └─────────┘         └─────────┘       │
│                           │                                 │
│                      Hidden from                            │
│                      chain observers                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

1. **Deposit** SOL/tokens into your private GhostBuys vault
2. **Trade** memecoins through confidential transfers (amounts + wallet hidden)
3. **Withdraw** to any wallet when ready (unlinkable to deposits)

## Tech Stack

- **Solana** - Base layer
- **Confidential Transfers** - SPL Token 2022 confidential extension
- **ShadowWire** - Bulletproofs for hidden amounts
- **Light Protocol** - ZK compression for privacy
- **Helius/Quicknode** - RPC infrastructure

## Target Bounties

| Bounty | Prize | Integration |
|--------|-------|-------------|
| Track 01: Private Payments | $15,000 | Core product |
| Anoncoin | $10,000 | Confidential token trading |
| Radr Labs (ShadowWire) | $15,000 | Bulletproofs integration |
| Privacy Cash | $15,000 | SDK integration |
| Helius | $5,000 | RPC infrastructure |
| Quicknode | $3,000 | RPC infrastructure |

## Quick Start

```bash
# Install dependencies
npm install

# Start local development
npm run dev

# Run tests
npm test

# Deploy to devnet
npm run deploy:devnet
```

## Project Structure

```
ghostbuys/
├── programs/           # Anchor smart contracts
│   └── ghostbuys/      # Main program
├── app/                # Next.js frontend
├── packages/
│   └── sdk/            # TypeScript SDK
└── docs/               # Documentation
```

## Team

Built with 👻 for Solana Privacy Hackathon 2026

## License

MIT
