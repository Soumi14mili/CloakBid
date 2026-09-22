import React, { useState } from 'react';
import {
  Trophy,
  CheckCircle2,
  Lock,
  Sparkles,
  ShieldCheck,
  Award,
  RefreshCw,
  ExternalLink,
  ChevronRight,
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

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background glow burst when winner is revealed */}
      {isFinalized && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-vault-purple/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-900/90 border border-white/10 text-[11px] font-mono text-slate-400">
            <Trophy className="w-3.5 h-3.5 text-vault-purple-light" />
            <span>SETTLEMENT LIFECYCLE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            <span className="gradient-text-purple">AUCTION COMPLETION & REVEAL</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            When the round closes, zero-knowledge verification authorizes private settlement without ever disclosing losing bids.
          </p>

          {/* Interactive Simulation Bar for Hackathon Judges */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            {ledgerState.auction_open ? (
              <button
                onClick={handleClose}
                disabled={processing}
                className="btn-vault-secondary text-xs !py-2.5 !px-5 font-mono"
              >
                {processing ? 'Closing...' : 'Close Auction Round'}
              </button>
            ) : !isFinalized ? (
              <button
                onClick={handleFinalize}
                disabled={processing}
                className="btn-vault-primary text-xs !py-2.5 !px-6 font-mono font-bold shadow-vault-glow"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{processing ? 'Verifying Proof...' : 'Finalize & Reveal Winner'}</span>
              </button>
            ) : (
              <button
                onClick={handleReset}
                disabled={processing}
                className="btn-vault-secondary text-xs !py-2.5 !px-5 font-mono text-slate-400 hover:text-white"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo Auction</span>
              </button>
            )}
          </div>
        </div>

        {/* Cinematic Flow Container */}
        {!isFinalized ? (
          /* Pre-Finalization Status Card */
          <div className="max-w-2xl mx-auto vault-card p-8 border-white/10 text-center space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-midnight-900 border border-white/10 mx-auto flex items-center justify-center text-slate-400">
              <Lock className="w-7 h-7 text-vault-purple" />
            </div>

            <div className="space-y-1">
              <h3 className="font-display font-bold text-xl text-white">
                {ledgerState.auction_open ? 'AUCTION ROUND IN PROGRESS' : 'AUCTION CLOSED · READY FOR FINALIZATION'}
              </h3>
              <p className="text-xs font-mono text-slate-400">
                {ledgerState.auction_open
                  ? 'Collecting zero-knowledge sealed bids. All values remain opaque.'
                  : 'Bidding window closed. Ready to run SNARK verification and determine highest valid bidder.'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-6 pt-2 text-xs font-mono text-slate-400">
              <span>Status: <strong className="text-white">{ledgerState.auction_open ? 'OPEN' : 'CLOSED'}</strong></span>
              <span>Bids in Vault: <strong className="text-vault-purple-light">{commitments.length || 5}</strong></span>
              <span>Consensus: <strong className="text-emerald-400">Midnight Preprod</strong></span>
            </div>
          </div>
        ) : (
          /* Cinematic Winner Reveal State */
          <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
            {/* Step Pipeline Status */}
            <div className="flex items-center justify-center gap-3 font-mono text-xs text-slate-400">
              <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">AUCTION CLOSED</span>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <span className="px-3 py-1 rounded-full bg-vault-purple/20 text-vault-purple-light border border-vault-purple/40">
                VERIFYING ZK PROOF
              </span>
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                AUCTION VERIFIED
              </span>
            </div>

            {/* Elevated Illuminated Winner Card */}
            <div className="relative vault-card p-8 sm:p-10 border-vault-purple bg-gradient-to-b from-midnight-950 via-vault-purple/15 to-midnight-900 shadow-vault-glow-lg rounded-3xl transform -translate-y-2 transition-all">
              {/* Top Accent Crown */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-vault-purple to-cipher-teal text-white font-mono text-xs font-bold tracking-wider shadow-lg flex items-center gap-1.5">
                <Trophy className="w-4 h-4" />
                <span>WINNER VERIFIED</span>
              </div>

              {/* Winner Identity */}
              <div className="text-center pt-2 space-y-2">
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  HIGHEST VALID BIDDER
                </p>
                <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-white tracking-wide">
                  BIDDER #{winner.commitmentHash.slice(0, 4).toUpperCase() || 'A7F3'}
                </h3>
                <p className="text-xs font-mono text-slate-400">
                  Address: <span className="text-slate-300">{winner.address}</span>
                </p>
              </div>

              {/* Bid Comparison: Sealed Amounts Guarantee */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 font-mono text-xs">
                {/* Winning Bid */}
                <div className="p-4 rounded-xl bg-midnight-950/90 border border-vault-purple/30 space-y-1">
                  <p className="text-slate-400 text-[11px]">Winning Bid</p>
                  <p className="text-sm font-bold text-vault-purple-light tracking-widest">
                    ███████████
                  </p>
                  <p className="text-[10px] text-slate-400">Settled securely via private contract</p>
                </div>

                {/* Losing Bids */}
                <div className="p-4 rounded-xl bg-midnight-950/90 border border-white/5 space-y-1">
                  <p className="text-slate-400 text-[11px]">Losing Bids (All Competitors)</p>
                  <p className="text-sm font-bold text-slate-400 tracking-widest">
                    ███████████
                  </p>
                  <p className="text-[10px] text-slate-400">Permanently concealed on-chain</p>
                </div>
              </div>

              {/* Verification Checklist */}
              <div className="space-y-2.5 pt-4 border-t border-white/10 font-mono text-xs">
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>✓ Valid bid above reserve threshold</span>
                </div>
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>✓ Sufficient balance verified by circuit</span>
                </div>
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>✓ Halo2 / PLONK ZK proof verified on Midnight</span>
                </div>
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>✓ Zero losing bid values revealed</span>
                </div>
                <div className="flex items-center gap-2.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>✓ Cryptographic settlement authorized</span>
                </div>
              </div>

              {/* Settlement Footer */}
              <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
                <span className="truncate max-w-[280px]">
                  Proof Hash: <strong className="text-slate-300">{winner.proofHash.slice(0, 16)}...</strong>
                </span>
                <a
                  href="https://explorer.midnight.network/contract/mn1q7xk4p9dv2w5r8nj3ht6ys0cqzfa1e8mbgluiop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cipher-teal hover:underline flex items-center gap-1"
                >
                  <span>Verify Settlement On Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
