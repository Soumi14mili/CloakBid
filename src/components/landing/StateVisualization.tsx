import React from 'react';
import { Lock, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const StateVisualization: React.FC = () => {
  const privateItems = [
    { label: 'Bid Amount', value: '████████', sub: 'Sealed in witness' },
    { label: 'Salt Value', value: '████████████', sub: '256-bit random' },
    { label: 'Wallet Identity', value: '████████████', sub: 'Shielded by ZK' },
    { label: 'Bid Strategy', value: '████████', sub: 'Never transmitted' },
  ];

  const publicItems = [
    { label: 'Commitment Hash', value: '0x7f3a...9d2e', verified: true },
    { label: 'Bid Count', value: '3 sealed bids', verified: true },
    { label: 'Block Timestamp', value: '1727258400', verified: true },
    { label: 'Reserve Met', value: 'PROOF VALID ✓', verified: true },
    { label: 'Settlement Result', value: 'Winner: 0xf4a2...8e31', verified: true },
  ];

  return (
    <section
      id="state"
      style={{ background: '#08090C' }}
      className="py-24"
    >
      <div className="max-w-content mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="eyebrow mb-4">PRIVATE STATE vs PUBLIC STATE</p>
          <h2 className="text-4xl font-bold tracking-tight text-cb-t1">
            What the protocol sees.<br />
            What the world sees.
          </h2>
          <p className="text-cb-t2 mt-4 text-[15px] leading-relaxed">
            Midnight separates private witness data (visible only to the bidder) from
            public on-chain state (visible to anyone). Zero-knowledge proofs bridge the two.
          </p>
        </div>

        {/* Two-column visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT — Private State */}
          <div className="card rounded-xl overflow-hidden">
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ background: 'rgba(8,9,12,0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(99,91,255,0.12)' }}
                >
                  <Lock className="w-4 h-4 text-cb-accent" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-cb-t1">Private Witness</p>
                  <p className="text-[11px] text-cb-t3">Visible only to bidder · Never transmitted</p>
                </div>
              </div>
              <span
                className="text-[11px] font-medium px-2.5 py-1 rounded-md"
                style={{ background: 'rgba(99,91,255,0.1)', color: '#9b97ff', border: '1px solid rgba(99,91,255,0.2)' }}
              >
                LOCAL ONLY
              </span>
            </div>

            {/* Private items */}
            <div className="px-6 py-5 space-y-1">
              {privateItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-3"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <div>
                    <p className="text-[13px] font-medium text-cb-t2">{item.label}</p>
                    <p className="text-[11px] text-cb-t3 mt-0.5">{item.sub}</p>
                  </div>
                  <span
                    className="font-mono text-[14px] tracking-[0.18em]"
                    style={{ color: 'rgba(255,255,255,0.18)' }}
                  >
                    {item.value}
                  </span>
                </div>
              ))}

              {/* Note at bottom */}
              <div
                className="mt-4 rounded-lg p-4 flex items-start gap-3"
                style={{ background: 'rgba(99,91,255,0.06)', border: '1px solid rgba(99,91,255,0.12)' }}
              >
                <Lock className="w-4 h-4 text-cb-accent mt-0.5 shrink-0" />
                <p className="text-[12px] text-cb-t2 leading-relaxed">
                  Private data is processed in the bidder&apos;s local environment.
                  The Compact ZK circuit produces a proof from this data without
                  exposing any of it on-chain.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT — Public State */}
          <div className="card rounded-xl overflow-hidden">
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ background: 'rgba(8,9,12,0.8)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(46,204,138,0.10)' }}
                >
                  <Eye className="w-4 h-4" style={{ color: '#2ECC8A' }} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-cb-t1">Public Ledger State</p>
                  <p className="text-[11px] text-cb-t3">Visible to anyone · Verifiable on Midnight</p>
                </div>
              </div>
              <span
                className="text-[11px] font-medium px-2.5 py-1 rounded-md"
                style={{ background: 'rgba(46,204,138,0.08)', color: '#2ECC8A', border: '1px solid rgba(46,204,138,0.18)' }}
              >
                ON-CHAIN
              </span>
            </div>

            {/* Public items */}
            <div className="px-6 py-5 space-y-1">
              {publicItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between py-3"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: '#2ECC8A' }} />
                    <p className="text-[13px] font-medium text-cb-t2">{item.label}</p>
                  </div>
                  <span className="font-mono text-[12px] text-cb-t1 text-right max-w-[160px] truncate">
                    {item.value}
                  </span>
                </div>
              ))}

              {/* Note at bottom */}
              <div
                className="mt-4 rounded-lg p-4 flex items-start gap-3"
                style={{ background: 'rgba(46,204,138,0.06)', border: '1px solid rgba(46,204,138,0.12)' }}
              >
                <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#2ECC8A' }} />
                <p className="text-[12px] text-cb-t2 leading-relaxed">
                  Public state contains commitment hashes and proof verification
                  results — not bid values. The result is auditable by any participant
                  without revealing the inputs that produced it.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom caption */}
        <p className="text-center text-[13px] text-cb-t3 mt-8 max-w-xl mx-auto">
          Private and public state are separated by design. Zero-knowledge proofs
          allow the protocol to verify properties of private data without
          revealing the data itself.
        </p>
      </div>
    </section>
  );
};
