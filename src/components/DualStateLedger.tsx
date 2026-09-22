import React, { useState } from 'react';
import {
  Lock,
  Globe,
  Shield,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Eye,
  EyeOff,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { LedgerState, PrivacySnapshot } from '../types';

interface Props {
  ledgerState: LedgerState;
  myBidAmount: number | null;
  myBidSalt: string | null;
  myCommitmentHash: string | null;
  auctionId: string;
}

export const DualStateLedger: React.FC<Props> = ({
  ledgerState,
  myBidAmount,
  myBidSalt,
  myCommitmentHash,
  auctionId,
}) => {
  const [peekPrivate, setPeekPrivate] = useState(false);

  return (
    <section className="relative py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-900/90 border border-white/10 text-[11px] font-mono text-slate-400">
            <Layers className="w-3.5 h-3.5 text-vault-purple" />
            <span>MIDNIGHT DUAL-STATE ARCHITECTURE</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            <span className="gradient-text-purple">PRIVATE STATE VS PUBLIC STATE</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-400">
            Midnight decouples private data execution from public ledger consensus. Your sensitive bid details never touch the chain.
          </p>
        </div>

        {/* Dual State Split Grid with Central ZK Bridge */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-6 items-center">
          {/* LEFT PANEL: 🔒 PRIVATE STATE (Dark Encrypted Vault Aesthetic) */}
          <div className="lg:col-span-5 vault-card p-6 sm:p-7 border-vault-purple/30 bg-gradient-to-b from-midnight-950 to-midnight-900/90 relative overflow-hidden shadow-2xl">
            {/* Ambient Purple Highlight */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-vault-purple/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-vault-purple/20 border border-vault-purple/40 flex items-center justify-center text-vault-purple-light">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-sm text-white tracking-wider">
                    PRIVATE STATE
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">
                    CLIENT ENCLAVE / WITNESS
                  </p>
                </div>
              </div>

              {myBidAmount && (
                <button
                  onClick={() => setPeekPrivate(!peekPrivate)}
                  className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-vault-purple-light transition-colors"
                >
                  {peekPrivate ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{peekPrivate ? 'Mask' : 'Peek'}</span>
                </button>
              )}
            </div>

            {/* Private Data Items */}
            <div className="mt-5 space-y-3.5 font-mono text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-midnight-950/80 border border-white/5">
                <span className="text-slate-400">Bid Amount</span>
                <span className="text-vault-purple-light font-semibold tracking-wider">
                  {peekPrivate && myBidAmount
                    ? `${myBidAmount.toLocaleString()} tDUST`
                    : '███████████'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-midnight-950/80 border border-white/5">
                <span className="text-slate-400">Secret Salt</span>
                <span className="text-vault-purple-light font-semibold tracking-wider">
                  {peekPrivate && myBidSalt ? `${myBidSalt.slice(0, 10)}...` : '███████████'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-midnight-950/80 border border-white/5">
                <span className="text-slate-400">Private Balance</span>
                <span className="text-vault-purple-light font-semibold tracking-wider">
                  ███████████
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-midnight-950/80 border border-white/5">
                <span className="text-slate-400">Bidder Identity</span>
                <span className="text-vault-purple-light font-semibold tracking-wider">
                  ███████████
                </span>
              </div>
            </div>

            {/* Bottom Guarantee */}
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-vault-purple-light">
                <Shield className="w-3.5 h-3.5" />
                Zero Knowledge Leakage
              </span>
              <span>Encrypted at Rest</span>
            </div>
          </div>

          {/* CENTRAL BRIDGE: ZERO-KNOWLEDGE PROOF */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center py-4 lg:py-0">
            <div className="relative flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-midnight-900 border border-vault-purple/50 flex items-center justify-center text-vault-purple-light shadow-vault-glow">
                <Cpu className="w-6 h-6 animate-pulse" />
              </div>

              <div className="text-center font-mono text-[9px] uppercase tracking-wider text-slate-400 font-bold max-w-[80px] leading-tight">
                ZERO-KNOWLEDGE PROOF
              </div>

              <div className="hidden lg:flex items-center gap-1 text-[9px] font-mono text-cyan-400 mt-1">
                <span>PLONK</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: ◇ PUBLIC STATE (Transparent Ledger Aesthetic) */}
          <div className="lg:col-span-5 vault-card p-6 sm:p-7 border-cipher-teal/30 bg-gradient-to-b from-midnight-950 to-midnight-900/90 relative overflow-hidden shadow-2xl">
            {/* Ambient Cyan Highlight */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-cipher-teal/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cipher-teal/20 border border-cipher-teal/40 flex items-center justify-center text-cipher-teal">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-mono font-bold text-sm text-white tracking-wider">
                    PUBLIC STATE
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">
                    MIDNIGHT PREPROD CONSENSUS
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                AUDITABLE
              </span>
            </div>

            {/* Public Ledger Data Items */}
            <div className="mt-5 space-y-3.5 font-mono text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-midnight-950/80 border border-white/5">
                <span className="text-slate-400">Auction ID</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>#{auctionId} Active</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-midnight-950/80 border border-white/5">
                <span className="text-slate-400">Deadline Verification</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Block Height Enforced</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-midnight-950/80 border border-white/5">
                <span className="text-slate-400">Auction Status</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{ledgerState.auction_open ? 'Bidding Open' : 'Closed'}</span>
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-midnight-950/80 border border-white/5">
                <span className="text-slate-400">ZK Proof Validation</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>SNARK Verified ✓</span>
                </span>
              </div>
            </div>

            {/* Bottom Auditable Guarantee */}
            <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-cipher-teal">
                <Sparkles className="w-3.5 h-3.5" />
                Globally Verifiable
              </span>
              <span>Midnight Preprod Contract</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
