import React, { useEffect, useRef, useState } from 'react';
import {
  Gavel,
  Lock,
  Shield,
  TrendingUp,
  ChevronRight,
  Cpu,
  Eye,
  Radio,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { AuctionConfig, LedgerState } from '../types';
import { useCountdown } from '../hooks/useCountdown';
import { soundFx } from '../utils/audio';

interface Props {
  config: AuctionConfig;
  lots: AuctionConfig[];
  selectedLotId: string;
  onSelectLot: (id: string) => void;
  ledgerState: LedgerState;
  onOpenBid: () => void;
  onOpenVault: () => void;
}

const TimeDigit: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="relative">
      <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 glass-card-gold flex items-center justify-center rounded-2xl">
        <span className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-neon-gold tabular-nums">{value}</span>
      </div>
      <div className="absolute inset-0 rounded-2xl border border-auction-gold/30 animate-bid-pulse" />
    </div>
    <span className="text-[10px] font-mono text-slate-500 mt-1.5 uppercase tracking-widest">{label}</span>
  </div>
);

export const AuctionHero: React.FC<Props> = ({
  config,
  lots,
  selectedLotId,
  onSelectLot,
  ledgerState,
  onOpenBid,
  onOpenVault,
}) => {
  const countdown = useCountdown(config.endTime);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [revealed, setRevealed] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 150);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleLotChange = (id: string) => {
    if (soundEnabled) soundFx.playClick();
    onSelectLot(id);
  };

  const rarityColors = {
    GENESIS: 'from-amber-500/20 to-yellow-600/20 text-auction-gold border-auction-gold/40',
    CLASSIFIED: 'from-purple-500/20 to-indigo-600/20 text-vault-purple-light border-vault-purple/40',
    MYTHIC: 'from-cyan-500/20 to-teal-600/20 text-cipher-teal border-cipher-teal/40',
  };

  return (
    <section
      className="relative min-h-[90vh] flex flex-col justify-center overflow-hidden auction-grid-bg py-6"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient background volumetric glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[700px] rounded-full bg-auction-gold/5 blur-[140px] animate-glow-breathe" />
        <div
          className="absolute w-[500px] h-[500px] rounded-full bg-vault-purple/5 blur-[100px] animate-glow-breathe"
          style={{ animationDelay: '1.8s' }}
        />
      </div>

      {/* Lot Switcher Carousel Bar */}
      <div className="relative z-20 max-w-6xl mx-auto w-full px-4 sm:px-6 mb-8">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-auction-gold animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
              Active Auction Catalog ({lots.length} Confidential Lots)
            </span>
          </div>

          <button
            onClick={() => setSoundEnabled(s => !s)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-midnight-900/80 border border-white/10 text-xs font-mono text-slate-400 hover:text-auction-gold transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-auction-gold" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>SFX {soundEnabled ? 'ON' : 'MUTED'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {lots.map(lot => {
            const isSelected = lot.id === selectedLotId;
            return (
              <button
                key={lot.id}
                onClick={() => handleLotChange(lot.id)}
                className={`text-left p-3.5 rounded-xl border transition-all duration-300 relative overflow-hidden group flex items-center gap-3.5 ${
                  isSelected
                    ? 'bg-gradient-to-r from-auction-gold/15 to-vault-purple/10 border-auction-gold/60 shadow-[0_0_25px_-5px_rgba(245,158,11,0.3)]'
                    : 'bg-midnight-900/60 border-white/5 hover:border-white/20 hover:bg-midnight-850'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                  <img
                    src={lot.itemImage}
                    alt={lot.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-950/80 to-transparent" />
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-auction-gold shadow-[0_0_8px_#F59E0B]" />
                  )}
                </div>

                {/* Text */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-white/5 text-slate-400">
                      {lot.category}
                    </span>
                    <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-auction-gold' : 'text-slate-500'}`}>
                      {lot.rarity}
                    </span>
                  </div>
                  <h4 className="font-semibold text-xs text-slate-200 truncate">{lot.title}</h4>
                  <p className="text-[11px] font-mono text-auction-gold mt-0.5">
                    Reserve: {lot.reservePrice.toLocaleString()} tDUST
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Left Details & Right 3D Visualizer */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-12 gap-8 items-center">
        {/* Left Col (7) */}
        <div
          className="lg:col-span-7 space-y-6"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateX(0)' : 'translateX(-20px)',
            transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          {/* Header Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-auction-gold/30 bg-auction-gold/5">
              <span className="w-2 h-2 rounded-full bg-auction-gold animate-pulse" />
              <span className="text-xs font-mono text-auction-gold uppercase">
                LOT ID #{config.id} · {ledgerState.bid_count} SEALED BIDS COMMITMENT
              </span>
            </div>

            <div className={`px-2.5 py-0.5 rounded-full border text-xs font-mono font-bold ${rarityColors[config.rarity]}`}>
              ★ {config.rarity}
            </div>

            <div className="px-2.5 py-0.5 rounded-full border border-cipher-teal/30 bg-cipher-teal/10 text-xs font-mono text-cipher-teal">
              MIDNIGHT PREPROD
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
              <span className="gradient-text-gold">{config.title}</span>
            </h2>
            <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed">
              {config.description}
            </p>
          </div>

          {/* Technical Specifications HUD */}
          <div className="glass-card p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-auction-gold" /> Cryptographic Lot Parameters
              </span>
              <span className="text-[10px] font-mono text-cipher-green flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cipher-green animate-ping" /> VERIFIED COMPACT LOGIC
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {config.specs.map(spec => (
                <div key={spec.label} className="bg-midnight-900/70 p-2.5 rounded-lg border border-white/5">
                  <p className="text-[10px] font-mono text-slate-500 uppercase">{spec.label}</p>
                  <p className="text-xs font-mono font-semibold text-slate-200 mt-0.5 truncate">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {ledgerState.auction_open ? (
              <button
                onClick={() => {
                  if (soundEnabled) soundFx.playClick();
                  onOpenBid();
                }}
                className="btn-gold text-white font-semibold flex items-center gap-2 text-sm sm:text-base py-3.5 px-6"
              >
                <Lock className="w-4 h-4" />
                Submit Sealed ZK Bid
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="px-6 py-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-semibold">
                Bidding Closed
              </div>
            )}

            <button
              onClick={() => {
                if (soundEnabled) soundFx.playClick();
                onOpenVault();
              }}
              className="btn-ghost-gold flex items-center gap-2 text-sm sm:text-base py-3.5 px-6"
            >
              <Shield className="w-4 h-4" />
              Audit Vault Hashes
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="flex flex-wrap gap-2 pt-1">
            {['Zero Front-Running', 'No MEV Exposure', 'Dual-State Ledger', 'Vickrey-Settled'].map(b => (
              <span
                key={b}
                className="text-xs px-2.5 py-1 rounded-full bg-cipher-teal/10 border border-cipher-teal/20 text-cipher-teal font-mono flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Right Col (5): Holographic 3D Viewport with Actual Image */}
        <div
          className="lg:col-span-5 flex flex-col items-center gap-6"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateX(0)' : 'translateX(20px)',
            transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1) 0.15s',
          }}
        >
          {/* Holographic Card Container with 3D Tilt */}
          <div
            ref={cardRef}
            className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden glass-card-gold p-3 group cursor-crosshair"
            style={{
              transform: `perspective(800px) rotateX(${-mousePos.y}deg) rotateY(${mousePos.x}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
          >
            {/* Holographic Scanline */}
            <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
              <div className="w-full h-24 bg-gradient-to-b from-transparent via-auction-gold/20 to-transparent animate-scan-line opacity-75" />
            </div>

            {/* Corner HUD Brackets */}
            <div className="absolute top-2 left-2 z-20 text-[10px] font-mono text-auction-gold/80 flex items-center gap-1 pointer-events-none">
              <span className="text-auction-gold font-bold">┌</span> HUD: ZK_ACTIVE
            </div>
            <div className="absolute top-2 right-2 z-20 text-[10px] font-mono text-cipher-teal/80 flex items-center gap-1 pointer-events-none">
              RES: 8K_ENCRYPTED <span className="text-cipher-teal font-bold">┐</span>
            </div>
            <div className="absolute bottom-2 left-2 z-20 text-[10px] font-mono text-slate-500 flex items-center gap-1 pointer-events-none">
              <span className="text-slate-500 font-bold">└</span> WITNESS_ISOLATION
            </div>
            <div className="absolute bottom-2 right-2 z-20 text-[10px] font-mono text-auction-gold/80 flex items-center gap-1 pointer-events-none">
              PARALLAX: 3D <span className="text-auction-gold font-bold">┘</span>
            </div>

            {/* High-Res Render Image */}
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-midnight-950 border border-auction-gold/30">
              <img
                src={config.itemImage}
                alt={config.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
              />

              {/* Holographic grid texture overlay */}
              <div className="absolute inset-0 bg-auction-grid opacity-30 pointer-events-none" />

              {/* Bottom Gradient with Reserve Price info */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-midnight-950 via-midnight-950/80 to-transparent p-4 z-10 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                    Starting Threshold
                  </span>
                  <span className="font-display text-lg font-bold text-neon-gold">
                    {config.reservePrice.toLocaleString()} tDUST
                  </span>
                </div>

                <div className="flex items-center gap-1 px-2.5 py-1 rounded bg-midnight-900/90 border border-auction-gold/30 text-xs font-mono text-auction-gold">
                  <Eye className="w-3 h-3" />
                  <span>SEALED</span>
                </div>
              </div>
            </div>

            {/* Pulsing Outer Glow */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-auction-gold/20 via-vault-purple/20 to-cipher-teal/20 blur-lg opacity-50 group-hover:opacity-100 transition-opacity -z-10" />
          </div>

          {/* Countdown Clock */}
          {!countdown.expired && (
            <div className="text-center w-full">
              <p className="text-xs font-mono text-slate-400 mb-2 uppercase tracking-widest">
                Sealed Bidding Window Remaining
              </p>
              <div className="flex items-center justify-center gap-2">
                <TimeDigit value={countdown.hours} label="HRS" />
                <span className="text-auction-gold text-2xl font-bold mb-4 animate-pulse">:</span>
                <TimeDigit value={countdown.minutes} label="MIN" />
                <span className="text-auction-gold text-2xl font-bold mb-4 animate-pulse">:</span>
                <TimeDigit value={countdown.seconds} label="SEC" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-midnight-950 to-transparent pointer-events-none" />
    </section>
  );
};
