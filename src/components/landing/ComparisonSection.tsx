import React from 'react';
import { Eye, Lock, AlertTriangle, ShieldCheck } from 'lucide-react';

const BIDDERS = [
  { initial: 'A', label: 'Bidder A', amount: '12.5 ETH' },
  { initial: 'B', label: 'Bidder B', amount: '15.0 ETH' },
  { initial: 'C', label: 'Bidder C', amount: '11.2 ETH' },
];

export const ComparisonSection: React.FC = () => {
  return (
    <section
      className="py-24"
      style={{ backgroundColor: '#0D0F13' }}
    >
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center">
          <p className="eyebrow">COMPARISON</p>
          <h2 className="text-4xl font-bold tracking-tight text-cb-t1 mt-3">
            Sealed bids. Verifiable outcomes.
          </h2>
          <p className="text-cb-t2 mt-4 max-w-xl mx-auto">
            See the structural difference between public and private auction architectures.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-14">

          {/* LEFT — Traditional Auction */}
          <div className="card p-7 rounded-xl border border-orange-900/30">

            {/* Card Header */}
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold text-cb-t1">Traditional Auction</span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border bg-red-950/40 text-red-400 border-red-900/40">
                <Eye className="w-3 h-3" />
                PUBLIC
              </span>
            </div>

            {/* Bidder Rows */}
            <div className="flex flex-col gap-3">
              {BIDDERS.map(({ initial, label, amount }) => (
                <div
                  key={initial}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg"
                  style={{ backgroundColor: 'rgba(255,255,255,0.025)' }}
                >
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-full bg-cb-elevated flex items-center justify-center flex-shrink-0 text-xs font-mono text-cb-t2">
                    {initial}
                  </div>

                  {/* Label */}
                  <span className="text-cb-t2 text-sm flex-1">{label}</span>

                  {/* Bid Amount — Plaintext */}
                  <span className="font-mono text-sm font-semibold text-cb-t1">
                    {amount}
                  </span>

                  {/* Public visibility indicator */}
                  <Eye className="w-3 h-3 text-cb-warning flex-shrink-0" />
                </div>
              ))}
            </div>

            {/* Visibility Warning */}
            <div className="mt-5 pt-4 border-t border-orange-900/20">
              <p className="label text-cb-t3 mb-2">VISIBILITY: PUBLIC</p>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-cb-warning flex-shrink-0 mt-px" />
                <span className="text-cb-warning text-sm">
                  All bid values visible to all participants
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT — CloakBid */}
          <div className="card p-7 rounded-xl border border-cb-accent/20">

            {/* Card Header */}
            <div className="flex items-center justify-between mb-6">
              <span className="font-semibold text-cb-t1">CloakBid</span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border bg-green-950/40 text-cb-success border-green-900/40">
                <Lock className="w-3 h-3" />
                PRIVATE
              </span>
            </div>

            {/* Bidder Rows */}
            <div className="flex flex-col gap-3">
              {BIDDERS.map(({ initial, label }) => (
                <div
                  key={initial}
                  className="flex items-center gap-3 py-2.5 px-3 rounded-lg"
                  style={{ backgroundColor: 'rgba(255,255,255,0.025)' }}
                >
                  {/* Avatar */}
                  <div className="w-7 h-7 rounded-full bg-cb-elevated flex items-center justify-center flex-shrink-0 text-xs font-mono text-cb-t2">
                    {initial}
                  </div>

                  {/* Label */}
                  <span className="text-cb-t2 text-sm flex-1">{label}</span>

                  {/* Bid Amount — Masked */}
                  <span className="font-mono text-cb-t3 tracking-widest text-sm select-none">
                    █████
                  </span>

                  {/* Lock indicator */}
                  <Lock className="w-3 h-3 text-cb-success flex-shrink-0" />
                </div>
              ))}
            </div>

            {/* Visibility — Private */}
            <div className="mt-5 pt-4 border-t border-cb-accent/10">
              <p className="label text-cb-t3 mb-2">VISIBILITY: PRIVATE</p>
              <div className="flex items-start gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-cb-success flex-shrink-0 mt-px" />
                <span className="text-cb-success text-sm">
                  Bid values remain private to each participant
                </span>
              </div>

              {/* ZK Verified Badge */}
              <span className="inline-flex items-center px-3 py-1 rounded-md text-[13px] font-semibold bg-cb-success/10 text-cb-success border border-cb-success/20">
                ZK VERIFIED ✓
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <p className="text-[12px] text-cb-t3 italic mt-6 text-center">
          CloakBid is designed to keep bid values confidential. Outcomes are determined by the protocol and verifiable on-chain.
        </p>

      </div>
    </section>
  );
};
