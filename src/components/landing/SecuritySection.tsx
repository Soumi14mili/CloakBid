import React from 'react';
import { LockKeyhole, ShieldCheck, Database } from 'lucide-react';

interface SecurityCard {
  eyebrow: string;
  icon: React.ReactNode;
  headline: string;
  body: string;
  footerLabel: string;
  highlighted?: boolean;
}

const cards: SecurityCard[] = [
  {
    eyebrow: 'CONFIDENTIAL BIDDING',
    icon: <LockKeyhole className="w-8 h-8 text-cb-accent" />,
    headline: 'Bid values remain private',
    body: "Bid amounts are processed entirely within the bidder's local environment. The Midnight protocol is designed so that only commitment hashes — not bid values — are posted on-chain.",
    footerLabel: 'Designed for confidentiality',
  },
  {
    eyebrow: 'ZERO-KNOWLEDGE VERIFICATION',
    icon: <ShieldCheck className="w-8 h-8 text-cb-accent" />,
    headline: 'Verify without revealing',
    body: 'Zero-knowledge proofs allow the protocol to verify that a bid satisfies required conditions — such as meeting the reserve price — without exposing the underlying bid value to any party.',
    footerLabel: 'ZK proofs via Halo2 / Compact',
    highlighted: true,
  },
  {
    eyebrow: 'ON-CHAIN SETTLEMENT',
    icon: <Database className="w-8 h-8 text-cb-accent" />,
    headline: 'Transparent outcomes',
    body: 'Auction state transitions and settlement results are recorded on the Midnight ledger. The outcome is publicly auditable even when the inputs remained private.',
    footerLabel: 'Settled on Midnight Network',
  },
];

export const SecuritySection: React.FC = () => {
  return (
    <section
      id="security"
      className="py-24"
      style={{ backgroundColor: '#0D0F13' }}
    >
      <div className="max-w-content mx-auto px-6">
        {/* Header */}
        <div>
          <p className="eyebrow">SECURITY</p>
          <h2 className="text-4xl font-bold tracking-tight text-cb-t1 mt-3">
            Privacy is part of the auction architecture.
          </h2>
          <p className="text-cb-t2 mt-4 max-w-2xl leading-relaxed">
            CloakBid is designed to keep bid values confidential and auction results verifiable.
            These properties are enforced by the protocol, not by trust assumptions.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
          {cards.map((card) => (
            <div
              key={card.eyebrow}
              className={`card p-7 flex flex-col${
                card.highlighted
                  ? ' border border-cb-accent/20'
                  : ''
              }`}
            >
              <p className="eyebrow">{card.eyebrow}</p>

              <div className="mt-4">{card.icon}</div>

              <h3 className="text-xl font-semibold text-cb-t1 mt-4">
                {card.headline}
              </h3>

              <p className="text-cb-t2 text-sm leading-relaxed mt-3 flex-1">
                {card.body}
              </p>

              <div className="border-t border-white/5 mt-5 pt-4">
                <span className="text-[13px] text-cb-t3">{card.footerLabel}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-[12px] text-cb-t3 italic mt-10 max-w-2xl leading-relaxed">
          Note: CloakBid is a protocol under active development. The properties described
          represent design goals of the system architecture. Independent security audits
          are planned.
        </p>
      </div>
    </section>
  );
};
