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
    <section className="relative py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-2xl mx-auto text-center mb-10 space-y-2">
          <p className="text-[11px] font-mono tracking-wider text-vault-purple-light uppercase">
            ARCHITECTURAL DUAL-STATE MODEL
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            PRIVATE STATE VS. PUBLIC STATE
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Midnight decouples private data execution from public ledger consensus.
          </p>
        </div>

        {/* Dual-State Grid with Central ZK Bridge */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-4 items-center">
          {/* LEFT: PRIVATE STATE (Dark Secure Vault Visual) */}
          <div className="lg:col-span-5 vault-card p-6 border-white/[0.08] bg-midnight-950/90 relative overflow-hidden shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-vault-purple/15 border border-vault-purple/30 flex items-center justify-center text-vault-purple-light">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-mono font-semibold text-xs tracking-wider text-white">
                    PRIVATE STATE
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">Client Enclave / RAM</p>
                </div>
              </div>

              {myBidAmount && (
                <button
                  onClick={() => setPeekPrivate(!peekPrivate)}
                  className="flex items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
                >
                  {peekPrivate ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{peekPrivate ? 'Mask' : 'Peek'}</span>
                </button>
              )}
            </div>

            {/* Encrypted Information Items */}
            <div className="mt-4 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-300">Bid Amount</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono tracking-widest text-[11px]">
                    {peekPrivate && myBidAmount
                      ? `${myBidAmount.toLocaleString()} tDUST`
                      : '████████████'}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-vault-purple/15 text-vault-purple-light border border-vault-purple/20">
                    PRIVATE
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-300">Secret Salt</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono tracking-widest text-[11px]">
                    {peekPrivate && myBidSalt ? `${myBidSalt.slice(0, 10)}...` : '████████████'}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-vault-purple/15 text-vault-purple-light border border-vault-purple/20">
                    PRIVATE
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-300">Wallet Balance</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono tracking-widest text-[11px]">
                    ████████████
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-vault-purple/15 text-vault-purple-light border border-vault-purple/20">
                    PRIVATE
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Shield className="w-3 h-3 text-vault-purple-light" />
                Witness Never Transmitted
              </span>
              <span>Encrypted</span>
            </div>
          </div>

          {/* CENTRAL CRYPTOGRAPHIC LAYER: ZERO-KNOWLEDGE PROOF */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center py-3 lg:py-0">
            <div className="relative flex flex-col items-center gap-1.5">
              <div className="w-10 h-10 rounded-lg bg-midnight-900 border border-vault-purple/40 flex items-center justify-center text-vault-purple-light shadow-sm">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400 font-semibold text-center leading-tight">
                ZERO-KNOWLEDGE PROOF
              </span>
            </div>
          </div>

          {/* RIGHT: PUBLIC STATE (Clean Transparent Ledger Visual) */}
          <div className="lg:col-span-5 vault-card p-6 border-white/[0.08] bg-midnight-950/90 relative overflow-hidden shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-md bg-cipher-teal/15 border border-cipher-teal/30 flex items-center justify-center text-cipher-teal">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h3 className="font-mono font-semibold text-xs tracking-wider text-white">
                    PUBLIC STATE
                  </h3>
                  <p className="text-[10px] font-mono text-slate-400">Midnight Ledger / Consensus</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Auditable</span>
              </div>
            </div>

            {/* Public Verified Information Items */}
            <div className="mt-4 space-y-2.5 font-mono text-xs">
              <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-300">Auction ID</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-200 font-medium">#{auctionId}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    VERIFIED
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-300">Deadline</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-200 font-medium">Block #1,245,920</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    VERIFIED
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-300">Auction Status</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-200 font-medium">
                    {ledgerState.auction_open ? 'OPEN' : 'CLOSED'}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    VERIFIED
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                <span className="text-slate-300">ZK Proof</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-200 font-medium">PLONK-v2</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>On-Chain Consensus</span>
              <span className="text-slate-300 font-medium">Midnight Preprod</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
