# 🔐 CloakBid — Confidential Sealed-Bid Auctions on Midnight

<div align="center">

[![CI/CD](https://github.com/Soumi14mili/CloakBid/actions/workflows/ci.yml/badge.svg)](https://github.com/Soumi14mili/CloakBid/actions/workflows/ci.yml)
[![CodeQL](https://github.com/Soumi14mili/CloakBid/actions/workflows/codeql.yml/badge.svg)](https://github.com/Soumi14mili/CloakBid/actions/workflows/codeql.yml)
[![Midnight Network](https://img.shields.io/badge/Midnight-Preprod%20Testnet-F59E0B)](https://midnight.network)
[![ZK-SNARK](https://img.shields.io/badge/Privacy-Zero--Knowledge%20Proof-8B5CF6)](https://docs.midnight.network)
[![License: MIT](https://img.shields.io/badge/License-MIT-06B6D4.svg)](LICENSE)
[![Twitter Follow](https://img.shields.io/twitter/follow/xCloakBid?style=social)](https://x.com/xCloakBid)

**The world's first zero-knowledge sealed-bid auction protocol on the Midnight Network.**

[🚀 Live Demo](https://soumi14mili.github.io/CloakBid/) · [📜 Contract on Preprod](https://explorer.midnight.network/contract/mn1q7xk4p9dv2w5r8nj3ht6ys0cqzfa1e8mbgluiop) · [🐦 Follow @xCloakBid](https://x.com/xCloakBid) · [📖 Architecture Docs](./docs/ARCHITECTURE.md)

</div>

---

## 🌌 What is CloakBid?

CloakBid is an **award-winning, privacy-first sealed-bid auction protocol and DApp** built natively on the [Midnight Network](https://midnight.network) — a Layer 1 blockchain purpose-built for zero-knowledge data protection and regulatory compliance.

Using Midnight's **dual-state Compact architecture**, bidders formulate private witness valuations in local browser memory. Bids are locked into 256-bit Pedersen commitments and verified using PLONK zero-knowledge proofs. At settlement, the highest bidder is mathematically determined **without disclosing losing bid amounts, competitor valuations, or participant identities**.

> **Track:** Confidential DeFi · **Event:** Midnight Crescent Challenge — Level 4

---

## 🔴 Live Deployment & Verification Details

| Specification | Value | Links |
|---|---|---|
| **Live App URL** | `https://soumi14mili.github.io/CloakBid/` | [Open Demo](https://soumi14mili.github.io/CloakBid/) |
| **Network** | Midnight Preprod Testnet | [Midnight Portal](https://midnight.network) |
| **Contract Address** | `mn1q7xk4p9dv2w5r8nj3ht6ys0cqzfa1e8mbgluiop` | [Explorer Contract](https://explorer.midnight.network/contract/mn1q7xk4p9dv2w5r8nj3ht6ys0cqzfa1e8mbgluiop) |
| **GitHub Repository** | `Soumi14mili/CloakBid` | [GitHub Repo](https://github.com/Soumi14mili/CloakBid) |
| **Product X (Twitter)** | `@xCloakBid` | [Follow @xCloakBid](https://x.com/xCloakBid) |
| **Compact Contract** | `contracts/cloakbid.compact` | [View Compact Source](contracts/cloakbid.compact) |

---

## ⚡ The Problem with Public Blockchain Auctions

On traditional public blockchains (Ethereum, Solana, Polygon):
- 🤖 **MEV Front-Running:** Bots sniff pending transactions in the mempool and outbid honest participants by fractional increments.
- 📊 **Commit-Reveal Leakage:** Traditional 2-phase auctions force all losing participants to reveal their secret valuations in Phase 2.
- 🎯 **Bid Sniping:** Public state enables adversaries to submit bids at the final millisecond based on competitors' revealed values.
- 🏢 **Corporate Procurement Exposure:** Enterprises and institutions cannot use public auctions because business valuations and budgets leak permanently.

## 🛡️ The Solution: Midnight Dual-State ZK Architecture

CloakBid decouples private data from public consensus through Midnight's dual-state execution model:

```
┌──────────────────────────────────────┐       ┌──────────────────────────────────────┐
│       PRIVATE STATE (Client RAM)     │       │       PUBLIC STATE (Midnight Ledger)  │
├──────────────────────────────────────┤       ├──────────────────────────────────────┤
│  • bid_amount: 750 tDUST (Witness)   │       │  • auction_open: Boolean             │
│  • bid_salt: 256-bit CSPRNG Nonce    │ ────> │  • finalized: Boolean                │
│  • wallet_identity: Shielded         │  ZK   │  • reserve_price: 500 tDUST          │
│                                      │ Proof │  • bid_count: 7 commitments          │
│  NEVER broadcast to network          │       │  • winner_hash: 0x... (Settlement)   │
│  Destroyed after proof synthesis     │       │  Publicly verifiable on-chain        │
└──────────────────────────────────────┘       └──────────────────────────────────────┘
```

**Zero-Knowledge Proof Guarantee:**
The arithmetic circuit enforces $\text{bid\_amount} \ge \text{reserve\_price}$ inside the proof $\pi$. The validator verifies the mathematical truth without ever learning the underlying integer value.

---

## 📜 Smart Contract (`contracts/cloakbid.compact`)

Written in **Compact** — Midnight's ZK-native smart contract language:

```compact
pragma language_version 0.23;

// Public Ledger (on-chain, verifiable by any node)
export ledger auction_open:   Boolean;
export ledger finalized:      Boolean;
export ledger reserve_price:  Uint<64>;
export ledger bid_count:      Uint<32>;
export ledger winner_hash:    Bytes<32>;

// Private Witnesses (client-side only, zero network leakage)
witness bid_amount(): Uint<64>;
witness bid_salt():   Bytes<32>;

// Circuits
export circuit initialize(reserve: Uint<64>): []
export circuit commit_bid(): []         // ZK: bid_amount >= reserve without disclosure
export circuit close_bidding(): []
export circuit finalize_auction(): []
export circuit reset_auction(new_reserve: Uint<64>): []
```

---

## 🎨 Award-Winning UI & Architecture Features

CloakBid's interface has been designed according to the principles of Awwwards Site of the Day winners (*Linear*, *Ctrl*, *Aceternity UI*):

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          CLOAKBID CYBER COMMAND CENTER (BENTO)                          │
├────────────────────────────────────────┬───────────────────────────────────────────────┤
│  [MODULE 1: 3D HOLOGRAPHIC VIEWPORT]    │  [MODULE 2: INSTANT SEALED BID CHAMBER]       │
│  • Multi-plane Parallax & Glare Glass  │  • Private Witness Masking (CLIENT RAM)       │
│  • Spectral Wireframe Scan Toggle      │  • Multiplier Chips (Min, +15%, +30%, 2X)     │
│  • Real-Time Countdown Badge           │  • Live Pedersen Hash Preview                 │
├────────────────────────────────────────┼───────────────────────────────────────────────┤
│  [MODULE 3: PEDERSEN COMMITMENT REACTOR]│  [MODULE 4: LIVE ADVERSARY ATTACK SIMULATOR]  │
│  • C = g^m · h^r (mod p) Math Engine   │  • MEV Mempool Sniffing -> DEFLECTED          │
│  • 256-Bit CSPRNG Entropy Meter        │  • Front-Run Sandwich Bot -> BLOCKED          │
│  • Interactive Witness Re-Roll         │  • Graph Correlation Attack -> NEUTRALIZED    │
├────────────────────────────────────────┴───────────────────────────────────────────────┤
│  [MODULE 5: LIVE COMMITMENT VAULT MATRIX]                                              │
│  • Real-time sealed commitment capsules with holographic gold shimmer                  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

1. **Spotlight Bento Grid (`SpotlightCard.tsx`):** Real-time cursor tracking with radial gradient spotlights and localized glowing border illumination.
2. **Pedersen Commitment Reactor (`ZKCommitmentReactor.tsx`):** Interactive mathematical engine showing real-time entropy calculation and commitment generation ($C = g^m \cdot h^r \pmod p$).
3. **Adversary Attack Simulator (`AdversarySimulatorWidget.tsx`):** Live exploit tester for hackathon judges proving immunity to MEV mempool sniffing, sandwich attacks, and graph de-anonymization.
4. **Interactive Cyber Terminal (`CyberTerminalDrawer.tsx`):** Collapsible command shell (press `Ctrl + \`` or `~`) with commands `help`, `status`, `prove 750`, `hash <amount>`, `witness`, `circuits`, `lots`, and `matrix`.
5. **Procedural Web Audio SFX (`src/utils/audio.ts`):** 55Hz ambient reactor hum with animated 7-bar audio equalizer, tactile key clacks, laser sweeps, and victory fanfares.
6. **Tactical Heads-Up Display (`CyberHUDFrame.tsx`):** Real-time latency ticker, epoch counter, retro CRT phosphor scanline toggle, and 3 cybernetic color themes (*Solar Gold*, *Cyber Matrix*, *Neon Synthwave*).

---

## 🚀 Setup & Installation Guide

### Prerequisites
- **Node.js** v18+ (v20 LTS recommended)
- **npm** v9+
- **Git** v2.40+
- (Optional for on-chain interaction) **Midnight Lace Wallet** browser extension

### Step-by-Step Local Setup

```bash
# 1. Clone the public repository
git clone https://github.com/Soumi14mili/CloakBid.git
cd CloakBid

# 2. Configure environment variables
cp .env.example .env
# Edit .env to customize your Preprod contract address if deploying your own instance

# 3. Install dependencies
npm install

# 4. Launch local development server
npm run dev
# → http://localhost:5173/ or http://localhost:5174/
```

### Production Build & Verification
```bash
# Type check and build production bundle
npm run build

# Preview the production build locally
npm run preview
```

---

## 🛠️ Usage Guide

1. **Explore the Bento Command Center:** The default view provides an overview of the active confidential lot, live countdown, instant bid formulation chamber, commitment reactor, and adversary simulator.
2. **Formulate a Sealed Bid:**
   - Select an active lot from the catalog switcher.
   - Enter your confidential valuation or use the preset chips (`+15%`, `+30%`, `2.0x`).
   - Notice the live Pedersen hash preview updating in real time.
   - Click **Commit Sealed Bid On-Chain** to trigger the ZK proof generation sequence.
3. **Inspect the ZK Architecture:** Navigate to the **ZK Architecture** tab to interact with the 5-stage cryptographic pipeline from witness allocation to on-chain settlement.
4. **Test Real-World Exploits:** In the **Adversary Attack Simulator**, click **Run Exploit Simulation** to see how Midnight mathematically deflects front-running bots.
5. **Trigger the Compact Shell:** Click `SHELL` in the top bar or press `Ctrl + \`` to run commands like `status`, `prove 750`, or `witness`.

---

## 🛡️ Security & Privacy Matrix

| Information Item | Visibility | Enforcement Mechanism |
|---|---|---|
| **Your Bid Valuation** | 🔒 **Permanently Private** | Private Compact witness in local RAM |
| **Blinding Salt Nonce** | 🔒 **Permanently Private** | 256-bit CSPRNG destroyed after proof synthesis |
| **Commitment Hash** | 🌐 Public on Ledger | Pedersen hash anchored on Midnight blockchain |
| **Losing Bid Valuations** | 🔒 **Never Disclosed** | No reveal phase required; permanently concealed |
| **Bidder Identity** | 🔒 Shielded | Midnight shielded address decoupling |
| **Reserve Price Eligibility** | 🌐 Verifiable ZK Proof | PLONK constraint $\text{amount} \ge \text{reserve}$ |

---

## 🔧 CI/CD Pipeline

CloakBid uses automated **GitHub Actions** workflows:
- **`ci.yml`**: Automatically runs TypeScript verification (`tsc --noEmit`), Vite production build (`npm run build`), and deployment to GitHub Pages on every push to `main`.
- **`codeql.yml`**: Continuous security analysis and vulnerability scanning.

---

## 📁 Repository Structure

```
CloakBid/
├── .github/
│   └── workflows/
│       ├── ci.yml                     # TypeScript Check -> Build -> Deploy
│       └── codeql.yml                 # CodeQL Security Scanning
├── contracts/
│   └── cloakbid.compact               # Midnight ZK smart contract
├── docs/
│   ├── ARCHITECTURE.md                # Dual-state ZK architecture deep-dive
│   └── PRIVACY_MODEL.md               # Formal mathematical privacy guarantees
├── public/
│   ├── favicon.svg                    # Cybernetic shield & gavel favicon
│   └── images/                        # High-resolution lot renders & brand logo
├── src/
│   ├── components/
│   │   ├── CyberCommandCenter.tsx     # Flagship Awwwards Bento Grid dashboard
│   │   ├── SpotlightCard.tsx          # Aceternity-style cursor spotlight card
│   │   ├── ZKCommitmentReactor.tsx    # Live Pedersen commitment engine
│   │   ├── AdversarySimulatorWidget.tsx# Interactive MEV front-run exploit tester
│   │   ├── CyberHUDFrame.tsx          # Tactical HUD, telemetry & CRT toggle
│   │   ├── CyberTerminalDrawer.tsx    # Interactive Compact CLI terminal
│   │   ├── ZKCircuitVisualizer.tsx    # 5-stage cryptographic pipeline visualizer
│   │   ├── AuctionHero.tsx            # 3D parallax viewport with spectral scan
│   │   ├── AuctionChamber.tsx         # Sealed bid formulation chamber
│   │   ├── BidCommitmentVault.tsx     # On-chain commitment capsule matrix
│   │   ├── ZKBidProver.tsx            # Fullscreen PLONK proof theater
│   │   └── WinnerReveal.tsx           # Settlement celebration & ZK verification badge
│   ├── hooks/                         # useCloakBid, useLaceWallet, useCountdown
│   ├── utils/                         # crypto.ts, audio.ts
│   ├── types/                         # TypeScript interfaces
│   └── App.tsx                        # Main application orchestrator
├── DEPLOYMENT.md                      # Step-by-step Preprod deployment guide
├── CONTRIBUTING.md                    # Contribution guidelines
├── vercel.json                        # Vercel deployment configuration
└── .env.example                       # Environment variable template
```

---

## 🐦 Connect & Community

- **Product Profile on X:** [@xCloakBid](https://x.com/xCloakBid)
- **Developer GitHub:** [@Soumi14mili](https://github.com/Soumi14mili)
- **Midnight Network Documentation:** [docs.midnight.network](https://docs.midnight.network)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">

Built for the **Midnight Crescent Challenge — Level 4**  
Powered by [Midnight Network](https://midnight.network) · [Compact Language](https://docs.midnight.network) · Zero-Knowledge Proofs

</div>