import React from 'react';
import { Lock, Eye, Shield, Hash, Globe, AlertOctagon } from 'lucide-react';
import type { BidCommitment } from '../types';
import { soundFx } from '../utils/audio';

interface Props {
  commitments: BidCommitment[];
  myCommitmentHash: string | null;
}

export const BidCommitmentVault: React.FC<Props> = ({ commitments, myCommitmentHash }) => {
  const formatTime = (ts: number) => {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className="glass-card-vault p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-vault-purple/10 border border-vault-purple/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-vault-purple" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-white">COMMITMENT VAULT</h2>
            <p className="text-xs font-mono text-slate-400">Public on-chain sealed bid records</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-vault-purple/10 border border-vault-purple/20">
          <Hash className="w-3.5 h-3.5 text-vault-purple" />
          <span className="text-xs font-mono text-vault-purple">{commitments.length} SEALED</span>
        </div>
      </div>

      {/* What adversary sees notice */}
      <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-midnight-900/60 border border-amber-500/20">
        <Eye className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs font-mono text-amber-300/80">
          <span className="text-amber-400 font-semibold">Adversary view:</span> Only commitment hashes are visible.
          Bid amounts, identities, and salts remain cryptographically hidden.
        </p>
      </div>

      {/* Commitment grid */}
      {commitments.length === 0 ? (
        <div className="text-center py-10 space-y-3">
          <Lock className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-slate-500 text-sm">No bids committed yet. Be the first.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {commitments.map((c, idx) => (
            <div
              key={c.id}
              className={`commitment-capsule p-4 transition-all duration-300 hover:scale-[1.01] ${c.isMine ? 'mine' : 'other'}`}
              style={{
                animationDelay: `${idx * 0.1}s`,
              }}
            >
              {/* Shimmer overlay */}
              {c.isMine && (
                <div className="absolute inset-0 holographic rounded-xl" />
              )}

              <div className="relative z-10 flex items-center gap-4">
                {/* Index badge */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold ${
                  c.isMine
                    ? 'bg-auction-gold/20 text-auction-gold border border-auction-gold/30'
                    : 'bg-vault-purple/10 text-vault-purple border border-vault-purple/20'
                }`}>
                  #{idx + 1}
                </div>

                {/* Hash */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <Globe className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      {c.isMine ? 'YOUR COMMITMENT' : 'PUBLIC COMMITMENT'}
                    </span>
                    {c.isMine && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-auction-gold/20 text-auction-gold font-mono">MINE</span>
                    )}
                  </div>
                  <p className={`font-mono text-xs truncate ${c.isMine ? 'text-auction-gold' : 'text-vault-purple-light'}`}>
                    {c.hash}
                  </p>
                </div>

                {/* Time */}
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] font-mono text-slate-600">{formatTime(c.timestamp)}</p>
                  <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] font-mono ${
                    c.isMine ? 'text-auction-gold/60' : 'text-slate-600'
                  }`}>
                    <Lock className="w-2.5 h-2.5" />
                    <span>Sealed</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom note */}
      <div className="flex items-start gap-2 text-[11px] font-mono text-slate-600 pt-2 border-t border-midnight-800">
        <AlertOctagon className="w-3.5 h-3.5 text-slate-700 flex-shrink-0 mt-0.5" />
        <span>
          Hashes are computed as <span className="text-vault-purple">commit(bid_amount ∥ salt)</span> inside the ZK circuit.
          No information about the underlying amounts can be extracted without the secret salt.
        </span>
      </div>
    </div>
  );
};
