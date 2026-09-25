import React, { useState } from 'react';
import {
  ArrowLeft,
  Clock,
  Shield,
  Lock,
  Layers,
  Users,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Code2,
} from 'lucide-react';
import type {
  AuctionConfig,
  LedgerState,
  CircuitStep,
  Commitment,
  WinnerResult,
  WalletState,
} from '../types';
import { useCountdown } from '../hooks/useCountdown';
import { BiddingPanel } from './BiddingPanel';
import { PrivacyExplanation } from './PrivacyExplanation';
import { ParticipantsTable } from './ParticipantsTable';
import { SecurityComparison } from './SecurityComparison';
import { AuctionResult } from './AuctionResult';
import { TechnicalDetails } from './TechnicalDetails';
import { soundFx } from '../utils/audio';

interface Props {
  lot: AuctionConfig;
  onBack: () => void;
  ledgerState: LedgerState;
  circuitStep: CircuitStep;
  commitments: Commitment[];
  winner: WinnerResult | null;
  privacySnapshot: {
    clientBidAmount: number | null;
    clientBidSalt: string | null;
  };
  myCommitmentHash: string | null;
  wallet: WalletState;
  onCommitBid: (amount: number) => Promise<void>;
  onConnectWallet: () => void;
  onCloseBidding: () => Promise<void>;
  onFinalizeAuction: () => Promise<void>;
  onResetAuction: () => Promise<void>;
}

export const AuctionDetail: React.FC<Props> = ({
  lot,
  onBack,
  ledgerState,
  circuitStep,
  commitments,
  winner,
  privacySnapshot,
  myCommitmentHash,
  wallet,
  onCommitBid,
  onConnectWallet,
  onCloseBidding,
  onFinalizeAuction,
  onResetAuction,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    'privacy' | 'participants' | 'security' | 'settlement' | 'technical'
  >('privacy');

  const { hours, minutes, seconds, expired } = useCountdown(lot.endTime);
  const formatted = `${hours}:${minutes}:${seconds}`;
  const isEnded = expired;

  const subTabs = [
    { id: 'privacy', label: 'Privacy Architecture', icon: Lock },
    { id: 'participants', label: 'Sealed Participants', icon: Users, badge: commitments.length },
    { id: 'security', label: 'Security Comparison', icon: Shield },
    { id: 'settlement', label: 'Settlement & Reveal', icon: FileCheck2 },
    { id: 'technical', label: 'Technical Specs', icon: Code2 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ── Back Navigation & Status Bar ───────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <button
          onClick={() => {
            soundFx.playClick();
            onBack();
          }}
          className="self-start inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Auctions</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-400">Network Consensus:</span>
          <span className="badge-live text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Midnight Preview
          </span>
        </div>
      </div>

      {/* ── Auction Main Banner / Metadata Header ─────────────────────── */}
      <div className="surface-card p-6 border-white/[0.08] relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                {lot.category}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/10">
                Lot ID: {lot.id}
              </span>
              <span className="badge-live text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {ledgerState.finalized ? 'SETTLED' : 'ACTIVE SEALED-BID'}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                {lot.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                {lot.description}
              </p>
            </div>
          </div>

          {/* Quick Metrics Capsule */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs shrink-0">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-white/[0.06]">
              <span className="text-[10px] text-slate-500 block uppercase">Reserve Price</span>
              <span className="text-sm font-semibold text-white mt-0.5 block">
                {lot.reservePrice.toLocaleString()} tDUST
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-white/[0.06]">
              <span className="text-[10px] text-slate-500 block uppercase">Sealed Bids</span>
              <span className="text-sm font-semibold text-purple-300 mt-0.5 block">
                {commitments.length} Active
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-950/60 border border-white/[0.06] col-span-2 sm:col-span-1">
              <span className="text-[10px] text-slate-500 block uppercase">Time Remaining</span>
              <span className="text-sm font-semibold text-amber-400 mt-0.5 block">
                {isEnded ? '00:00:00 (Ended)' : formatted}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-Column Main Content Flow ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Detailed Navigation Tabs & Tab Content */}
        <div className="lg:col-span-7 space-y-6">
          {/* Subtabs bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-white/[0.08]">
            {subTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveSubTab(tab.id as any);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg transition-all shrink-0 ${
                    isActive
                      ? 'bg-white/10 text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-slate-300">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel */}
          <div>
            {activeSubTab === 'privacy' && (
              <PrivacyExplanation
                ledgerState={ledgerState}
                myBidAmount={privacySnapshot.clientBidAmount}
                myBidSalt={privacySnapshot.clientBidSalt}
                auctionId={lot.id}
              />
            )}

            {activeSubTab === 'participants' && (
              <ParticipantsTable
                commitments={commitments}
                myCommitmentHash={myCommitmentHash}
                myBidAmount={privacySnapshot.clientBidAmount}
              />
            )}

            {activeSubTab === 'security' && <SecurityComparison />}

            {activeSubTab === 'settlement' && (
              <AuctionResult
                ledgerState={ledgerState}
                winner={winner}
                commitments={commitments}
                onCloseBidding={onCloseBidding}
                onFinalizeAuction={onFinalizeAuction}
                onResetAuction={onResetAuction}
                reservePrice={lot.reservePrice}
              />
            )}

            {activeSubTab === 'technical' && (
              <div className="space-y-4">
                <TechnicalDetails />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Sticky Bidding Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <BiddingPanel
            reservePrice={lot.reservePrice}
            circuitStep={circuitStep}
            onCommitBid={onCommitBid}
            ledgerOpen={ledgerState.auction_open}
            myCommitmentHash={myCommitmentHash}
            walletBalance={wallet.balance}
            isWalletConnected={wallet.connected}
            onConnectWallet={onConnectWallet}
            onCloseBidding={onCloseBidding}
            onFinalizeAuction={onFinalizeAuction}
            onResetAuction={onResetAuction}
            isFinalized={ledgerState.finalized}
          />
        </div>
      </div>
    </div>
  );
};
