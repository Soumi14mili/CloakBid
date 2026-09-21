# CloakBid — Privacy Model & Threat Analysis

## Privacy Guarantees

CloakBid provides **unconditional bid confidentiality** through Midnight's zero-knowledge proof system. This document formalizes what is and is not protected.

---

## Formal Privacy Properties

### 1. Bid Amount Confidentiality
**Property:** An adversary with full read access to the Midnight ledger cannot determine any bidder's bid amount with probability better than random guessing.

**Mechanism:**
- `bid_amount()` is a private Compact witness — it exists only in client-side memory during proof generation
- The commitment `H = Pedersen(bid_amount || salt)` is one-way: given H, computing bid_amount requires breaking the discrete logarithm assumption
- The PLONK proof `π` proves `bid_amount ≥ reserve_price` without revealing `bid_amount`

### 2. Bidder Identity Unlinkability
**Property:** On-chain commitment hashes cannot be linked back to the submitting wallet address.

**Mechanism:**
- Midnight uses shielded transaction semantics — the submitter's address is not included in the public ledger state
- Commitment hashes are computed only from `bid_amount || salt`, not from any wallet-derived key material

### 3. Losing Bid Permanent Sealing
**Property:** After auction finalization, the actual amounts of losing bids remain permanently undisclosed — not even the winner's amount is revealed on-chain.

**Mechanism:**
- Only `winner_hash` (the winning commitment hash) is stored on-chain
- No reveal phase is required — the PLONK proof certifies winner selection validity without exposing values

---

## What IS Public (On-Chain State)

| Public Information | Value | Why It's Public |
|-------------------|-------|-----------------|
| Commitment hashes | `0xa3f8b2...` | Required for on-chain verification |
| Bid submission timestamp | Block number | Inherent to blockchain ordering |
| Total bid count | Integer | Auction transparency |
| Reserve price | tDUST amount | Enables bid eligibility checking |
| Winner commitment hash | `0x...` | Post-settlement proof |

## What Is NEVER Public (Witness State)

| Private Information | Why It's Hidden |
|--------------------|-----------------|
| Actual bid amounts | Private witness — never transmitted |
| Salt values | Destroyed after proof generation |
| Bidder wallet identities | Midnight shielded transaction model |
| Losing bid amounts | Never disclosed — not even post-auction |
| Bid-to-address correlation | Not derivable from public state |

---

## Comparison to Alternatives

| Protocol | Bid Privacy | Loser Exposure | Front-Run Resistance |
|----------|------------|----------------|---------------------|
| **CloakBid (Midnight ZK)** | ✅ Full | ✅ Never | ✅ Full |
| Commit-Reveal (Ethereum) | ✅ Pre-reveal | ❌ All disclosed | ✅ Pre-reveal only |
| FPAAS (First-Price Auction) | ❌ None | ❌ Full | ❌ None |
| Vickrey (Second-Price) | ❌ None | ❌ Full | ❌ None |
| Encrypted Mempool | ⚠️ Partial | ❌ Post-decrypt | ⚠️ Block-proposer only |

---

## Residual Risk & Limitations

1. **Timing Side-Channel:** The time between auction open and bid submission is visible. Early or last-second bidders may be identified behaviorally.
2. **Amount Inference from Gas:** In standard EVM environments, gas cost can leak information about computation complexity. Midnight's fixed-cost circuits mitigate this.
3. **Network-Level Analysis:** A global network adversary may correlate IP addresses with bid submissions. Use Tor or a VPN for maximum anonymity.
4. **Trusted Setup:** PLONK relies on a trusted setup ceremony. CloakBid uses the Midnight Network's ceremony outputs.
