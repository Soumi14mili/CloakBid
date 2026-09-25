import React, { useState } from 'react';
import {
  Lock,
  Globe,
  Cpu,
  Eye,
  EyeOff,
  CheckCircle2,
  Shield,
  Layers,
} from 'lucide-react';
import type { LedgerState } from '../types';

interface Props {
  ledgerState: LedgerState;
  myBidAmount: number | null;
  myBidSalt: string | null;
  auctionId: string;
}

export const PrivacyExplanation: React.FC<Props> = ({
  ledgerState,
  myBidAmount,
  myBidSalt,
  auctionId,
}) => {
  const [peek, setPeek] = useState(false);

  return (
    <div className="surface-card p-6 border-white/[0.08] space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-4">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            WHAT STAYS PRIVATE
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            How Midnight separates client-side witness valuation from public consensus.
          </p>
        </div>

        {myBidAmount && (
          <button
            onClick={() => setPeek(!peek)}
            className="self-start sm:self-auto flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors"
          >
            {peek ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{peek ? 'Mask Values' : 'Peek Your Witness'}</span>
          </button>
        )}
      </div>

      {/* Two-Column Privacy Architecture Grid with Central ZK Verification */}
      <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
        {/* LEFT COLUMN: PRIVATE */}
        <div className="lg:col-span-5 surface-sub p-5 space-y-3.5 border-purple-500/20 bg-slate-950/60">
          <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              <span className="font-mono text-xs font-semibold text-white tracking-wide">
                PRIVATE
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">Client Memory Only</span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-white/5">
              <span className="text-slate-400">Bid amount</span>
              <span className="text-purple-300 font-semibold tracking-wider">
                {peek && myBidAmount ? `${myBidAmount.toLocaleString()} tDUST` : '████████'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-white/5">
              <span className="text-slate-400">Secret</span>
              <span className="text-purple-300 font-semibold tracking-wider">
                {peek && myBidSalt ? `${myBidSalt.slice(0, 8)}...` : '████████'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-white/5">
              <span className="text-slate-400">Private balance</span>
              <span className="text-purple-300 font-semibold tracking-wider">
                ████████
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-1">
            Stored exclusively in your local enclave. Destroyed after proof synthesis.
          </p>
        </div>

        {/* CENTER: ZERO-KNOWLEDGE VERIFICATION */}
        <div className="lg:col-span-1 flex flex-col items-center justify-center py-2 lg:py-0">
          <div className="flex flex-col items-center gap-1.5 text-center">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-purple-400 shadow-sm">
              <Cpu className="w-4 h-4" />
            </div>
            <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 font-bold max-w-[70px] leading-tight">
              ZERO-KNOWLEDGE VERIFICATION
            </span>
          </div>
        </div>

        {/* RIGHT COLUMN: PUBLIC */}
        <div className="lg:col-span-5 surface-sub p-5 space-y-3.5 border-white/[0.08] bg-slate-950/60">
          <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-xs font-semibold text-white tracking-wide">
                PUBLIC
              </span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">On-Chain Ledger</span>
          </div>

          <div className="space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-white/5">
              <span className="text-slate-400">Auction ID</span>
              <span className="text-white font-medium">#{auctionId}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-white/5">
              <span className="text-slate-400">Deadline</span>
              <span className="text-white font-medium">Block #1,245,920</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-white/5">
              <span className="text-slate-400">Proof status</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                VERIFIED
              </span>
            </div>

            <div className="flex items-center justify-between p-2 rounded bg-slate-900/80 border border-white/5">
              <span className="text-slate-400">Auction status</span>
              <span className="text-white font-medium">
                {ledgerState.auction_open ? 'OPEN' : 'CLOSED'}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 pt-1">
            Visible to all Midnight network nodes for mathematical consensus.
          </p>
        </div>
      </div>
    </div>
  );
};
