import React from 'react';
import { PenLine, Lock, Cpu, ShieldCheck, Trophy } from 'lucide-react';

interface Step {
  num: string;
  title: string;
  desc: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const steps: Step[] = [
  {
    num: '01',
    title: 'Place Bid',
    desc: 'Enter your private bid value. The amount is processed locally and never transmitted in plaintext.',
    icon: PenLine,
  },
  {
    num: '02',
    title: 'Seal',
    desc: 'Your bid is cryptographically committed — bound to a unique salt and hashed into an unforgeable commitment.',
    icon: Lock,
  },
  {
    num: '03',
    title: 'Prove',
    desc: 'A zero-knowledge proof certifies your bid satisfies the required conditions without exposing the value.',
    icon: Cpu,
  },
  {
    num: '04',
    title: 'Verify',
    desc: 'The Midnight smart contract verifies proof validity and records the sealed commitment on-chain.',
    icon: ShieldCheck,
  },
  {
    num: '05',
    title: 'Settle',
    desc: 'The highest valid bid is determined and the auction is finalized. Only the winner is revealed.',
    icon: Trophy,
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section
      id="how-it-works"
      className="py-24"
      style={{ backgroundColor: '#08090C' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <p className="eyebrow">HOW IT WORKS</p>
        <h2 className="text-4xl font-bold tracking-tight text-cb-t1 mt-3">
          Five steps to a private, verifiable auction.
        </h2>
        <p className="text-cb-t2 mt-4 max-w-xl leading-relaxed">
          CloakBid coordinates sealed bidding through a sequence of cryptographic
          operations, each building on the last.
        </p>

        {/* ── Desktop: horizontal stepper ── */}
        <div className="hidden md:flex mt-16 items-start">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isFirst = idx === 0;
            const isLast = idx === steps.length - 1;

            return (
              <div key={step.num} className="flex flex-1 flex-col items-start min-w-0">
                {/* Row: number pill + connector line */}
                <div className="flex items-center w-full">
                  {/* Number pill */}
                  <div
                    className={[
                      'flex-shrink-0 w-9 h-9 rounded-full border flex items-center justify-center text-[13px] font-mono font-semibold transition-colors',
                      isFirst
                        ? 'bg-cb-accent border-cb-accent text-white'
                        : 'bg-cb-elevated border-[rgba(255,255,255,0.09)] text-cb-t2',
                    ].join(' ')}
                  >
                    {step.num}
                  </div>

                  {/* Dashed connector (hidden for last step) */}
                  {!isLast && (
                    <div className="flex-1 border-t border-dashed border-[rgba(255,255,255,0.09)] mx-3" />
                  )}
                </div>

                {/* Step content */}
                <div className={!isLast ? 'pr-4' : ''}>
                  <Icon className="w-5 h-5 text-cb-t2 mt-5 mb-3" strokeWidth={1.5} />
                  <p className="font-semibold text-cb-t1 text-[15px]">{step.title}</p>
                  <p className="text-cb-t2 text-[13px] leading-relaxed mt-1">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Mobile: vertical stepper ── */}
        <div className="flex flex-col md:hidden mt-12 gap-0">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isFirst = idx === 0;
            const isLast = idx === steps.length - 1;

            return (
              <div key={step.num} className="flex items-start gap-4">
                {/* Left: number pill + vertical line */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={[
                      'w-9 h-9 rounded-full border flex items-center justify-center text-[13px] font-mono font-semibold transition-colors',
                      isFirst
                        ? 'bg-cb-accent border-cb-accent text-white'
                        : 'bg-cb-elevated border-[rgba(255,255,255,0.09)] text-cb-t2',
                    ].join(' ')}
                  >
                    {step.num}
                  </div>
                  {!isLast && (
                    <div className="flex-1 w-px border-l border-dashed border-[rgba(255,255,255,0.09)] my-2 min-h-[48px]" />
                  )}
                </div>

                {/* Right: content */}
                <div className={['pb-8 min-w-0', isLast ? 'pb-0' : ''].join(' ')}>
                  <Icon className="w-5 h-5 text-cb-t2 mb-2 mt-1" strokeWidth={1.5} />
                  <p className="font-semibold text-cb-t1 text-[15px]">{step.title}</p>
                  <p className="text-cb-t2 text-[13px] leading-relaxed mt-1">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
