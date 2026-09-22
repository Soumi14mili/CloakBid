import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Eye,
  AlertTriangle,
  Lock,
  CheckCircle2,
  Zap,
  Play,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

export const PrivacyAttackSimulator: React.FC = () => {
  const [isAttacking, setIsAttacking] = useState(false);
  const [attackCount, setAttackCount] = useState(0);

  const handleLaunchAttack = () => {
    soundFx.playClick();
    setIsAttacking(true);
    setAttackCount(prev => prev + 1);

    // Play deflection sound
    setTimeout(() => {
      soundFx.playLock();
    }, 600);

    setTimeout(() => {
      setIsAttacking(false);
    }, 3800);
  };

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-vault-purple/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-900/90 border border-white/10 text-[11px] font-mono text-slate-400">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>ADVERSARIAL SECURITY BENCHMARK</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            <span className="gradient-text-purple">PRIVACY ATTACK SIMULATOR</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            See in real time why traditional blockchain auctions fail bidders, and how Midnight’s zero-knowledge cryptography deflects 100% of front-running attacks.
          </p>

          {/* Interactive Simulation Trigger Button */}
          <div className="pt-4">
            <button
              onClick={handleLaunchAttack}
              disabled={isAttacking}
              className={`btn-vault-primary text-xs !py-3 !px-7 font-mono font-semibold tracking-wider ${
                isAttacking ? 'opacity-70 cursor-wait' : ''
              }`}
            >
              {isAttacking ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-rose-300" />
                  <span>SIMULATING MEMPOOL SNIPING ATTACK...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-amber-400" />
                  <span>SIMULATE MEMPOOL ATTACK (TEST DEFENSE)</span>
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* ── LEFT: TRADITIONAL AUCTION (Vulnerable) ─────────────── */}
          <div className="vault-card p-6 sm:p-8 border-rose-500/25 bg-gradient-to-b from-rose-950/20 via-midnight-950 to-midnight-900 flex flex-col justify-between relative overflow-hidden">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-rose-500/20">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-sm text-white tracking-wider">
                      TRADITIONAL AUCTION
                    </h3>
                    <p className="text-[10px] font-mono text-rose-400">
                      ETHEREUM / PUBLIC EVM CHAINS
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-mono">
                  <Eye className={`w-3.5 h-3.5 ${isAttacking ? 'animate-bounce text-rose-300' : ''}`} />
                  <span>MEMPOOL EXPOSED</span>
                </div>
              </div>

              {/* Bid List with Cleartext Amounts */}
              <div className="my-6 space-y-3 font-mono text-xs">
                <div
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 ${
                    isAttacking
                      ? 'bg-rose-950/50 border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                      : 'bg-midnight-950/80 border-white/5'
                  }`}
                >
                  <span className="text-slate-300 font-semibold">Alice</span>
                  <span className="text-rose-300 font-bold text-sm">1,500 tDUST</span>
                </div>

                <div
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 ${
                    isAttacking
                      ? 'bg-rose-950/50 border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                      : 'bg-midnight-950/80 border-white/5'
                  }`}
                >
                  <span className="text-slate-300 font-semibold">Bob</span>
                  <span className="text-rose-300 font-bold text-sm">1,800 tDUST</span>
                </div>

                <div
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition-all duration-300 ${
                    isAttacking
                      ? 'bg-rose-950/50 border-rose-500/60 shadow-[0_0_15px_rgba(244,63,94,0.2)]'
                      : 'bg-midnight-950/80 border-white/5'
                  }`}
                >
                  <span className="text-slate-300 font-semibold">Charlie</span>
                  <span className="text-rose-300 font-bold text-sm">2,100 tDUST</span>
                </div>
              </div>
            </div>

            {/* Attack Vulnerability Alerts */}
            <div className="space-y-2 pt-4 border-t border-rose-500/20">
              <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>⚠ BID AMOUNTS PUBLICLY VISIBLE</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>⚠ FRONT-RUNNING & MEV SNIPING OPPORTUNITY</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>⚠ INFORMATION LEAKAGE BEFORE SETTLEMENT</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: CLOAKBID (Midnight ZK Shielded) ─────────────── */}
          <div className="vault-card p-6 sm:p-8 border-vault-purple/40 bg-gradient-to-b from-vault-purple/15 via-midnight-950 to-midnight-900 flex flex-col justify-between relative overflow-hidden shadow-2xl">
            {/* Animated Shield Ripple on Attack */}
            {isAttacking && (
              <div className="absolute inset-0 bg-vault-purple/10 backdrop-blur-xs border-2 border-vault-purple/60 rounded-2xl animate-pulse pointer-events-none flex items-center justify-center">
                <div className="px-4 py-2 rounded-xl bg-midnight-900/90 border border-vault-purple-light text-vault-purple-light font-mono text-xs font-bold shadow-vault-glow flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>ATTACK BLOCKED · ZERO-KNOWLEDGE SHIELD ACTIVE</span>
                </div>
              </div>
            )}

            {/* Header */}
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-vault-purple/30">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-vault-purple/20 border border-vault-purple/40 flex items-center justify-center text-vault-purple-light">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-sm text-white tracking-wider">
                      CLOAKBID
                    </h3>
                    <p className="text-[10px] font-mono text-vault-purple-light">
                      MIDNIGHT DUAL-STATE NETWORK
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  <Lock className="w-3.5 h-3.5" />
                  <span>100% SHIELDED</span>
                </div>
              </div>

              {/* Bid List with Cryptographically Hidden Amounts */}
              <div className="my-6 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-midnight-950/90 border border-vault-purple/20">
                  <span className="text-slate-300 font-semibold">Alice</span>
                  <span className="text-slate-500 font-bold text-sm tracking-widest">
                    ███████████
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-midnight-950/90 border border-vault-purple/20">
                  <span className="text-slate-300 font-semibold">Bob</span>
                  <span className="text-slate-500 font-bold text-sm tracking-widest">
                    ███████████
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-xl bg-midnight-950/90 border border-vault-purple/20">
                  <span className="text-slate-300 font-semibold">Charlie</span>
                  <span className="text-slate-500 font-bold text-sm tracking-widest">
                    ███████████
                  </span>
                </div>
              </div>
            </div>

            {/* Defense Guarantees */}
            <div className="space-y-2 pt-4 border-t border-vault-purple/30">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>✓ BID HIDDEN IN CLIENT WITNESS</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>✓ PRIVATE STATE UNREACHABLE BY ATTACKERS</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>✓ ZK PROOF VERIFIED WITHOUT DATA DISCLOSURE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
