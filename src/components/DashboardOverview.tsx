import React, { useState } from 'react';
import {
  Lock,
  ArrowRight,
  Shield,
  Clock,
  Users,
  CheckCircle2,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import type { AuctionConfig, LedgerState } from '../types';
import { soundFx } from '../utils/audio';

interface Props {
  lots: AuctionConfig[];
  selectedLotId: string;
  onSelectAuction: (lotId: string) => void;
  ledgerState: LedgerState;
  myCommitmentHash: string | null;
}

export const DashboardOverview: React.FC<Props> = ({
  lots,
  selectedLotId,
  onSelectAuction,
  ledgerState,
  myCommitmentHash,
}) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredLots = lots.filter(lot => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'crypto') return lot.category.toLowerCase().includes('cryptographic');
    if (activeFilter === 'ai') return lot.category.toLowerCase().includes('ai');
    if (activeFilter === 'rwa') return lot.category.toLowerCase().includes('infrastructure') || lot.category.toLowerCase().includes('rwa');
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ── Top Greeting & Title ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Welcome back
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Your Auction Overview & Confidential Portfolios on Midnight
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Consensus State:</span>
          <span className="badge-live font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Midnight Preview Active
          </span>
        </div>
      </div>

      {/* ── Section 7: Four Compact Metrics Cards ───────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: ACTIVE AUCTIONS */}
        <div className="surface-card p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>ACTIVE AUCTIONS</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-mono font-bold text-white tracking-tight">
            03
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            All running under ZK dual-state
          </p>
        </div>

        {/* Metric 2: TOTAL BIDS */}
        <div className="surface-card p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>TOTAL BIDS</span>
            <Users className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-mono font-bold text-white tracking-tight">
            128
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {ledgerState.bid_count} sealed in current round
          </p>
        </div>

        {/* Metric 3: SEALED VALUE */}
        <div className="surface-card p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>SEALED VALUE</span>
            <Lock className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-mono font-bold text-purple-300 tracking-wider">
            PRIVATE
          </div>
          <p className="mt-1 text-[11px] text-slate-400 font-mono">
            ████████████ (Opaque Witness)
          </p>
        </div>

        {/* Metric 4: SETTLED */}
        <div className="surface-card p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>SETTLED</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-mono font-bold text-white tracking-tight">
            24
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            100% verified without disclosures
          </p>
        </div>
      </div>

      {/* ── Section 8: Live Confidential Auctions Grid ─────────────────── */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-white/[0.06]">
          <div>
            <h2 className="text-base font-semibold text-white">
              Live Confidential Auctions
            </h2>
            <p className="text-xs text-slate-400">
              Select an auction to inspect rules, view verification parameters, or place a sealed bid.
            </p>
          </div>

          {/* Clean category filter tabs */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-white/5 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeFilter === 'all'
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Lots
            </button>
            <button
              onClick={() => setActiveFilter('crypto')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeFilter === 'crypto'
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Artifacts
            </button>
            <button
              onClick={() => setActiveFilter('ai')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeFilter === 'ai'
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              AI Models
            </button>
            <button
              onClick={() => setActiveFilter('rwa')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeFilter === 'rwa'
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              RWAs
            </button>
          </div>
        </div>

        {/* Auction Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredLots.map((lot, idx) => {
            const isSelected = lot.id === selectedLotId;
            const hasUserBid = isSelected && !!myCommitmentHash;
            const bidderCount = idx === 0 ? 24 : idx === 1 ? 18 : 31;
            const timeRemaining = idx === 0 ? '02:29:58 remaining' : idx === 1 ? '05:12:00 remaining' : '08:30:00 remaining';

            return (
              <div
                key={lot.id}
                className="surface-card surface-card-hover p-5 flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header: Category & Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-mono text-slate-400">
                      Auction #{lot.id.replace('lot-', '00')}
                    </span>
                    <span className="badge-live">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      LIVE
                    </span>
                  </div>

                  {/* Lot Image Preview (Restrained, Editorial) */}
                  <div className="w-full h-36 rounded-lg overflow-hidden bg-slate-900 border border-white/[0.06] mb-3.5 relative">
                    <img
                      src={lot.itemImage}
                      alt={lot.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-slate-300">
                      <span>Reserve</span>
                      <span className="text-white font-semibold">
                        {lot.reservePrice.toLocaleString()} tDUST
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-semibold text-sm text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                    {lot.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {lot.description}
                  </p>
                </div>

                {/* Card Footer: Metadata & Action */}
                <div className="mt-4 pt-3.5 border-t border-white/[0.06] space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{timeRemaining}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-300">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{bidderCount} bidders</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="text-xs">
                      <span className="text-slate-400 text-[11px]">Your bid: </span>
                      {hasUserBid ? (
                        <span className="badge-sealed text-[10px]">
                          <Lock className="w-2.5 h-2.5" />
                          SEALED
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs font-mono">—</span>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        soundFx.playClick();
                        onSelectAuction(lot.id);
                      }}
                      className="btn-secondary !py-1.5 !px-3 text-xs"
                    >
                      <span>View Auction</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
