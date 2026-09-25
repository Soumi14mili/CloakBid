import React from 'react';
import { ExternalLink } from 'lucide-react';

const stackItems = [
  { name: 'Midnight Network', desc: 'Layer 1 Blockchain' },
  { name: 'Compact Language', desc: 'Smart Contract DSL' },
  { name: 'Zero-Knowledge Proofs', desc: 'Halo2 / PLONKish' },
  { name: 'Private State', desc: 'Client-side witness' },
  { name: 'Public Ledger', desc: 'On-chain settlement' },
];

export const MidnightSection: React.FC = () => {
  return (
    <section
      id="midnight"
      className="py-24"
      style={{ backgroundColor: '#08090C' }}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* LEFT — 60% */}
          <div className="lg:w-[60%]">
            <p className="eyebrow">INFRASTRUCTURE</p>

            <h2 className="text-4xl font-bold tracking-tight text-cb-t1 mt-3">
              Built on privacy-first infrastructure.
            </h2>

            <p className="text-cb-t2 mt-4 leading-relaxed max-w-lg text-[15px]">
              Midnight is a Layer 1 blockchain designed specifically for
              privacy-preserving computation. It combines a public ledger for
              transparent settlement with private state for confidential inputs,
              using zero-knowledge proofs to bridge the two.
            </p>

            <p className="text-cb-t2 mt-3 text-[15px]">
              CloakBid&apos;s smart contracts are written in Compact —
              Midnight&apos;s native ZK-aware contract language — and compiled
              to verifiable circuit logic.
            </p>

            <a
              href="https://midnight.network"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary btn-lg mt-8 inline-flex items-center gap-2"
            >
              Explore Midnight
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* RIGHT — 40% */}
          <div className="lg:w-[40%]">
            <div className="card-elevated p-6 rounded-xl">
              <p className="text-[13px] font-semibold text-cb-t1 mb-5">
                Protocol Stack
              </p>

              <ul>
                {stackItems.map((item, index) => (
                  <li
                    key={item.name}
                    className={`flex items-center gap-3 py-3 ${
                      index < stackItems.length - 1
                        ? 'border-b border-[rgba(255,255,255,0.05)]'
                        : ''
                    }`}
                  >
                    {/* Accent dot */}
                    <span className="w-2 h-2 rounded-full bg-cb-accent shrink-0" />

                    {/* Layer label + name */}
                    <div>
                      <p className="text-[11px] text-cb-t3 uppercase tracking-widest">
                        LAYER
                      </p>
                      <p className="text-[14px] font-medium text-cb-t1">
                        {item.name}
                      </p>
                    </div>

                    {/* Description */}
                    <span className="text-[12px] text-cb-t3 ml-auto whitespace-nowrap">
                      {item.desc}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Divider + contract hash */}
              <div className="border-t border-[rgba(255,255,255,0.05)] mt-4">
                <p className="mono text-[11px] text-cb-t3 mt-4 truncate">
                  Contract: 0x51d23a07eec0e7d2c94aceeb613e414900dcfb5a6ad18f3459875f733f6d8b15
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
