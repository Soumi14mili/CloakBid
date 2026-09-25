# CloakBid — Dual-State ZK Architecture

## Overview

<p align="center">
  <img src="./images/cloak_vault_banner.png" alt="Cloak Vault Architecture" width="100%" />
</p>

CloakBid leverages the Midnight Network's unique **dual-state architecture** to achieve cryptographically guaranteed bid confidentiality in a public blockchain environment.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        MIDNIGHT DUAL-STATE MODEL                         │
├─────────────────────────────┬───────────────────────────────────────────┤
│   PRIVATE STATE (Client)    │        PUBLIC STATE (Ledger)              │
├─────────────────────────────┼───────────────────────────────────────────┤
│  bid_amount(): Uint<64>     │  auction_open: Boolean                    │
│  bid_salt(): Bytes<32>      │  finalized: Boolean                       │
│  wallet_identity            │  reserve_price: Uint<64>                  │
│  salt_nonce                 │  bid_count: Uint<32>                      │
│                             │  winner_hash: Bytes<32>                   │
│  ← Stays in client memory   │  ← Stored on Midnight ledger              │
│  ← NEVER transmitted        │  ← Publicly readable by anyone            │
└─────────────────────────────┴───────────────────────────────────────────┘
```

---

## ZK Circuit Execution Flow

<p align="center">
  <img src="./images/cloakbid_protocol_architecture.png" alt="CloakBid ZK Circuit Execution Pipeline" width="100%" />
</p>

### 1. Bid Commitment (`commit_bid()`)

```
Client Witness Memory:
  bid_amount = 750 tDUST         (PRIVATE — never leaves client)
  bid_salt   = 0x3fa8...c91d     (PRIVATE — random 256-bit nonce)

ZK Circuit (executed locally):
  1. Assert: bid_amount >= reserve_price          (ZK constraint, no disclosure)
  2. Compute: hash = Pedersen(bid_amount || salt) (commitment hash)
  3. Generate: π (PLONK proof that constraints hold)

Submitted to Ledger (PUBLIC):
  - commitment_hash = 0xa3f8b2e1...               (public)
  - proof π                                       (public, verifiable)
  - bid_count += 1                                (public counter)

What adversary learns: NOTHING about bid_amount ✓
```

### 2. Auction Finalization (`finalize_auction()`)

```
Settlement Phase:
  - All commitment hashes are visible on-chain
  - Winner is determined by highest bid (proven via ZK)
  - winner_hash set to winning commitment
  - Losing bid amounts: PERMANENTLY SEALED ✓
```

---

## Threat Model

### Threats Mitigated

| Attack Vector | Mitigation |
|---------------|------------|
| **Front-running MEV** | Bids are sealed — amount unknown until finalization |
| **Competitor intelligence** | Bid amounts never disclosed, even post-auction |
| **Bid sniping** | Auction window enforced by circuit `assert(auction_open)` |
| **Identity correlation** | Midnight shielded addresses decouple bid from wallet |
| **Pre-image attack on hash** | Pedersen hash is collision resistant under DL assumption |
| **Replay attacks** | Salt nonce prevents commitment reuse across auctions |

### Trust Assumptions
- The Midnight Network consensus is honest (Byzantine fault tolerant)
- SHA-256 / Pedersen hash functions are computationally secure
- PLONK trusted setup ceremony was conducted correctly
- The client browser is not compromised at bid submission time

---

## Component Architecture

```
src/
├── hooks/
│   ├── useCloakBid.ts        ← Auction state machine + ZK proof orchestrator
│   ├── useLaceWallet.ts      ← Midnight Lace wallet adapter
│   └── useCountdown.ts       ← Real-time countdown clock
│
├── components/
│   ├── ZKBidProver.tsx        ← Visualizes PLONK circuit execution
│   ├── AuctionChamber.tsx     ← Encrypted bid input + commitment preview
│   ├── BidCommitmentVault.tsx ← On-chain commitment matrix display
│   ├── PrivacyShieldPanel.tsx ← Dual-state audit + adversary simulator
│   └── WinnerReveal.tsx       ← Settlement with ZK proof verification badge
│
└── utils/
    ├── crypto.ts              ← Commitment hash, salt generation
    └── audio.ts               ← Web Audio API sound effects engine
```
