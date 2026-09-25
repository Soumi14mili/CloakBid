import React from 'react';
import { ArrowRight, Lock, ShieldCheck, CheckCircle2, Clock, Gavel } from 'lucide-react';

interface Props {
  onEnterApp: () => void;
}

export const ProductPreview: React.FC<Props> = ({ onEnterApp }) => {
  // Mock auction cards for the preview
  const previewAuctions = [
    {
      id: 1,
      title: 'Meridian Penthouse Suite 4A',
      category: 'Real Estate',
      status: 'LIVE',
      bids: 3,
      timeLeft: '14h 23m',
      reserveDisplay: 'Reserve: Confidential',
    },
    {
      id: 2,
      title: 'Series A Term Sheet Rights',
      category: 'Corporate Finance',
      status: 'LIVE',
      bids: 7,
      timeLeft: '6h 52m',
      reserveDisplay: 'Reserve: Confidential',
    },
    {
      id: 3,
      title: 'Sovereign Digital Asset Bundle',
      category: 'Digital Assets',
      status: 'LIVE',
      bids: 5,
      timeLeft: '2d 1h',
      reserveDisplay: 'Reserve: Confidential',
    },
  ];

  return (
    <section
      id="product-preview"
      style={{ background: '#0D0F13' }}
      className="py-24"
    >
      <div className="max-w-content mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="eyebrow mb-4">PRODUCT</p>
            <h2 className="text-4xl font-bold tracking-tight text-cb-t1">
              The auction protocol,<br />in action.
            </h2>
            <p className="text-cb-t2 mt-4 max-w-md text-[15px] leading-relaxed">
              Active sealed-bid auctions running on Midnight Preview.
              Bids are private. Results are verifiable.
            </p>
          </div>
          <button onClick={onEnterApp} className="btn-primary flex items-center gap-2 shrink-0">
            Enter the Protocol
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* App shell mockup */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.07)', background: '#12151B' }}
        >
          {/* App bar */}
          <div
            className="px-5 py-3 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,9,12,0.7)' }}
          >
            {/* Fake browser chrome */}
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)' }} />
            </div>
            <div
              className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md text-[12px] font-mono text-cb-t3"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              soumi14mili.github.io/CloakBid
            </div>
            <div className="flex items-center gap-2">
              <div className="badge-live text-[11px]">Midnight Preview</div>
            </div>
          </div>

          {/* App nav inside mockup */}
          <div
            className="px-6 py-3 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
          >
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cb-accent" />
                <span className="text-[13px] font-semibold text-cb-t1">CloakBid</span>
              </div>
              <div className="hidden md:flex items-center gap-1 tab-bar py-0.5 px-0.5">
                {['Auctions', 'My Bids', 'Create', 'Analytics'].map((tab, i) => (
                  <span key={tab} className={`tab text-[12px] py-1 px-3 ${i === 0 ? 'active' : ''}`}>
                    {tab}
                  </span>
                ))}
              </div>
            </div>
            <div
              className="text-[11px] font-mono text-cb-t3 hidden sm:block"
              style={{
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '6px',
                padding: '4px 10px',
              }}
            >
              mn_addr_...z4dns0wg4jd
            </div>
          </div>

          {/* Content area */}
          <div className="p-6">
            {/* Mini KPI strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Active Auctions', value: '3' },
                { label: 'Wallet Balance', value: '49,384 tDUST' },
                { label: 'My Committed Bids', value: '1' },
                { label: 'ZK Proofs Generated', value: '12' },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-lg p-3"
                  style={{ background: 'rgba(8,9,12,0.5)', border: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <p className="text-[11px] text-cb-t3 uppercase tracking-wider">{kpi.label}</p>
                  <p className="text-[16px] font-semibold text-cb-t1 mt-1 tracking-tight">{kpi.value}</p>
                </div>
              ))}
            </div>

            {/* Filter row */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                {['All', 'Live', 'Settled'].map((f, i) => (
                  <span
                    key={f}
                    className="text-[12px] px-3 py-1 rounded-md font-medium cursor-pointer"
                    style={{
                      background: i === 0 ? 'rgba(255,255,255,0.07)' : 'transparent',
                      color: i === 0 ? '#F5F7FA' : '#646B78',
                    }}
                  >
                    {f}
                  </span>
                ))}
              </div>
              <span className="text-[12px] text-cb-t3">3 active</span>
            </div>

            {/* Auction cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {previewAuctions.map((auction) => (
                <div
                  key={auction.id}
                  className="rounded-xl overflow-hidden cursor-pointer"
                  style={{
                    background: '#0D0F13',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  {/* Card image area placeholder */}
                  <div
                    className="h-24 flex items-center justify-center"
                    style={{
                      background: `linear-gradient(135deg, rgba(99,91,255,0.07), rgba(18,21,27,0.9))`,
                    }}
                  >
                    <Gavel className="w-8 h-8" style={{ color: 'rgba(99,91,255,0.3)' }} />
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="badge-live text-[10px]">{auction.status}</span>
                      <span className="text-[11px] text-cb-t3 font-mono">{auction.category}</span>
                    </div>
                    <h4 className="text-[13px] font-semibold text-cb-t1 leading-snug mt-2 line-clamp-2">
                      {auction.title}
                    </h4>

                    <div
                      className="flex items-center justify-between mt-3 pt-3"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                    >
                      <div className="flex items-center gap-1 text-[11px] text-cb-t3">
                        <Clock className="w-3 h-3" />
                        {auction.timeLeft}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-cb-t3">
                        <Lock className="w-3 h-3" />
                        {auction.bids} sealed
                      </div>
                    </div>

                    {/* Masked bid info */}
                    <div
                      className="mt-3 rounded-lg px-3 py-2 flex items-center justify-between"
                      style={{ background: 'rgba(255,255,255,0.03)' }}
                    >
                      <span className="text-[11px] text-cb-t3">Bids</span>
                      <span className="font-mono text-[12px] tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
                        ████████
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA inside mockup */}
            <div className="flex items-center justify-center mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <button
                onClick={onEnterApp}
                className="btn-primary flex items-center gap-2"
              >
                Enter the Live Protocol
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Privacy note below */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <ShieldCheck className="w-4 h-4" style={{ color: '#2ECC8A' }} />
          <p className="text-[13px] text-cb-t3">
            All bid values sealed with zero-knowledge proofs. Settlement results are on-chain and verifiable.
          </p>
          <CheckCircle2 className="w-4 h-4" style={{ color: '#2ECC8A' }} />
        </div>
      </div>
    </section>
  );
};
