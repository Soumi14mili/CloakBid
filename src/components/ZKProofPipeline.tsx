import React from 'react';
import {
  Lock,
  FileCode,
  Cpu,
  Shield,
  CheckCircle2,
  ArrowRight,
  ArrowDown,
} from 'lucide-react';
import type { CircuitStep } from '../types';

interface Props {
  circuitStep?: CircuitStep;
}

export const ZKProofPipeline: React.FC<Props> = ({ circuitStep = 'idle' }) => {
  const getActiveIndex = (): number => {
    switch (circuitStep) {
      case 'idle':
        return -1;
      case 'reading-witness':
        return 0; // PRIVATE BID
      case 'hashing':
        return 1; // COMMITMENT
      case 'proving':
        return 2; // ZK PROOF
      case 'submitting':
        return 3; // VERIFICATION
      case 'confirmed':
        return 4; // SEALED BID
      default:
        return -1;
    }
  };

  const activeIndex = getActiveIndex();
  const isProving = circuitStep !== 'idle';

  const stages = [
    {
      title: 'PRIVATE BID',
      icon: Lock,
      desc: 'Formulated in client RAM. Never broadcast over network.',
      status: 'CLIENT WITNESS',
    },
    {
      title: 'COMMITMENT',
      icon: FileCode,
      desc: '256-bit Pedersen hash binds valuation without exposure.',
      status: 'SHA-256 / PEDERSEN',
    },
    {
      title: 'ZK PROOF',
      icon: Cpu,
      desc: 'PLONK circuit proves amount >= reserve constraint.',
      status: 'HALO2 / PLONK',
    },
    {
      title: 'VERIFICATION',
      icon: Shield,
      desc: 'Midnight node validates mathematical proof in <100ms.',
      status: 'LEDGER CONSENSUS',
    },
    {
      title: 'SEALED BID',
      icon: CheckCircle2,
      desc: 'Bid locked into escrow pool. Losers never disclosed.',
      status: 'CONFIRMED ✓',
    },
  ];

  return (
    <section className="relative py-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-10 space-y-2">
          <p className="text-[11px] font-mono tracking-wider text-vault-purple-light uppercase">
            PROOF LIFECYCLE
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            ZERO-KNOWLEDGE PROOF PIPELINE
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            How Midnight cryptographically verifies bid validity while preserving absolute confidentiality.
          </p>
        </div>

        {/* 5-Stage Pipeline Container */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isLast = idx === stages.length - 1;
            const isCurrentActive = isProving && activeIndex === idx;
            const isPast = activeIndex > idx || (!isProving && idx === 4);

            return (
              <div key={idx} className="relative group">
                {/* Stage Card */}
                <div
                  className={`h-full vault-card p-4 flex flex-col justify-between transition-all duration-200 ${
                    isCurrentActive
                      ? 'border-vault-purple/50 bg-vault-purple/10 shadow-sm'
                      : isPast
                      ? 'border-emerald-500/20 bg-white/[0.02]'
                      : 'border-white/[0.06] bg-white/[0.01]'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header: Status Tag & Index */}
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400">0{idx + 1}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded ${
                          isCurrentActive
                            ? 'bg-vault-purple/20 text-vault-purple-light border border-vault-purple/30'
                            : isPast
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        {stage.status}
                      </span>
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center ${
                          isCurrentActive
                            ? 'bg-vault-purple text-white'
                            : isPast
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-white/5 text-slate-400'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-xs font-semibold text-white tracking-wide">
                        {stage.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>

                  {/* Verification indicator */}
                  <div className="mt-3 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Security</span>
                    <span className="text-slate-300 font-medium">100% Confidential</span>
                  </div>
                </div>

                {/* Arrow Connector for Desktop */}
                {!isLast && (
                  <div className="hidden md:flex absolute top-1/2 -right-2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-midnight-900 border border-white/10 items-center justify-center text-slate-500">
                    <ArrowRight className="w-2.5 h-2.5 text-slate-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
