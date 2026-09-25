import React from 'react';
import { ArrowRight, ExternalLink } from 'lucide-react';

interface Props {
  onEnterApp: () => void;
}

export const FinalCTA: React.FC<Props> = ({ onEnterApp }) => {
  return (
    <section className="relative overflow-hidden py-32">
      {/* Subtle radial accent glow — pointer-events disabled so it never blocks clicks */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(99,91,255,0.07) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center px-5">
        {/* Headline */}
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-cb-t1">
          <div>YOUR NEXT AUCTION</div>
          <div>DOESN&apos;T NEED TO</div>
          <div className="gradient-text">REVEAL EVERYTHING.</div>
        </h2>

        {/* Supporting copy */}
        <p className="mt-8 text-cb-t2 text-lg max-w-2xl mx-auto leading-relaxed">
          Build auctions where confidentiality and verifiability work together.
          No trust assumptions required.
        </p>

        {/* CTA buttons */}
        <div className="flex justify-center gap-4 mt-12 flex-wrap">
          <button
            className="btn-primary btn-lg"
            onClick={onEnterApp}
          >
            Create an Auction
            <ArrowRight size={18} />
          </button>

          <a
            href="https://midnight.network"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost btn-lg"
          >
            Explore Midnight
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Deployment note */}
        <p className="mt-8 text-cb-t3 text-[13px]">
          Deployed on Midnight Preview ·{' '}
          <span className="mono">51d23a07...8b15</span>
        </p>
      </div>
    </section>
  );
};
