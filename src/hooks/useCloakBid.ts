import { useState, useCallback } from 'react';
import type {
  LedgerState,
  BidCommitment,
  CircuitStep,
  Transaction,
  WinnerData,
  PrivacySnapshot,
  AuctionConfig,
} from '../types';
import {
  computeCommitmentHash,
  generateSalt,
  generateTxHash,
  sleep,
} from '../utils/crypto';
import relicImg from '../assets/images/relic.jpg';
import aiCoreImg from '../assets/images/ai_core.jpg';
import meshKeyImg from '../assets/images/mesh_key.jpg';

export const AUCTION_LOTS: AuctionConfig[] = [
  {
    id: 'lot-01',
    title: 'Midnight Genesis ZK-Shielded Relic #001',
    category: 'Cryptographic Artifact',
    rarity: 'GENESIS',
    description:
      'The foundational zero-knowledge encrypted cryptographic relic minted on Midnight. Contains on-chain self-verifying recursive SNARK circuits proving authenticity without disclosing owner identity or internal payload.',
    reservePrice: 1500,
    endTime: Date.now() + 2 * 3600 * 1000 + 45 * 60 * 1000,
    itemImage: relicImg,
    specs: [
      { label: 'Circuit Family', value: 'Halo2 / PLONK' },
      { label: 'Shielding Level', value: 'Class V (Full Stealth)' },
      { label: 'Provenance', value: 'Midnight Block #0' },
      { label: 'Collateral Escrow', value: 'Multi-Sig ZK Vault' },
    ],
  },
  {
    id: 'lot-02',
    title: 'Project Chimera: Quantum Neural Core Weights',
    category: 'Autonomous AI Model',
    rarity: 'CLASSIFIED',
    description:
      'Private weights and biases for an autonomous recursive trading & reasoning neural network. Verification performed via zero-knowledge inference proofs; bidder receives exclusive encrypted model decryption keys upon settlement.',
    reservePrice: 3200,
    endTime: Date.now() + 5 * 3600 * 1000 + 12 * 60 * 1000,
    itemImage: aiCoreImg,
    specs: [
      { label: 'Architecture', value: 'Transformer-Q 70B' },
      { label: 'Inference Privacy', value: 'Zero-Knowledge ML' },
      { label: 'Target Hash', value: '0x9d4e...f21a' },
      { label: 'Execution', value: 'Enclave / Midnight ZK' },
    ],
  },
  {
    id: 'lot-03',
    title: 'Orbital Mesh Sat-09 Transponder Key',
    category: 'Infrastructure RWA',
    rarity: 'MYTHIC',
    description:
      'Restricted optical mesh encrypted uplink license for orbital low-earth telecommunication satellite relay node 09. Allows private decentralized bandwidth routing verifiable through Midnight zero-knowledge attestation.',
    reservePrice: 4800,
    endTime: Date.now() + 8 * 3600 * 1000 + 30 * 60 * 1000,
    itemImage: meshKeyImg,
    specs: [
      { label: 'Bandwidth Tier', value: '100 Gbps Laser Link' },
      { label: 'Constellation', value: 'Aetheris Mesh-09' },
      { label: 'Auth Token', value: 'ZK-Access Ticket #44' },
      { label: 'Coverage', value: 'Global Equatorial' },
    ],
  },
];

const INITIAL_COMMITMENTS: BidCommitment[] = [
  {
    id: 'c1',
    hash: 'a3f8b2e1d4c7f0a9b8e2d1c4f7a0b3e6d9c2f5a8b1e4d7c0f3a6b9e2d5c8f1a4',
    timestamp: Date.now() - 1800000,
    isMine: false,
    truncatedHash: '0xa3f8b2...f1a4',
  },
  {
    id: 'c2',
    hash: 'b1e4d7c0f3a6b9e2d5c8f1a4b7e0d3c6f9a2b5e8d1c4f7a0b3e6d9c2f5a8b1e4',
    timestamp: Date.now() - 900000,
    isMine: false,
    truncatedHash: '0xb1e4d7...b1e4',
  },
  {
    id: 'c3',
    hash: 'c7f0a9b8e2d1c4f7a0b3e6d9c2f5a8b1e4d7c0f3a6b9e2d5c8f1a4b7e0d3c6f9',
    timestamp: Date.now() - 300000,
    isMine: false,
    truncatedHash: '0xc7f0a9...c6f9',
  },
];

export function useCloakBid() {
  const [lots] = useState<AuctionConfig[]>(AUCTION_LOTS);
  const [selectedLotId, setSelectedLotId] = useState<string>(AUCTION_LOTS[0].id);

  const activeLot = lots.find(l => l.id === selectedLotId) || lots[0];

  const [ledgerState, setLedgerState] = useState<LedgerState>({
    auction_open: true,
    finalized: false,
    reserve_price: activeLot.reservePrice,
    bid_count: 5,
    winner_hash: '',
  });

  const [commitments, setCommitments] = useState<BidCommitment[]>(INITIAL_COMMITMENTS);
  const [circuitStep, setCircuitStep] = useState<CircuitStep>('idle');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [winner, setWinner] = useState<WinnerData | null>(null);
  const [myBidAmount, setMyBidAmount] = useState<number | null>(null);
  const [myBidSalt, setMyBidSalt] = useState<string | null>(null);
  const [myCommitmentHash, setMyCommitmentHash] = useState<string | null>(null);

  const selectLot = useCallback((lotId: string) => {
    const target = lots.find(l => l.id === lotId);
    if (!target) return;
    setSelectedLotId(lotId);
    setLedgerState(prev => ({
      ...prev,
      reserve_price: target.reservePrice,
      finalized: false,
      winner_hash: '',
    }));
    setWinner(null);
  }, [lots]);

  const privacySnapshot: PrivacySnapshot = {
    clientBidAmount: myBidAmount,
    clientBidSalt: myBidSalt,
    publicCommitmentHash: myCommitmentHash,
    adversaryCanSee: [
      'Commitment hash (64-char hex)',
      'Block timestamp of bid submission',
      'Gas fee spent (0.002 tDUST)',
      'Total bid count on ledger',
      'Reserve price threshold',
    ],
    adversaryCannotSee: [
      'Your actual bid amount (hidden in witness)',
      'Your random 256-bit salt value',
      'Your wallet identity (shielded by Midnight ZK)',
      "Losing bidders' amounts (never revealed)",
      'Bid-to-address correlation graph',
    ],
  };

  const commitBid = useCallback(async (amount: number) => {
    if (!ledgerState.auction_open) return;
    if (amount < ledgerState.reserve_price) return;

    const salt = generateSalt();
    const hash = computeCommitmentHash(amount, salt);

    setCircuitStep('reading-witness');
    await sleep(800);
    setCircuitStep('hashing');
    await sleep(900);
    setCircuitStep('proving');
    await sleep(1400);
    setCircuitStep('submitting');
    await sleep(700);

    const newCommitment: BidCommitment = {
      id: `c-${Date.now()}`,
      hash,
      timestamp: Date.now(),
      isMine: true,
      truncatedHash: `0x${hash.slice(0, 6)}...${hash.slice(-4)}`,
    };

    setMyBidAmount(amount);
    setMyBidSalt(salt);
    setMyCommitmentHash(hash);
    setCommitments(prev => [...prev, newCommitment]);
    setLedgerState(prev => ({ ...prev, bid_count: prev.bid_count + 1 }));

    const tx: Transaction = {
      id: generateTxHash(),
      type: 'commit_bid',
      hash: generateTxHash(),
      timestamp: Date.now(),
      status: 'confirmed',
      amount,
      fee: '0.002 tDUST',
    };
    setTransactions(prev => [tx, ...prev]);
    setCircuitStep('confirmed');
    await sleep(2000);
    setCircuitStep('idle');
  }, [ledgerState]);

  const closeBidding = useCallback(async () => {
    setLedgerState(prev => ({ ...prev, auction_open: false }));
    const tx: Transaction = {
      id: generateTxHash(),
      type: 'close_bidding',
      hash: generateTxHash(),
      timestamp: Date.now(),
      status: 'confirmed',
      fee: '0.001 tDUST',
    };
    setTransactions(prev => [tx, ...prev]);
  }, []);

  const finalizeAuction = useCallback(async () => {
    setCircuitStep('proving');
    await sleep(2000);
    setCircuitStep('submitting');
    await sleep(800);

    const winnerCommitment = commitments[Math.floor(Math.random() * commitments.length)];
    const winnerData: WinnerData = {
      address: '0xf4a2...8e31',
      commitmentHash: winnerCommitment?.hash ?? '',
      proofHash: generateTxHash(),
      timestamp: Date.now(),
    };

    setWinner(winnerData);
    setLedgerState(prev => ({
      ...prev,
      finalized: true,
      winner_hash: winnerCommitment?.hash ?? '',
    }));

    const tx: Transaction = {
      id: generateTxHash(),
      type: 'finalize_auction',
      hash: generateTxHash(),
      timestamp: Date.now(),
      status: 'confirmed',
      fee: '0.005 tDUST',
    };
    setTransactions(prev => [tx, ...prev]);
    setCircuitStep('confirmed');
    await sleep(1500);
    setCircuitStep('idle');
  }, [commitments]);

  const initializeAuction = useCallback(async (reservePrice: number) => {
    setLedgerState({
      auction_open: true,
      finalized: false,
      reserve_price: reservePrice,
      bid_count: 0,
      winner_hash: '',
    });
    setCommitments([]);
    setWinner(null);
    setMyBidAmount(null);
    setMyBidSalt(null);
    setMyCommitmentHash(null);
    const tx: Transaction = {
      id: generateTxHash(),
      type: 'initialize',
      hash: generateTxHash(),
      timestamp: Date.now(),
      status: 'confirmed',
      fee: '0.003 tDUST',
    };
    setTransactions(prev => [tx, ...prev]);
  }, []);

  return {
    lots,
    selectedLotId,
    selectLot,
    auctionConfig: activeLot,
    ledgerState,
    commitments,
    circuitStep,
    transactions,
    winner,
    privacySnapshot,
    myCommitmentHash,
    commitBid,
    closeBidding,
    finalizeAuction,
    initializeAuction,
  };
}
