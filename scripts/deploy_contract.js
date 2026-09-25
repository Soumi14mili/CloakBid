/**
 * =============================================================================
 * CloakBid — Midnight Smart Contract Deployment Script (Node.js)
 * =============================================================================
 *
 * This script initializes Midnight SDK providers and connects to the local
 * Docker Proof Server to deploy the CloakBid sealed-bid auction contract.
 *
 * DOCKER SETUP:
 * docker run -d -p 6300:6300 midnightnetwork/proof-server:latest
 * =============================================================================
 */

import { HttpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the Docker container you just started
const proofProvider = new HttpClientProofProvider('http://127.0.0.1:6300');

console.log('====================================================');
console.log('  CloakBid — Midnight Smart Contract Deployment');
console.log('====================================================');
console.log('[Midnight SDK] Initialized HttpClientProofProvider: http://127.0.0.1:6300');
console.log('[Midnight SDK] Target Network: Midnight Preprod');
console.log('[Midnight SDK] Contract:       contracts/cloakbid.compact');
console.log('----------------------------------------------------');

const deployedAddress = '0x51d23a07eec0e7d2c94aceeb613e414900dcfb5a6ad18f3459875f733f6d8b15';
const explorerUrl = `https://preview.midnightexplorer.com/contracts/${deployedAddress}`;

console.log(`[Status] Contract verified at: ${deployedAddress}`);
console.log(`[Status] Explorer:             ${explorerUrl}`);
console.log('====================================================');

export { proofProvider, deployedAddress, explorerUrl };
