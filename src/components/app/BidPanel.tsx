import React, { useState } from 'react';
import { Lock, CheckCircle2, Copy, Trophy, Loader2, X } from 'lucide-react';
import type { LedgerState, CircuitStep, BidCommitment, WinnerData, PrivacySnapshot, AuctionConfig } from '../../types';

interface Props {
  auction?: AuctionConfig;
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
}

// ---------- ZK pipeline step definitions ----------
const PIPELINE_STEPS: { id: CircuitStep; label: string }[] = [
  { id: 'reading-witness', label: 'Reading Witness' },
  { id: 'hashing',         label: 'Computing Hash'  },
  { id: 'proving',         label: 'Generating Proof' },
  { id: 'submitting',      label: 'Submitting Tx'    },
];

const STEP_ORDER: CircuitStep[] = [
  'reading-witness',
  'hashing',
  'proving',
  'submitting',
  'confirmed',
];

function stepStatus(stepId: CircuitStep, current: CircuitStep): 'done' | 'active' | 'pending' {
  if (current === 'confirmed' || current === 'error') {
    return current === 'confirmed' ? 'done' : 'pending';
  }
  const currentIdx = STEP_ORDER.indexOf(current);
  const stepIdx    = STEP_ORDER.indexOf(stepId);
  if (stepIdx < currentIdx)  return 'done';
  if (stepIdx === currentIdx) return 'active';
  return 'pending';
}

// ---------- Component ----------
export const BidPanel: React.FC<Props> = ({
  ledgerState,
  circuitStep,
  commitments,
  winner,
  privacySnapshot: _privacySnapshot,
  myCommitmentHash,
  walletConnected,
  onCommitBid,
  onCloseBidding,
  onFinalize,
}) => {
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [copied,    setCopied]    = useState(false);

  const { auction_open, finalized, reserve_price, bid_count } = ledgerState;
  const isProcessing = circuitStep !== 'idle' && circuitStep !== 'confirmed' && circuitStep !== 'error';
  const belowReserve = bidAmount > 0 && bidAmount < reserve_price;

  // ---- handlers ----
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bidAmount <= 0 || isProcessing) return;
    await onCommitBid(bidAmount);
  };

  const handleCopy = () => {
    if (!myCommitmentHash) return;
    navigator.clipboard.writeText(myCommitmentHash).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ---- status badge ----
  const StatusBadge = () => {
    if (auction_open) {
      return <span className="badge-live">ACCEPTING BIDS</span>;
    }
    if (!finalized) {
      return <span className="badge-closed">BIDDING CLOSED</span>;
    }
    return <span className="badge-settled">SETTLED</span>;
  };

  return (
    <div className="sticky top-6 bg-cb-sub border border-[rgba(255,255,255,0.09)] rounded-xl overflow-hidden flex flex-col">

      {/* ── SECTION 1: Auction Status ── */}
      <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.05)]">
        <div className="flex items-center justify-between">
          <span className="label">Auction Status</span>
          <StatusBadge />
        </div>
        <p className="text-[13px] text-cb-t2 mt-2">
          {bid_count} sealed bid{bid_count !== 1 ? 's' : ''} recorded
        </p>
      </div>

      {/* ── SECTION 2: Bid Input ── */}
      {auction_open && (
        <div className="px-5 py-5 border-b border-[rgba(255,255,255,0.05)]">
          <p className="text-[15px] font-semibold text-cb-t1 mb-4">Place Sealed Bid</p>

          {walletConnected ? (
            <form onSubmit={handleSubmit}>
              <label className="label mb-1.5 block">Bid Amount (tDUST)</label>
              <input
                type="number"
                min={0}
                step="any"
                value={bidAmount === 0 ? '' : bidAmount}
                onChange={e => setBidAmount(parseFloat(e.target.value) || 0)}
                placeholder="0"
                className="w-full bg-cb-elevated border border-[rgba(255,255,255,0.09)] rounded-lg px-3 py-2.5 text-[14px] text-cb-t1 placeholder:text-cb-t3 focus:outline-none focus:border-cb-accent/60 transition-colors"
                disabled={isProcessing}
              />
              {belowReserve && (
                <p className="text-[12px] text-cb-error mt-1.5">
                  Bid is below the reserve price of {reserve_price} tDUST
                </p>
              )}

              <button
                type="submit"
                disabled={isProcessing || bidAmount <= 0}
                className="btn-primary w-full mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    Seal &amp; Submit Bid
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="flex items-start gap-2.5 bg-cb-elevated rounded-lg px-4 py-3">
              <X size={15} className="text-cb-t3 mt-0.5 shrink-0" />
              <p className="text-[13px] text-cb-t2">Connect your wallet to participate</p>
            </div>
          )}
        </div>
      )}

      {/* ── SECTION 3: ZK Proof Pipeline ── */}
      {circuitStep !== 'idle' && (
        <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.05)]">
          <p className="text-[13px] font-semibold text-cb-t1 mb-3">ZK Proof Pipeline</p>

          <div className="flex flex-col">
            {PIPELINE_STEPS.map((step, idx) => {
              const status = stepStatus(step.id, circuitStep);
              const circleBase = 'w-6 h-6 rounded-full border flex items-center justify-center shrink-0';
              const circleClass =
                status === 'active'  ? `${circleBase} border-cb-accent bg-cb-accent/10 text-cb-accent`
                : status === 'done' ? `${circleBase} border-cb-success bg-cb-success/10 text-cb-success`
                                    : `${circleBase} border-[rgba(255,255,255,0.09)] text-cb-t3`;

              return (
                <div key={step.id} className="flex items-center gap-3 py-2">
                  <div className={circleClass}>
                    {status === 'done' ? (
                      <CheckCircle2 size={12} />
                    ) : (
                      <span className="text-[11px] font-mono">{idx + 1}</span>
                    )}
                  </div>
                  <span className="text-[13px] text-cb-t2">{step.label}</span>
                  {status === 'active' && (
                    <Loader2 size={12} className="ml-auto text-cb-accent animate-spin" />
                  )}
                </div>
              );
            })}
          </div>

          {circuitStep === 'confirmed' && (
            <div className="mt-3 flex items-center gap-2.5 bg-cb-success/5 border border-cb-success/15 rounded-lg px-3.5 py-2.5">
              <CheckCircle2 size={14} className="text-cb-success shrink-0" />
              <p className="text-[12px] text-cb-success">Bid commitment recorded on-chain</p>
            </div>
          )}
        </div>
      )}

      {/* ── SECTION 4: Commitment Hash ── */}
      {myCommitmentHash && (
        <div className="px-5 py-4 border-t border-[rgba(255,255,255,0.05)]">
          <div className="flex items-center justify-between mb-2">
            <span className="label">Your Commitment Hash</span>
            <button
              onClick={handleCopy}
              className="btn-ghost btn-sm flex items-center gap-1.5"
              title="Copy hash"
            >
              <Copy size={12} />
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="bg-cb-elevated rounded-lg p-3 font-mono text-[11px] text-cb-t3 break-all leading-relaxed">
            {myCommitmentHash}
          </div>
        </div>
      )}

      {/* ── SECTION 5: Admin / Demo Controls ── */}
      <div className="px-5 py-4 border-t border-[rgba(255,255,255,0.05)] bg-cb-elevated/30">
        <span className="label">Demo Controls</span>
        <p className="text-[11px] text-cb-t3 mt-1 mb-3">
          Auction lifecycle controls for demonstration
        </p>
        <div className="flex flex-wrap gap-2">
          {auction_open && (
            <button
              onClick={onCloseBidding}
              className="btn-ghost btn-sm"
            >
              Close Bidding
            </button>
          )}
          {!auction_open && !finalized && (
            <button
              onClick={onFinalize}
              className="btn-secondary btn-sm"
            >
              Finalize Auction
            </button>
          )}
          {finalized && (
            <button
              disabled
              className="btn-ghost btn-sm opacity-40 cursor-not-allowed"
            >
              Auction Complete
            </button>
          )}
        </div>
      </div>

      {/* ── SECTION 6: Winner Display ── */}
      {winner && (
        <div className="px-5 py-5 border-t border-[rgba(255,255,255,0.05)]">
          <div className="bg-cb-success/5 rounded-lg border border-cb-success/15 p-4">
            <div className="flex items-center gap-2.5 mb-3">
              <Trophy size={16} className="text-cb-success shrink-0" />
              <p className="text-[14px] font-semibold text-cb-success">Auction Settled</p>
            </div>

            <div className="space-y-2.5">
              <div>
                <p className="text-[11px] text-cb-t3 mb-0.5 uppercase tracking-wider">Winner</p>
                <p className="font-mono text-[12px] text-cb-t2 break-all">{winner.address}</p>
              </div>

              {winner.proofHash && (
                <div>
                  <p className="text-[11px] text-cb-t3 mb-0.5 uppercase tracking-wider">Proof Hash</p>
                  <p className="hash break-all">{winner.proofHash}</p>
                </div>
              )}

              <div className="pt-1 flex items-center gap-1.5">
                <CheckCircle2 size={12} className="text-cb-success shrink-0" />
                <p className="text-[11px] text-cb-t3">Result recorded on Midnight Ledger</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
