import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Clock,
  ArrowRight,
  Info,
  ChevronRight,
  FileCheck,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink,
  X,
} from 'lucide-react';
import type { AuctionConfig, LedgerState } from '../types';
import { useCountdown } from '../hooks/useCountdown';
import { CryptographicVault3D } from './CryptographicVault3D';
import { soundFx } from '../utils/audio';

interface Props {
  lots: AuctionConfig[];
  selectedLotId: string;
  onSelectLot: (lotId: string) => void;
  ledgerState: LedgerState;
  onPlaceBidClick: () => void;
  isProving?: boolean;
  bidPlaced?: boolean;
  myBidAmount?: number | null;
}

export const LuxuryHero: React.FC<Props> = ({
  lots,
  selectedLotId,
  onSelectLot,
  ledgerState,
  onPlaceBidClick,
  isProving = false,
  bidPlaced = false,
  myBidAmount = null,
}) => {
  const activeLot = lots.find(l => l.id === selectedLotId) || lots[0];
  const countdown = useCountdown(activeLot.endTime);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  // Time progress calculation (assuming 12 hour cycle)
  const totalDuration = 12 * 3600 * 1000;
  const elapsed = Math.max(0, totalDuration - countdown.totalMs);
  const progressPercent = Math.min(100, Math.max(5, (elapsed / totalDuration) * 100));

  return (
    <section className="relative pt-12 pb-20 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-vault-purple/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cipher-teal/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Curated Lot Selector Pills */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mr-2 hidden sm:inline">
            Active Vaults:
          </span>
          {lots.map(lot => {
            const isSelected = lot.id === selectedLotId;
            return (
              <button
                key={lot.id}
                onClick={() => {
                  soundFx.playClick();
                  onSelectLot(lot.id);
                }}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-mono transition-all duration-200 whitespace-nowrap ${
                  isSelected
                    ? 'bg-vault-purple/20 text-white border border-vault-purple/50 shadow-sm'
                    : 'bg-midnight-900/60 text-slate-400 border border-white/5 hover:text-slate-200 hover:bg-midnight-850'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-vault-purple-light animate-pulse' : 'bg-slate-600'}`} />
                <span className="font-medium">{lot.title.split(' ')[0]}</span>
                <span className="text-slate-400 font-sans text-[11px]">#{lot.id}</span>
              </button>
            );
          })}
        </div>

        {/* Hero Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typography, Countdown, CTAs */}
          <div className="lg:col-span-6 space-y-8 text-left">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-midnight-900/90 border border-vault-purple/30 backdrop-blur-md">
              <span className="text-[11px] font-mono tracking-widest text-vault-purple-light uppercase">
                CONFIDENTIAL AUCTION
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-600" />
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>BIDDING OPEN</span>
              </div>
            </div>

            {/* Main Title & Tagline */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                <span className="gradient-text-purple">{activeLot.title}</span>
              </h1>
              <p className="mt-4 text-lg sm:text-xl font-light text-slate-300 italic tracking-wide">
                “Private bids. Verifiable outcomes.”
              </p>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed max-w-xl">
                {activeLot.description}
              </p>
            </div>

            {/* Countdown Clock & Linear Progress Indicator */}
            <div className="vault-card p-5 max-w-lg border-white/10">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <p className="text-[11px] font-mono text-slate-400 tracking-wider uppercase">
                    TIME REMAINING
                  </p>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider mt-0.5">
                    {countdown.hours.toString().padStart(2, '0')}:
                    {countdown.minutes.toString().padStart(2, '0')}:
                    {countdown.seconds.toString().padStart(2, '0')}
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[11px] font-mono text-slate-400 tracking-wider uppercase">
                    RESERVE PRICE
                  </p>
                  <p className="text-lg font-mono font-bold text-auction-gold">
                    {activeLot.reservePrice.toLocaleString()} tDUST
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-midnight-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-vault-purple via-cipher-teal to-vault-purple-light transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Total Bids Placed: <strong className="text-slate-200">{ledgerState.bid_count}</strong></span>
                <span>Midnight ZK Sealed</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  onPlaceBidClick();
                }}
                className="btn-vault-primary text-sm !py-3.5 !px-8 shadow-vault-glow"
              >
                <Lock className="w-4 h-4 text-white" />
                <span>PLACE SEALED BID</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setDetailsModalOpen(true);
                }}
                className="btn-vault-secondary text-sm !py-3.5 !px-6"
              >
                <Info className="w-4 h-4 text-slate-400" />
                <span>VIEW AUCTION DETAILS</span>
              </button>
            </div>
          </div>

          {/* Right Column: Flagship 3D Cryptographic Vault */}
          <div className="lg:col-span-6 flex items-center justify-center">
            <div className="relative w-full max-w-[480px]">
              {/* Vault Canvas Frame */}
              <CryptographicVault3D
                isProving={isProving}
                bidPlaced={bidPlaced}
                myBidAmount={myBidAmount}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lot Details Modal */}
      {detailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl vault-card p-6 sm:p-8 space-y-6 border-vault-purple/30 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-vault-purple" />
                <h3 className="font-display font-bold text-lg text-white">
                  {activeLot.title}
                </h3>
              </div>
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {activeLot.description}
            </p>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              {activeLot.specs.map((spec, i) => (
                <div key={i} className="p-3 rounded-xl bg-midnight-900/80 border border-white/5">
                  <p className="text-[11px] font-mono text-slate-400">{spec.label}</p>
                  <p className="text-sm font-mono font-semibold text-slate-200 mt-0.5">{spec.value}</p>
                </div>
              ))}
            </div>

            {/* Cryptographic Guarantees */}
            <div className="p-4 rounded-xl bg-vault-purple/10 border border-vault-purple/20 space-y-2">
              <p className="text-xs font-mono font-semibold text-vault-purple-light flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-vault-purple" />
                MIDNIGHT DUAL-STATE VERIFICATION
              </p>
              <p className="text-xs text-slate-300 leading-relaxed">
                All bids are committed off-chain inside your browser using zero-knowledge witness generation. Only the commitment hash and validity proof touch the Midnight Preprod ledger.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <a
                href="https://explorer.midnight.network/contract/mn1q7xk4p9dv2w5r8nj3ht6ys0cqzfa1e8mbgluiop"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono text-cipher-teal hover:underline flex items-center gap-1"
              >
                <span>Contract: mn1q7xk...uiop</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => setDetailsModalOpen(false)}
                className="btn-vault-primary text-xs !py-2 !px-5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
