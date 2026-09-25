import React from 'react';
import { FileCode2, Cpu, Wallet, Zap, BookOpen, ArrowRight } from 'lucide-react';

interface DevCard {
  icon: React.ElementType;
  title: string;
  body: string;
  link: string;
}

const DEV_CARDS: DevCard[] = [
  {
    icon: FileCode2,
    title: 'Smart Contracts',
    body: "Auction logic implemented in Compact — Midnight's ZK-native contract language. Deploy sealed-bid auctions with configurable reserve prices and proof requirements.",
    link: 'View contract source',
  },
  {
    icon: Cpu,
    title: 'ZK Circuits',
    body: 'Zero-knowledge circuits verify that bid commitments satisfy auction conditions without exposing underlying values. Built on Halo2 PLONKish arithmetic.',
    link: 'Explore circuit design',
  },
  {
    icon: Wallet,
    title: 'Wallet Integration',
    body: "Lace wallet integration for Midnight's preview network. Connect, sign, and submit sealed bids through a standard wallet interface.",
    link: 'Integration guide',
  },
  {
    icon: Zap,
    title: 'Auction APIs',
    body: 'React hooks for auction lifecycle management: initialization, bid commitment, proof submission, settlement, and state queries.',
    link: 'API reference',
  },
];

export const DeveloperSection: React.FC = () => {
  return (
    <section
      id="developers"
      style={{ backgroundColor: '#0D0F13' }}
      className="py-24"
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Eyebrow + Headline */}
        <p className="eyebrow">DEVELOPERS</p>
        <h2 className="text-4xl font-bold tracking-tight text-cb-t1 mt-3">
          Infrastructure for privacy-preserving auctions.
        </h2>
        <p className="text-cb-t2 mt-4 max-w-xl text-[15px] leading-relaxed">
          CloakBid provides smart contracts, ZK circuits, and integration
          patterns for building privacy-preserving auction applications on
          Midnight.
        </p>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
          {DEV_CARDS.map(({ icon: Icon, title, body, link }) => (
            <div key={title} className="card p-6 flex flex-col">
              {/* Icon */}
              <div className="bg-cb-elevated rounded-lg p-2.5 w-10 h-10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-cb-accent" />
              </div>

              {/* Title */}
              <h3 className="font-semibold text-cb-t1 mt-4 text-[15px]">
                {title}
              </h3>

              {/* Body */}
              <p className="text-cb-t2 text-[13px] leading-relaxed mt-2 flex-1">
                {body}
              </p>

              {/* Link */}
              <span className="mt-4 text-[13px] text-cb-t3 hover:text-cb-accent transition-colors cursor-pointer flex items-center gap-1 w-fit">
                {link}
                <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 flex flex-col items-center">
          <a
            href="https://github.com/Soumi14mili/CloakBid"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary btn-lg flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Read Documentation
          </a>
          <p className="text-cb-t3 text-[13px] mt-3 text-center">
            Smart contracts, ZK circuits, and integration guides on{' '}
            <a
              href="https://github.com/Soumi14mili/CloakBid"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cb-accent hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};
