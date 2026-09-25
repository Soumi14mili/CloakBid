import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Eye,
  AlertTriangle,
  Lock,
  CheckCircle2,
  RefreshCw,
  Search,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export const PrivacyAttackSimulator: React.FC = () => {
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulate = () => {
    soundFx.playClick();
    setIsSimulating(true);

    setTimeout(() => {
      soundFx.playLock();
    }, 500);

    setTimeout(() => {
      setIsSimulating(false);
    }, 2800);
  };

  return (
    <section id="privacy-attack-section" className="relative py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-2xl mx-auto text-center mb-10 space-y-2">
          <p className="text-[11px] font-mono tracking-wider text-vault-purple-light uppercase">
            SECURITY COMPARISON
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            PRIVACY ATTACK SIMULATOR
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Compare information exposure before and after privacy protection.
          </p>

          {/* Trigger button */}
          <div className="pt-3">
            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="btn-vault-secondary text-xs !py-2.5 !px-5 font-mono"
            >
              {isSimulating ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-vault-purple-light" />
                  <span>SIMULATING OBSERVER INSPECTION...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-slate-300" />
                  <span>TEST OBSERVER INSPECTION</span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* ── LEFT: PUBLIC AUCTION (Exposed) ────────────────────────── */}
          <div className="vault-card p-6 border-rose-500/20 bg-midnight-950/90 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-rose-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-mono font-semibold text-xs text-white tracking-wider">
                      PUBLIC AUCTION
                    </h3>
                    <p className="text-[10px] font-mono text-slate-400">Public EVM / Transparent Mempool</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-semibold">
                  <Eye className="w-3.5 h-3.5" />
                  <span>BIDS EXPOSED</span>
                </div>
              </div>

              {/* Bid Table */}
              <div className="mt-4 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-rose-500/10">
                  <span className="text-slate-300">Alice</span>
                  <span className="text-rose-400 font-bold">1,500</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-rose-500/10">
                  <span className="text-slate-300">Bob</span>
                  <span className="text-rose-400 font-bold">1,800</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-rose-500/10">
                  <span className="text-slate-300">Charlie</span>
                  <span className="text-rose-400 font-bold">2,100</span>
                </div>
              </div>

              {/* Observer Representation */}
              <div className="mt-4 p-3 rounded bg-rose-950/20 border border-rose-500/20 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center gap-1.5 text-rose-400 font-mono text-[11px] font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Network Observer / MEV Bot</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Observer reads all pending bids directly from the public mempool. Bots can front-run by outbidding Charlie by fractional increments before block inclusion.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-rose-500/15 flex items-center justify-between text-[11px] font-mono text-rose-400">
              <span>Mempool Status</span>
              <span>100% Unshielded Leakage</span>
            </div>
          </div>

          {/* ── RIGHT: CLOAKBID (Private) ──────────────────────────────── */}
          <div className="vault-card p-6 border-emerald-500/20 bg-midnight-950/90 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="font-mono font-semibold text-xs text-white tracking-wider">
                      CLOAKBID
                    </h3>
                    <p className="text-[10px] font-mono text-slate-400">Midnight Dual-State Zero-Knowledge</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold">
                  <Lock className="w-3.5 h-3.5" />
                  <span>BIDS PRIVATE</span>
                </div>
              </div>

              {/* Bid Table */}
              <div className="mt-4 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-slate-300">Alice</span>
                  <span className="text-slate-400 font-mono tracking-widest">█████</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-slate-300">Bob</span>
                  <span className="text-slate-400 font-mono tracking-widest">█████</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded bg-white/[0.02] border border-white/[0.05]">
                  <span className="text-slate-300">Charlie</span>
                  <span className="text-slate-400 font-mono tracking-widest">█████</span>
                </div>
              </div>

              {/* Observer Representation */}
              <div className="mt-4 p-3 rounded bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Observer Query Response</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Observer attempts inspection but receives only opaque 256-bit commitment hashes and verified zero-knowledge proofs. Zero valuation data is exposed.
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-500/15 flex items-center justify-between text-[11px] font-mono text-emerald-400">
              <span>Enclave Status</span>
              <span>Protected by Compact Circuit</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
