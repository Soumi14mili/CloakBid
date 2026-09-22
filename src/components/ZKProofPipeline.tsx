import React from 'react';
import {
  Lock,
  Key,
  FileCode,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Shield,
  Sparkles,
} from 'lucide-react';

export const ZKProofPipeline: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'PRIVATE BID',
      icon: Lock,
      badge: 'Local Client',
      badgeColor: 'text-vault-purple-light bg-vault-purple/10 border-vault-purple/30',
      dataPreview: 'AMOUNT: 1,500 tDUST',
      subtitle: 'Stored solely in local browser memory. Never broadcast to RPC nodes or miners.',
      privacyNote: 'Zero network disclosure',
    },
    {
      num: '02',
      title: 'ENCRYPT',
      icon: Key,
      badge: 'Salt Blinding',
      badgeColor: 'text-cipher-teal bg-cipher-teal/10 border-cipher-teal/30',
      dataPreview: 'SALT: 0x9f4a...2c8e',
      subtitle: '256-bit cryptographic entropy combined with bid amount using SHA-256 trapdoor.',
      privacyNote: 'Unbreakable preimage protection',
    },
    {
      num: '03',
      title: 'COMMITMENT',
      icon: FileCode,
      badge: 'Pedersen / Hash',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      dataPreview: 'HASH: 0x3e8b...1f09',
      subtitle: 'Public commitment hash generated. Mathematically binds the bid without leaking value.',
      privacyNote: 'Binding & hiding guarantee',
    },
    {
      num: '04',
      title: 'ZK PROOF',
      icon: Cpu,
      badge: 'Halo2 / PLONK',
      badgeColor: 'text-vault-purple-light bg-vault-purple/10 border-vault-purple/30',
      dataPreview: 'PROOF: π_zk (valid >= reserve)',
      subtitle: 'Arithmetic circuit generates zero-knowledge proof that bid meets reserve and balance rules.',
      privacyNote: 'Computable without witness exposure',
    },
    {
      num: '05',
      title: 'VERIFIED ✓',
      icon: CheckCircle2,
      badge: 'Midnight Preprod',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      dataPreview: 'LEDGER: CONFIRMED ✓',
      subtitle: 'On-chain smart contract verifies proof in <100ms. Bid placed into sealed auction vault.',
      privacyNote: 'Consensus verified, 100% private',
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-vault-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-midnight-900/90 border border-vault-purple/30 text-[11px] font-mono text-vault-purple-light">
            <Sparkles className="w-3.5 h-3.5 text-vault-purple" />
            <span>CRYPTOGRAPHIC INTEGRITY</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            <span className="gradient-text-purple">ZERO-KNOWLEDGE VERIFICATION</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            How Midnight verifies your bid meets all auction constraints without ever disclosing a single digit of your actual bid value to anyone.
          </p>
        </div>

        {/* 5-Step Pipeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isLast = idx === steps.length - 1;

            return (
              <div key={idx} className="relative group">
                {/* Pipeline Card */}
                <div className="h-full vault-card p-5 flex flex-col justify-between border-white/5 group-hover:border-vault-purple/40 group-hover:shadow-vault-subtle transition-all duration-300">
                  <div className="space-y-3">
                    {/* Header: Number & Badge */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-500 group-hover:text-vault-purple-light transition-colors">
                        {step.num}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${step.badgeColor}`}>
                        {step.badge}
                      </span>
                    </div>

                    {/* Step Icon & Title */}
                    <div className="flex items-center gap-2.5 pt-1">
                      <div className="w-8 h-8 rounded-lg bg-midnight-900 border border-white/10 flex items-center justify-center text-slate-200 group-hover:text-vault-purple-light group-hover:border-vault-purple/40 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-white tracking-wide">
                        {step.title}
                      </h3>
                    </div>

                    {/* Data Preview Pill */}
                    <div className="p-2 rounded-lg bg-midnight-950/80 border border-white/5 font-mono text-[11px] text-slate-300 truncate">
                      {step.dataPreview}
                    </div>

                    {/* Description */}
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {step.subtitle}
                    </p>
                  </div>

                  {/* Privacy Guarantee Note */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                    <Shield className="w-3 h-3 flex-shrink-0" />
                    <span>{step.privacyNote}</span>
                  </div>
                </div>

                {/* Animated Arrow Connector (Desktop) */}
                {!isLast && (
                  <div className="hidden md:flex absolute top-1/2 -right-3 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-midnight-900 border border-white/10 items-center justify-center text-slate-500 shadow-lg">
                    <ArrowRight className="w-3 h-3 text-vault-purple-light" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Technical Callout Footer */}
        <div className="mt-12 p-4 rounded-xl bg-midnight-900/60 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cipher-teal" />
            <span>Witness generation happens entirely client-side via Compact / WASM runtime.</span>
          </div>
          <span className="text-slate-500">Zero Trusted Setup required · Universal Verification</span>
        </div>
      </div>
    </section>
  );
};
