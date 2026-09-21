// ============================================================
// CloakBid — Type Definitions
// ============================================================

export type AuctionPhase = 'deploy' | 'bidding' | 'closed' | 'finalized' | 'settled';

export type CircuitStep =
  | 'idle'
  | 'reading-witness'
  | 'hashing'
  | 'proving'
  | 'submitting'
  | 'confirmed'
  | 'error';

export interface LedgerState {
  auction_open: boolean;
  finalized: boolean;
  reserve_price: number;
  bid_count: number;
  winner_hash: string;
}

export interface BidCommitment {
  id: string;
  hash: string;
  timestamp: number;
  isMine: boolean;
  truncatedHash: string;
}

export interface WalletState {
  connected: boolean;
  address: string;
  balance: string;
  network: string;
}

export interface Transaction {
  id: string;
  type: 'commit_bid' | 'close_bidding' | 'finalize_auction' | 'initialize' | 'reset_auction';
  hash: string;
  timestamp: number;
  status: 'pending' | 'confirmed' | 'failed';
  amount?: number;
  fee: string;
}

export interface WinnerData {
  address: string;
  commitmentHash: string;
  proofHash: string;
  timestamp: number;
}

export interface PrivacySnapshot {
  clientBidAmount: number | null;
  clientBidSalt: string | null;
  publicCommitmentHash: string | null;
  adversaryCanSee: string[];
  adversaryCannotSee: string[];
}

export interface AuctionConfig {
  id: string;
  title: string;
  category: string;
  rarity: 'MYTHIC' | 'CLASSIFIED' | 'GENESIS';
  description: string;
  reservePrice: number;
  endTime: number;
  itemImage: string;
  specs: { label: string; value: string }[];
}

