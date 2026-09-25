import React from 'react';
import {
  Lock,
  CheckCircle2,
  User,
  Shield,
} from 'lucide-react';
import type { BidCommitment } from '../types';

interface Props {
  commitments: BidCommitment[];
  myCommitmentHash: string | null;
  myBidAmount: number | null;
}

export const SealedBidCapsules: React.FC<Props> = ({
  commitments,
  myCommitmentHash,
  myBidAmount,
}) => {
  // Mock pre-seeded bidders if empty
  const displayCommitments = commitments.length > 0 ? commitments : [
    {
      id: 'c-1',
      hash: 'a7f3b29c1d0e4f8a6b2c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a',
      timestamp: Date.now() - 45 * 60 * 1000,
      isMine: false,
      truncatedHash: '0xa7f3...5f7a',
    },
    {
      id: 'c-2',
      hash: 'b921d4e6f8a0c2e4a6b8d0e2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2',
      timestamp: Date.now() - 25 * 60 * 1000,
      isMine: false,
      truncatedHash: '0xb921...f0a2',
    },
    {
      id: 'c-3',
      hash: 'c410e2f4a6b8d0e2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2b4d6f8a0',
      timestamp: Date.now() - 10 * 60 * 1000,
      isMine: false,
      truncatedHash: '0xc410...f8a0',
    },
    {
      id: 'c-4',
      hash: 'd883f1a2c4e6b8a0d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8',
      timestamp: Date.now() - 5 * 60 * 1000,
      isMine: false,
      truncatedHash: '0xd883...e6b8',
    },
  ];

  const getBidderLabel = (c: BidCommitment): string => {
    if (c.isMine || c.hash === myCommitmentHash) return 'BIDDER #YOU';
    return `BIDDER #${c.hash.slice(0, 4).toUpperCase()}`;
  };

  return (
    <section id="sealed-bids-section" className="relative py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <p className="text-[11px] font-mono tracking-wider text-vault-purple-light uppercase">
              CONFIDENTIAL POOL
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              SEALED BID PARTICIPANTS
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              All bids are cryptographically sealed. Competitor valuations are never disclosed.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
            <div className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.08]">
              <span>Total Sealed: </span>
              <strong className="text-white">{displayCommitments.length}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>All Validated</span>
            </div>
          </div>
        </div>

        {/* Elegant Compact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {displayCommitments.map((commitment, idx) => {
            const isUserBid = commitment.isMine || commitment.hash === myCommitmentHash;
            const bidderLabel = getBidderLabel(commitment);

            return (
              <div
                key={commitment.id || idx}
                className={`vault-card p-4 transition-all duration-200 ${
                  isUserBid
                    ? 'border-vault-purple/40 bg-vault-purple/5'
                    : 'border-white/[0.06] bg-white/[0.01]'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold ${
                        isUserBid
                          ? 'bg-vault-purple/20 text-vault-purple-light'
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      <User className="w-3 h-3" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-white tracking-wide">
                      {bidderLabel}
                    </span>
                  </div>

                  {isUserBid && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-vault-purple/20 text-vault-purple-light border border-vault-purple/30">
                      YOUR BID
                    </span>
                  )}
                </div>

                {/* Status Badges: SEALED & VALID */}
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.08] text-[10px] font-mono text-slate-300 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-vault-purple-light" />
                    <span>SEALED</span>
                  </span>

                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>✓ VALID</span>
                  </span>
                </div>

                {/* Encrypted Value: ████████ */}
                <div className="p-2.5 rounded bg-midnight-950/80 border border-white/[0.05] flex items-center justify-between font-mono text-xs">
                  <span className="text-slate-400 text-[11px]">Bid Value</span>
                  {isUserBid && myBidAmount ? (
                    <div className="text-right">
                      <span className="text-emerald-400 font-bold">
                        {myBidAmount.toLocaleString()} tDUST
                      </span>
                    </div>
                  ) : (
                    <span className="text-slate-400 tracking-widest text-[11px]">
                      ████████
                    </span>
                  )}
                </div>

                {/* Footer metadata */}
                <div className="mt-2.5 pt-2 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Commitment</span>
                  <span className="truncate max-w-[100px]">{commitment.truncatedHash || '0x' + commitment.hash.slice(0, 8)}...</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
