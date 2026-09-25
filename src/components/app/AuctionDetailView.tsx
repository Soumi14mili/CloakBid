import React, { useState } from 'react';
import { ChevronLeft, Lock, LockOpen, ShieldCheck, CircleAlert } from 'lucide-react';
import type {
  AuctionConfig,
  LedgerState,
  CircuitStep,
  BidCommitment,
  WinnerData,
  PrivacySnapshot,
} from '../../types';
import { BidPanel } from './BidPanel';

interface Props {
  auction: AuctionConfig;
  ledgerState: LedgerState;
  circuitStep: CircuitStep;
  commitments: BidCommitment[];
  winner: WinnerData | null;
  privacySnapshot: PrivacySnapshot;
  myCommitmentHash: string | null;
  walletConnected: boolean;
  onCommitBid: (amount: number) => Promise<void>;
  onCloseBidding: () => Promise<void>;
  onFinalize: () => Promise<void>;
  onBack: () => void;
}

const SUBTABS = ['Privacy Architecture', 'Committed Bids', 'On-Chain State'] as const;

export const AuctionDetailView: React.FC<Props> = ({
  auction,
  ledgerState,
  circuitStep,
  commitments,
  winner,
  privacySnapshot,
  myCommitmentHash,
  walletConnected,
  onCommitBid,
  onCloseBidding,
  onFinalize,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);

  return (
    <div className="bg-cb-base py-8 px-5 sm:px-8 max-w-content mx-auto min-h-screen">
      {/* Back navigation */}
      <div className="flex items-center gap-2 mb-6">
        <button
          className="btn-ghost btn-sm flex items-center gap-1.5"
          onClick={onBack}
        >
          <ChevronLeft className="w-4 h-4" />
          All Auctions
        </button>
        <span className="text-cb-t3 select-none">·</span>
        <span className="text-[13px] text-cb-t2 truncate max-w-xs">{auction.title}</span>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* ── LEFT COLUMN ── */}
        <div>
          {/* Auction header card */}
          <div className="card p-6 mb-5">
            {/* Status row */}
            <div className="flex items-center gap-3">
              {ledgerState.auction_open && (
                <span className="badge-live">LIVE</span>
              )}
              <span className="font-mono text-[11px] text-cb-t3">{auction.rarity}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl font-bold text-cb-t1 tracking-tight mt-3">
              {auction.title}
            </h1>

            {/* Category / description */}
            <p className="text-cb-t2 text-[14px] mt-2">
              {auction.category && (
                <span className="text-cb-t3 mr-2">{auction.category} ·</span>
              )}
              {auction.description}
            </p>

            {/* Specs grid */}
            {auction.specs && auction.specs.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
                {auction.specs.map((spec, i) => (
                  <div key={i} className="card-sub p-3 rounded-lg">
                    <p className="label text-[10px]">{spec.label}</p>
                    <p className="text-[13px] font-medium text-cb-t1 mt-1">{spec.value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Subtabs */}
          <div className="flex border-b border-[rgba(255,255,255,0.09)] gap-6 mb-5">
            {SUBTABS.map((tab, idx) => (
              <button
                key={tab}
                onClick={() => setActiveTab(idx as 0 | 1 | 2)}
                className={[
                  'text-[13px] py-3 border-b-2 transition-colors whitespace-nowrap',
                  activeTab === idx
                    ? 'border-cb-accent text-cb-t1'
                    : 'border-transparent text-cb-t3 hover:text-cb-t2',
                ].join(' ')}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Subtab content */}
          {activeTab === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Adversary Can See */}
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <LockOpen className="w-4 h-4 text-cb-warning" />
                  <span className="label text-[11px]">Adversary Can See</span>
                </div>
                <ul className="space-y-2">
                  {privacySnapshot.adversaryCanSee.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CircleAlert className="w-3 h-3 text-cb-warning mt-0.5 shrink-0" />
                      <span className="text-[13px] text-cb-t2 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Adversary Cannot See */}
              <div className="card p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="w-4 h-4 text-cb-success" />
                  <span className="label text-[11px]">Adversary Cannot See</span>
                </div>
                <ul className="space-y-2">
                  {privacySnapshot.adversaryCannotSee.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ShieldCheck className="w-3 h-3 text-cb-success mt-0.5 shrink-0" />
                      <span className="text-[13px] text-cb-t2 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div>
              <p className="text-[13px] text-cb-t3 mb-4">
                <span className="font-medium text-cb-t2">{commitments.length}</span>{' '}
                sealed commitment{commitments.length !== 1 ? 's' : ''} recorded on-chain
              </p>

              {commitments.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <span className="text-cb-t3 text-[13px]">No bids submitted yet</span>
                </div>
              ) : (
                <div>
                  {commitments.map((c, idx) => (
                    <div
                      key={c.id}
                      className="card-sub p-4 rounded-lg mb-2 flex items-center justify-between gap-3"
                    >
                      {/* Left: identity indicator */}
                      <div className="flex items-center gap-2 min-w-0 shrink-0">
                        {c.isMine ? (
                          <Lock className="w-4 h-4 text-cb-accent shrink-0" />
                        ) : (
                          <span className="w-3 h-3 rounded-full bg-[rgba(255,255,255,0.12)] shrink-0 inline-block" />
                        )}
                        <span className="text-[13px] font-medium text-cb-t1 whitespace-nowrap">
                          {c.isMine ? 'You' : `Bidder #${idx + 1}`}
                        </span>
                      </div>

                      {/* Center: hash */}
                      <span className="mono text-[11px] text-cb-t3 truncate max-w-[180px] flex-1 text-center">
                        {c.truncatedHash ?? c.hash}
                      </span>

                      {/* Right: timestamp */}
                      <span className="text-[11px] text-cb-t3 whitespace-nowrap shrink-0">
                        {new Date(c.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 2 && (
            <div className="card-sub p-5 rounded-xl">
              {[
                { label: 'Contract Address', value: '51d23a07...8b15', mono: true },
                { label: 'Network', value: 'Midnight Preview' },
                {
                  label: 'Auction Open',
                  value: ledgerState.auction_open ? 'Yes' : 'No',
                },
                { label: 'Bid Count', value: String(ledgerState.bid_count) },
                {
                  label: 'Reserve Price',
                  value: `${ledgerState.reserve_price.toLocaleString()} tDUST`,
                },
                {
                  label: 'Finalized',
                  value: ledgerState.finalized ? 'Yes' : 'No',
                },
                {
                  label: 'Winner Hash',
                  value: ledgerState.winner_hash
                    ? `${ledgerState.winner_hash.slice(0, 8)}...${ledgerState.winner_hash.slice(-6)}`
                    : 'Pending',
                  mono: !!ledgerState.winner_hash,
                },
              ].map(({ label, value, mono }, i, arr) => (
                <div
                  key={label}
                  className={[
                    'flex items-center justify-between py-3',
                    i < arr.length - 1 ? 'border-b border-[rgba(255,255,255,0.05)]' : '',
                  ].join(' ')}
                >
                  <span className="label text-[12px] text-cb-t3">{label}</span>
                  <span
                    className={[
                      'text-[13px] font-medium text-cb-t1',
                      mono ? 'mono truncate max-w-[220px]' : '',
                    ].join(' ')}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="lg:sticky lg:top-20 self-start">
          <BidPanel
            auction={auction}
            ledgerState={ledgerState}
            circuitStep={circuitStep}
            commitments={commitments}
            winner={winner}
            privacySnapshot={privacySnapshot}
            myCommitmentHash={myCommitmentHash}
            walletConnected={walletConnected}
            onCommitBid={onCommitBid}
            onCloseBidding={onCloseBidding}
            onFinalize={onFinalize}
          />
        </div>
      </div>
    </div>
  );
};
