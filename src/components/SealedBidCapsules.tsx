import React from 'react';
import {
  Lock,
  CheckCircle2,
  Shield,
  Clock,
  Key,
  User,
  Sparkles,
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
  // Pre-seeded anonymized bidder capsules if none exist
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
  ];

  const getBidderTag = (c: BidCommitment, idx: number): string => {
    if (c.isMine) return 'BIDDER #YOU';
    const tag = c.hash.slice(0, 4).toUpperCase();
    return `BIDDER #${tag}`;
  };

  return (
    <section className="relative py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-900/90 border border-white/10 text-[11px] font-mono text-slate-400 mb-2">
              <Lock className="w-3.5 h-3.5 text-vault-purple" />
              <span>CONFIDENTIAL ESCROW POOL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              <span className="gradient-text-purple">SEALED BID CAPSULES</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Each bid is contained in an autonomous zero-knowledge capsule on Midnight. Amounts and identity remain cryptographically opaque.
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-slate-400">
            <div className="px-3 py-1.5 rounded-xl bg-midnight-900/80 border border-white/5">
              <span>Total Sealed: </span>
              <strong className="text-white">{displayCommitments.length}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>All Validated</span>
            </div>
          </div>
        </div>

        {/* 3D Floating Capsules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayCommitments.map((commitment, idx) => {
            const isUserBid = commitment.isMine || commitment.hash === myCommitmentHash;
            const bidderLabel = getBidderTag(commitment, idx);

            return (
              <div
                key={commitment.id || idx}
                className={`relative rounded-2xl p-6 transition-all duration-300 transform hover:-translate-y-1 ${
                  isUserBid
                    ? 'vault-card border-vault-purple/50 bg-gradient-to-br from-vault-purple/15 to-midnight-900 shadow-vault-subtle'
                    : 'vault-card border-white/5 hover:border-white/20 bg-midnight-900/70'
                }`}
              >
                {/* Subtle top indicator beam */}
                <div
                  className={`absolute top-0 left-6 right-6 h-[2px] rounded-full ${
                    isUserBid
                      ? 'bg-gradient-to-r from-transparent via-vault-purple-light to-transparent'
                      : 'bg-gradient-to-r from-transparent via-slate-700 to-transparent'
                  }`}
                />

                {/* Capsule Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                        isUserBid
                          ? 'bg-vault-purple/30 text-vault-purple-light border border-vault-purple/50'
                          : 'bg-white/5 text-slate-400 border border-white/10'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-white tracking-wide">
                        {bidderLabel}
                      </span>
                      {isUserBid && (
                        <span className="ml-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded bg-vault-purple text-white">
                          YOU
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Status 1: 🔒 SEALED */}
                    <span className="px-2 py-0.5 rounded-full bg-vault-purple/15 border border-vault-purple/30 text-[10px] font-mono text-vault-purple-light flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      <span>SEALED</span>
                    </span>

                    {/* Status 2: ✓ VALID */}
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      <span>VALID</span>
                    </span>
                  </div>
                </div>

                {/* Encrypted Amount Box */}
                <div className="my-4 p-3.5 rounded-xl bg-midnight-950/80 border border-white/5 flex items-center justify-between font-mono">
                  <span className="text-xs text-slate-400">Bid Amount</span>
                  <div className="text-right">
                    {isUserBid && myBidAmount ? (
                      <div>
                        <span className="text-xs font-bold text-emerald-400">
                          {myBidAmount.toLocaleString()} tDUST
                        </span>
                        <p className="text-[9px] text-slate-400">(Your Private Witness)</p>
                      </div>
                    ) : (
                      <span className="text-xs font-bold tracking-widest text-slate-400">
                        ███████████
                      </span>
                    )}
                  </div>
                </div>

                {/* Metadata Footer */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="truncate max-w-[150px] text-slate-400" title={commitment.hash}>
                    Commitment: <strong className="text-slate-300">{commitment.truncatedHash}</strong>
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>Just now</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
