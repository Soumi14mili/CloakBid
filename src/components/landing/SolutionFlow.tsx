import React from 'react';
import {
  LockKeyhole,
  Hash,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

interface Stage {
  icon: React.ElementType;
  label: string;
  desc: string;
}

const stages: Stage[] = [
  {
    icon: LockKeyhole,
    label: 'PRIVATE BID',
    desc: 'Bidder enters valuation locally. Value never leaves the browser.',
  },
  {
    icon: Hash,
    label: 'COMMITMENT',
    desc: 'Bid is sealed with a cryptographic Poseidon hash.',
  },
  {
    icon: Cpu,
    label: 'ZK PROOF',
    desc: 'A zero-knowledge proof certifies the bid meets required conditions.',
  },
  {
    icon: ShieldCheck,
    label: 'VERIFICATION',
    desc: 'The protocol verifies proof validity on-chain.',
  },
  {
    icon: CheckCircle2,
    label: 'SETTLEMENT',
    desc: 'Auction result is finalized and recorded on Midnight.',
  },
];

export const SolutionFlow: React.FC = () => {
  return (
    <section
      id="product"
      className="py-24"
      style={{ backgroundColor: '#0D0F13' }}
    >
      <div className="section">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <span className="eyebrow">The Solution</span>

          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-cb-t1 mt-4 max-w-3xl">
            Keep the bid private.{' '}
            <span className="text-cb-t1">Keep the result verifiable.</span>
          </h2>

          <p className="text-cb-t2 mt-4 max-w-2xl text-base leading-relaxed">
            CloakBid uses privacy-preserving cryptography and zero-knowledge
            verification to enable sealed bidding while maintaining
            cryptographically verifiable auction outcomes.
          </p>
        </div>

        {/* Flow */}
        <div className="mt-16">
          {/* Desktop: horizontal row */}
          <div className="hidden md:flex items-start gap-3">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isFirst = index === 0;
              const isLast = index === stages.length - 1;
              const stageNumber = String(index + 1).padStart(2, '0');

              return (
                <React.Fragment key={stage.label}>
                  {/* Stage Card */}
                  <div
                    className={[
                      'card flex-1 p-5 flex flex-col',
                      isFirst ? 'border-t-2 border-cb-accent' : '',
                      isLast ? 'border border-cb-success/20' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {/* Stage number */}
                    <span className="text-[11px] text-cb-t3 font-mono">
                      {stageNumber}
                    </span>

                    {/* Icon */}
                    <div className="bg-cb-elevated rounded-lg w-9 h-9 flex items-center justify-center mt-2">
                      <Icon size={16} className="text-cb-t2" />
                    </div>

                    {/* Label */}
                    <span className="text-[13px] font-semibold text-cb-t1 mt-3 tracking-wide">
                      {stage.label}
                    </span>

                    {/* Description */}
                    <p className="text-[13px] text-cb-t2 mt-1 leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>

                  {/* Arrow between cards */}
                  {index < stages.length - 1 && (
                    <div className="flex items-center pt-10 shrink-0">
                      <ChevronRight size={16} className="text-cb-t3" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Mobile: vertical stack */}
          <div className="flex flex-col gap-3 md:hidden">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isFirst = index === 0;
              const isLast = index === stages.length - 1;
              const stageNumber = String(index + 1).padStart(2, '0');

              return (
                <React.Fragment key={stage.label}>
                  {/* Stage Card */}
                  <div
                    className={[
                      'card p-5 flex flex-col',
                      isFirst ? 'border-t-2 border-cb-accent' : '',
                      isLast ? 'border border-cb-success/20' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    {/* Stage number */}
                    <span className="text-[11px] text-cb-t3 font-mono">
                      {stageNumber}
                    </span>

                    {/* Icon */}
                    <div className="bg-cb-elevated rounded-lg w-9 h-9 flex items-center justify-center mt-2">
                      <Icon size={16} className="text-cb-t2" />
                    </div>

                    {/* Label */}
                    <span className="text-[13px] font-semibold text-cb-t1 mt-3 tracking-wide">
                      {stage.label}
                    </span>

                    {/* Description */}
                    <p className="text-[13px] text-cb-t2 mt-1 leading-relaxed">
                      {stage.desc}
                    </p>
                  </div>

                  {/* Down arrow between cards */}
                  {index < stages.length - 1 && (
                    <div className="flex justify-center">
                      <ChevronDown size={16} className="text-cb-t3" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
