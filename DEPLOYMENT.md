# Deploying CloakBid to Midnight Preprod

This guide walks you through deploying the **CloakBid** Compact smart contract to the Midnight Preprod (Preproduction) network and connecting the frontend.

---

## Prerequisites

- **Node.js** v18+ installed
- **Midnight CLI / Compact SDK** installed (`npm install -g @midnight-ntwrk/compact-cli`)
- **Lace Wallet** with Midnight support (browser extension)
- Preprod testnet tDUST tokens from the faucet

---

## Step 1 — Get Preprod tDUST

1. Open your **Lace wallet** and switch to **Midnight Preprod** network.
2. Copy your Midnight wallet address.
3. Visit the [Midnight Faucet](https://faucet.midnight.network) and paste your address.
4. Wait ~30 seconds for tokens to arrive.

---

## Step 2 — Compile the Compact Contract

```bash
# From project root
cd contracts/

# Compile cloakbid.compact to circuit artifacts
compact compile cloakbid.compact

# Verify output artifacts
ls -la
# Expected: cloakbid.compact.json, proving_key.bin, verifying_key.bin
```

---

## Step 3 — Deploy Contract to Preprod

### Option A — Node.js SDK Deployment Script (Recommended)

1. **Start the Midnight Proof Server in Docker:**
   In your Node.js smart contract deployment script, you must explicitly point your application's `ProofProvider` to this local Docker instance so it knows where to send the cryptography requests:

   ```bash
   docker run -d -p 6300:6300 midnightnetwork/proof-server:latest
   ```

2. **Initialize Midnight SDK Providers (`contracts/deploy.js`):**
   ```javascript
   import { HttpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';

   // Connect to the Docker container you just started
   const proofProvider = new HttpClientProofProvider('http://127.0.0.1:6300');
   ```

3. **Execute the deployment script:**
   ```bash
   node contracts/deploy.js
   ```

   Expected output:
   ```text
   [Config] Target Network: Midnight Preprod
   [Config] Proof Server:   http://127.0.0.1:6300
   ✓ ProofProvider configured with http://127.0.0.1:6300
   ✓ Contract deployment confirmed on-chain!
   Contract Address: 0x51d23a07eec0e7d2c94aceeb613e414900dcfb5a6ad18f3459875f733f6d8b15
   Explorer Link:    https://preview.midnightexplorer.com/contracts/0x51d23a07eec0e7d2c94aceeb613e414900dcfb5a6ad18f3459875f733f6d8b15
   ```

### Option B — Deploy using Compact CLI

```bash
# Set environment for Preprod
export MIDNIGHT_NETWORK=preprod

# Deploy using Compact CLI
compact deploy \
  --network preprod \
  --contract cloakbid.compact.json \
  --wallet YOUR_LACE_WALLET_ADDRESS

# Expected output:
# ✓ Contract deployed at: 0x51d23a07eec0e7d2c94aceeb613e414900dcfb5a6ad18f3459875f733f6d8b15
# ✓ Transaction ID: 0xabc123...
# ✓ Block confirmed: #1,245,891
```

> 📋 **Save the contract address** — you'll need it in Step 4.

---

## Step 4 — Configure Frontend Environment

```bash
# Copy the environment template
cp .env.example .env

# Edit .env and set your deployed contract address:
VITE_CONTRACT_ADDRESS=0x51d23a07eec0e7d2c94aceeb613e414900dcfb5a6ad18f3459875f733f6d8b15
VITE_MIDNIGHT_NETWORK=preprod
```

---

## Step 5 — Build and Deploy Frontend

### Option A — GitHub Pages (Recommended for demo)
```bash
# Build production bundle
npm run build

# The CI/CD pipeline auto-deploys to GitHub Pages on push to main.
# Your live URL: https://Soumi14mili.github.io/CloakBid/
```

### Option B — Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy (uses vercel.json config)
vercel --prod
```

### Option C — Local Preview
```bash
npm run preview
# Opens at http://localhost:4173/
```

---

## Deployed Contract Information

| Network | Contract Address | Block Explorer |
|---------|-----------------|----------------|
| **Preprod** | `0x51d23a07eec0e7d2c94aceeb613e414900dcfb5a6ad18f3459875f733f6d8b15` | [View on Explorer](https://preview.midnightexplorer.com/contracts/0x51d23a07eec0e7d2c94aceeb613e414900dcfb5a6ad18f3459875f733f6d8b15) |

---

## Verifying the Deployment

1. Open the live app URL
2. Connect your Lace wallet (switch to Midnight Preprod)
3. In the **Admin Panel** tab, click **Initialize Auction** with a reserve price
4. Navigate to **Bid Chamber** and place a sealed bid
5. Open the **Commitment Vault** to see your on-chain commitment hash
6. Check the [block explorer](https://preview.midnightexplorer.com) to verify the transaction

---

## Troubleshooting

| Error | Solution |
|-------|----------|
| `Wallet not found` | Install Lace browser extension and reload |
| `Insufficient tDUST` | Claim from Preprod faucet |
| `Contract not found` | Verify contract address in `.env` |
| `Circuit verification failed` | Ensure `npm run build` was run after editing contracts |
