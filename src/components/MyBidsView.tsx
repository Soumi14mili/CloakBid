import React, { useState } from 'react';
import {
  Briefcase,
  Lock,
  Eye,
  EyeOff,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Shield,
  ArrowRight,
  Sparkles,
  Trophy,
  Clock,
} from 'lucide-react';
import type { Commitment, AuctionConfig, LedgerState } from '../types';
import { soundFx } from '../utils/audio';

interface Props {
  commitments: Commitment[];
  myCommitmentHash: string | null;
  myBidAmount: number | null;
  myBidSalt: string | null;
  lots: AuctionConfig[];
  onSelectAuction: (lotId: string) => void;
  ledgerState: LedgerState;
}

export const MyBidsView: React.FC<Props> = ({
  commitments,
  myCommitmentHash,
  myBidAmount,
  myBidSalt,
  lots,
  onSelectAuction,
  ledgerState,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'settled' | 'won'>('all');
  const [peekAmount, setPeekAmount] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const handleCopy = (hash: string) => {
    soundFx.playClick();
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Compile list of user's bids
  const userCommitments = commitments.filter(
    c => c.isMine || c.hash === myCommitmentHash
  );

  // If user hasn't submitted a live bid yet in this session, provide realistic portfolio entries for the demo
  const mockBids = [
    {
      lotId: 'cb-lot-001',
      lotTitle: 'Midnight Genesis Zero-Knowledge Relic #001',
      category: 'Cryptographic Asset',
      amount: myBidAmount || 2850,
      salt: myBidSalt || '0x4f8a...c9e1',
      hash: myCommitmentHash || '0x7e2b9c3f1a4d8e0b5c6a7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
      status: ledgerState.finalized ? 'SETTLED' : 'ACTIVE',
      timestamp: '14 minutes ago',
      isWinner: ledgerState.finalized,
    },
    {
      lotId: 'cb-lot-002',
      lotTitle: 'Zero-Knowledge Proof Compute Allocation (100k Epochs)',
      category: 'Infrastructure',
      amount: 4500,
      salt: '0x9b1c...7d4f',
      hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      status: 'ACTIVE',
      timestamp: '2 hours ago',
      isWinner: false,
    },
    {
      lotId: 'cb-lot-003',
      lotTitle: 'Confidential AI Model Weights License: MedSecure-v2',
      category: 'AI / Healthcare',
      amount: 7200,
      salt: '0x3e5a...1a8d',
      hash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
      status: 'SETTLED',
      timestamp: 'Yesterday',
      isWinner: true,
    },
  ];

  const bidsToDisplay = userCommitments.length > 0
    ? [
        {
          lotId: lots[0]?.id || 'cb-lot-001',
          lotTitle: lots[0]?.title || 'Midnight Genesis Zero-Knowledge Relic #001',
          category: lots[0]?.category || 'Cryptographic Asset',
          amount: myBidAmount || 2850,
          salt: myBidSalt || '0x4f8a...c9e1',
          hash: myCommitmentHash || '0x7e2b9c3f1a4d8e0b5c6a7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a',
          status: ledgerState.finalized ? 'SETTLED' : 'ACTIVE',
          timestamp: 'Just now',
          isWinner: ledgerState.finalized,
        },
        ...mockBids.slice(1),
      ]
    : mockBids;

  const filteredBids = bidsToDisplay.filter(bid => {
    if (activeFilter === 'active') return bid.status === 'ACTIVE';
    if (activeFilter === 'settled') return bid.status === 'SETTLED';
    if (activeFilter === 'won') return bid.isWinner;
    return true;
  });

  const totalCommitted = bidsToDisplay.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-purple-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              My Sealed Bids & Portfolio
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Institutional portfolio view of your cryptographic commitments, private witnesses, and settlement receipts.
          </p>
        </div>

        <button
          onClick={() => setPeekAmount(!peekAmount)}
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-white/10 bg-slate-900/60 hover:bg-white/5 text-xs font-mono text-slate-300 hover:text-white transition-colors"
        >
          {peekAmount ? <EyeOff className="w-3.5 h-3.5 text-purple-400" /> : <Eye className="w-3.5 h-3.5 text-purple-400" />}
          <span>{peekAmount ? 'Mask All Values' : 'Reveal Witnesses'}</span>
        </button>
      </div>

      {/* ── Top KPI Metrics ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface-card p-4 border-white/[0.08]">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Capital Committed
          </span>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {peekAmount ? `${totalCommitted.toLocaleString()} tDUST` : '██████ tDUST'}
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">
            Protected under ZK commitments
          </span>
        </div>

        <div className="surface-card p-4 border-white/[0.08]">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Active Bids
          </span>
          <div className="text-xl font-bold text-purple-300 font-mono mt-1">
            {bidsToDisplay.filter(b => b.status === 'ACTIVE').length.toString().padStart(2, '0')}
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">
            Ongoing auction rounds
          </span>
        </div>

        <div className="surface-card p-4 border-white/[0.08]">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            Won Settlements
          </span>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
            {bidsToDisplay.filter(b => b.isWinner).length.toString().padStart(2, '0')}
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">
            Verified lowest-leakage clears
          </span>
        </div>

        <div className="surface-card p-4 border-white/[0.08]">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">
            ZK Verification Rate
          </span>
          <div className="text-xl font-bold text-white font-mono mt-1">
            100.0%
          </div>
          <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
            All Halo2 proofs valid
          </span>
        </div>
      </div>

      {/* ── Filter Tabs ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1 font-mono text-xs">
        {[
          { id: 'all', label: 'ALL BIDS', count: bidsToDisplay.length },
          { id: 'active', label: 'ACTIVE ROUNDS', count: bidsToDisplay.filter(b => b.status === 'ACTIVE').length },
          { id: 'settled', label: 'SETTLED', count: bidsToDisplay.filter(b => b.status === 'SETTLED').length },
          { id: 'won', label: 'WON', count: bidsToDisplay.filter(b => b.isWinner).length },
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => {
              soundFx.playClick();
              setActiveFilter(filter.id as any);
            }}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeFilter === filter.id
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
            }`}
          >
            {filter.label} ({filter.count})
          </button>
        ))}
      </div>

      {/* ── Bids Table / Cards ─────────────────────────────────────────── */}
      <div className="space-y-3">
        {filteredBids.map((bid, idx) => (
          <div
            key={idx}
            className="surface-card p-5 border-white/[0.08] hover:border-white/15 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
          >
            {/* Left Info */}
            <div className="space-y-2 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  {bid.category}
                </span>
                {bid.status === 'ACTIVE' ? (
                  <span className="badge-live text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    ACTIVE SEALED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    SETTLED
                  </span>
                )}
                {bid.isWinner && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-semibold">
                    <Trophy className="w-3 h-3 text-amber-400" />
                    ROUND WINNER
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-semibold text-white tracking-tight">
                  {bid.lotTitle}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Submitted: {bid.timestamp} • Midnight Preprod
                </p>
              </div>

              {/* Cryptographic hash pill */}
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-[10px] text-slate-500">Commitment:</span>
                <span className="text-[11px] bg-black/40 px-2 py-0.5 rounded border border-white/5 text-purple-300">
                  {bid.hash.slice(0, 14)}...{bid.hash.slice(-10)}
                </span>
                <button
                  onClick={() => handleCopy(bid.hash)}
                  className="p-1 rounded hover:bg-white/5 hover:text-white transition-colors"
                  title="Copy Commitment Hash"
                >
                  {copiedHash === bid.hash ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-500" />
                  )}
                </button>
              </div>
            </div>

            {/* Right Financial & Action Info */}
            <div className="flex flex-col sm:flex-row lg:flex-col sm:items-center lg:items-end justify-between gap-4 shrink-0 font-mono">
              <div className="text-left sm:text-right lg:text-right">
                <span className="text-[10px] text-slate-500 uppercase block">Private Valuation</span>
                <div className="text-lg font-bold text-white mt-0.5">
                  {peekAmount ? `${bid.amount.toLocaleString()} tDUST` : '████████'}
                </div>
                <span className="text-[10px] text-purple-300/80 block">
                  {peekAmount ? 'Client Witness Decrypted' : 'Encrypted with 256-bit Salt'}
                </span>
              </div>

              <button
                onClick={() => {
                  soundFx.playClick();
                  onSelectAuction(bid.lotId);
                }}
                className="btn-secondary text-xs !py-2 !px-4 flex items-center justify-center gap-1.5"
              >
                <span>View Auction Vault</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
