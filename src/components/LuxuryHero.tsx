import React, { useState } from 'react';
import {
  Shield,
  Lock,
  ArrowRight,
  ExternalLink,
  X,
  FileCheck,
  CheckCircle2,
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

  // Time progress calculation
  const totalDuration = 12 * 3600 * 1000;
  const elapsed = Math.max(0, totalDuration - countdown.totalMs);
  const progressPercent = Math.min(100, Math.max(8, (elapsed / totalDuration) * 100));

  return (
    <section className="relative pt-8 pb-16 overflow-hidden">
      {/* Soft ambient lighting */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-vault-purple/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-80 h-80 bg-cipher-teal/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Curated Lot Selector Bar */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mr-2 hidden sm:inline">
            Active Auctions:
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
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-white/[0.08] text-white border border-white/20'
                    : 'bg-white/[0.02] text-slate-400 border border-white/[0.06] hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-vault-purple-light' : 'bg-slate-600'}`} />
                <span className="font-medium">{lot.title}</span>
                <span className="text-slate-400 text-[10px]">#{lot.id}</span>
              </button>
            );
          })}
        </div>

        {/* Hero Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Typography, Countdown, Actions */}
          <div className="lg:col-span-6 space-y-6 text-left">
            {/* Status Pills */}
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono tracking-wider text-slate-300 uppercase">
                CONFIDENTIAL AUCTION
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>BIDDING OPEN</span>
              </span>
            </div>

            {/* Main Title & Tagline */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]">
                {activeLot.title}
              </h1>
              <p className="mt-2.5 text-base sm:text-lg text-slate-300 font-light">
                Private bids. Verifiable outcomes.
              </p>
              <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
                {activeLot.description}
              </p>
            </div>

            {/* Countdown & Auction Progress */}
            <div className="vault-card p-4 sm:p-5 border-white/[0.08] max-w-lg">
              <div className="flex items-end justify-between mb-3">
                <div>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider">
                    {countdown.hours.toString().padStart(2, '0')}:
                    {countdown.minutes.toString().padStart(2, '0')}:
                    {countdown.seconds.toString().padStart(2, '0')}
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 tracking-wider uppercase mt-0.5">
                    BIDDING REMAINING
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-base sm:text-lg font-mono font-bold text-auction-gold">
                    {activeLot.reservePrice.toLocaleString()} tDUST
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 tracking-wider uppercase mt-0.5">
                    RESERVE PRICE
                  </p>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="w-full bg-midnight-950 rounded-full h-1.5 overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-vault-purple via-cipher-teal to-vault-purple-light transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Active Bids: <strong className="text-slate-200">{ledgerState.bid_count}</strong></span>
                <span className="flex items-center gap-1 text-slate-300">
                  <Shield className="w-3 h-3 text-vault-purple-light" />
                  Dual-State Sealed
                </span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              {/* Primary CTA (Visually Dominant) */}
              <button
                onClick={() => {
                  soundFx.playClick();
                  onPlaceBidClick();
                }}
                className="btn-vault-primary !py-3 !px-7 text-sm font-semibold tracking-wide"
              >
                <Lock className="w-4 h-4" />
                <span>PLACE SEALED BID</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              {/* Secondary CTA */}
              <button
                onClick={() => {
                  soundFx.playClick();
                  setDetailsModalOpen(true);
                }}
                className="btn-vault-secondary !py-3 !px-6 text-sm"
              >
                <span>VIEW DETAILS</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual (The Signature 3D Cloak Vault) */}
          <div className="lg:col-span-6 flex justify-center">
            <CryptographicVault3D
              isProving={isProving}
              bidPlaced={bidPlaced}
              myBidAmount={myBidAmount}
            />
          </div>
        </div>
      </div>

      {/* Lot Details Modal */}
      {detailsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg vault-card p-6 border-white/15 bg-midnight-950/95 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-vault-purple-light" />
                <h3 className="font-semibold text-base text-white">
                  Auction Specifications
                </h3>
              </div>
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="w-7 h-7 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded bg-midnight-900 border border-white/5">
                <span className="text-slate-400">Asset Title</span>
                <span className="text-white font-medium">{activeLot.title}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-midnight-900 border border-white/5">
                <span className="text-slate-400">Lot Identifier</span>
                <span className="text-slate-300">LOT-{activeLot.id}</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-midnight-900 border border-white/5">
                <span className="text-slate-400">Reserve Price</span>
                <span className="text-auction-gold font-bold">{activeLot.reservePrice.toLocaleString()} tDUST</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-midnight-900 border border-white/5">
                <span className="text-slate-400">Privacy Circuit</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Compact PLONK v2
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-midnight-900 border border-white/5">
                <span className="text-slate-400">Settlement Network</span>
                <span className="text-slate-200">Midnight Preprod Testnet</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              All bids placed in this auction are cryptographically blinded with 256-bit entropy. Only the winning bid commitment is posted on-chain during settlement; losing bids remain confidential forever.
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setDetailsModalOpen(false)}
                className="btn-vault-secondary text-xs !py-2 !px-4"
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
