import React, { useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  Lock,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  Check,
} from 'lucide-react';
import type { LedgerState, WinnerData, BidCommitment } from '../types';
import { soundFx } from '../utils/audio';

interface Props {
  ledgerState: LedgerState;
  winner: WinnerData | null;
  commitments: BidCommitment[];
  onCloseBidding: () => Promise<void>;
  onFinalizeAuction: () => Promise<void>;
  onResetAuction: () => Promise<void>;
}

export const AuctionCompletionReveal: React.FC<Props> = ({
  ledgerState,
  winner,
  commitments,
  onCloseBidding,
  onFinalizeAuction,
  onResetAuction,
}) => {
  const [processing, setProcessing] = useState(false);

  const handleClose = async () => {
    soundFx.playClick();
    setProcessing(true);
    await onCloseBidding();
    setProcessing(false);
  };

  const handleFinalize = async () => {
    soundFx.playCommit();
    setProcessing(true);
    await onFinalizeAuction();
    setProcessing(false);
    soundFx.playSuccess();
  };

  const handleReset = async () => {
    soundFx.playClick();
    setProcessing(true);
    await onResetAuction();
    setProcessing(false);
  };

  const isFinalized = ledgerState.finalized && winner !== null;
  const isClosed = !ledgerState.auction_open;

  const winnerTag = winner
    ? winner.address.length > 8
      ? `BIDDER #${winner.address.slice(0, 4).toUpperCase()}`
      : `BIDDER #${winner.address}`
    : 'BIDDER #A7F3';

  const verificationChecklist = [
    'Bid validity',
    'Balance requirement',
    'Auction rules',
    'ZK verification',
    'Private losing bids',
    'Settlement authorization',
  ];

  return (
    <section id="settlement-section" className="relative py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-2xl mx-auto text-center mb-10 space-y-2">
          <p className="text-[11px] font-mono tracking-wider text-vault-purple-light uppercase">
            SETTLEMENT ENGINE
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            AUCTION SETTLEMENT & VERIFICATION
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Cryptographic outcome verification on the Midnight Network.
          </p>

          {/* Administrative Round Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2.5">
            {ledgerState.auction_open ? (
              <button
                onClick={handleClose}
                disabled={processing}
                className="btn-vault-secondary text-xs !py-2 !px-4 font-mono"
              >
                {processing ? 'Closing...' : 'Close Auction Round'}
              </button>
            ) : !isFinalized ? (
              <button
                onClick={handleFinalize}
                disabled={processing}
                className="btn-vault-primary text-xs !py-2 !px-5 font-mono"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{processing ? 'Verifying Result...' : 'Finalize & Reveal Winner'}</span>
              </button>
            ) : (
              <button
                onClick={handleReset}
                disabled={processing}
                className="btn-vault-secondary text-xs !py-2 !px-4 font-mono text-slate-400 hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo Round</span>
              </button>
            )}
          </div>
        </div>

        {/* State 1: Before Finalization (Auction Open or Closed Pending Finalization) */}
        {!isFinalized ? (
          <div className="max-w-2xl mx-auto vault-card p-6 border-white/[0.08] text-center space-y-4">
            <div className="w-10 h-10 rounded-lg bg-midnight-900 border border-white/10 mx-auto flex items-center justify-center text-slate-400">
              <Lock className="w-5 h-5 text-vault-purple-light" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 font-mono text-xs text-slate-400">
                <span className={`px-2 py-0.5 rounded ${isClosed ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-400'}`}>
                  AUCTION CLOSED
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="px-2 py-0.5 rounded bg-white/5 text-slate-400">
                  VERIFYING RESULT
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                <span className="px-2 py-0.5 rounded bg-white/5 text-slate-400">
                  ZK PROOF VERIFIED
                </span>
              </div>

              <h3 className="font-semibold text-base text-white pt-2">
                {ledgerState.auction_open
                  ? 'Bidding Phase Active'
                  : 'Bidding Closed · Ready for Settlement'}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {ledgerState.auction_open
                  ? 'Sealed bids are actively being collected. All values remain strictly confidential in client memory.'
                  : 'Auction window closed. Click "Finalize & Reveal Winner" to run the ZK verification circuit.'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-5 pt-1 text-xs font-mono text-slate-400">
              <span>Status: <strong className="text-slate-200">{ledgerState.auction_open ? 'OPEN' : 'CLOSED'}</strong></span>
              <span>Committed Bids: <strong className="text-white">{commitments.length || 4}</strong></span>
              <span>Network: <strong className="text-emerald-400">Midnight Preprod</strong></span>
            </div>
          </div>
        ) : (
          /* State 2: Finalized Result (Section 12 Spec) */
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
            {/* Step Pipeline Status */}
            <div className="flex items-center justify-center gap-2 font-mono text-xs text-slate-400">
              <span className="px-2.5 py-0.5 rounded bg-white/5 text-slate-400">
                AUCTION CLOSED
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-0.5 rounded bg-white/5 text-slate-400">
                VERIFYING RESULT
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                AUCTION VERIFIED
              </span>
            </div>

            {/* Elegant Winner Card */}
            <div className="vault-card p-6 border-white/10 bg-midnight-950/90 space-y-5">
              {/* Winner Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-vault-purple/15 border border-vault-purple/30 flex items-center justify-center text-vault-purple-light">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                      SETTLEMENT OUTCOME
                    </span>
                    <h3 className="font-semibold text-sm text-white">
                      WINNER: <span className="font-mono text-emerald-400">{winnerTag}</span>
                    </h3>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-semibold">
                  VERIFIED
                </span>
              </div>

              {/* Winning Bid & Losing Bids Display (Masked) */}
              <div className="space-y-2.5 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-slate-300">Winning bid</span>
                  <span className="text-slate-400 tracking-widest text-[11px]">
                    ████████
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-slate-400">Losing bid #1</span>
                  <span className="text-slate-500 tracking-widest text-[11px]">
                    ████████
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-slate-400">Losing bid #2</span>
                  <span className="text-slate-500 tracking-widest text-[11px]">
                    ████████
                  </span>
                </div>
              </div>

              {/* Verification Checklist */}
              <div className="pt-3 border-t border-white/[0.08] space-y-2">
                <p className="text-[11px] font-mono text-slate-400 tracking-wide uppercase">
                  VERIFICATION CHECKLIST
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {verificationChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-slate-300">
                      <div className="w-4 h-4 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
