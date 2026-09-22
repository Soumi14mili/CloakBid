import React, { useState } from 'react';
import { SpotlightCard } from './SpotlightCard';
import { ZKCommitmentReactor } from './ZKCommitmentReactor';
import { AdversarySimulatorWidget } from './AdversarySimulatorWidget';
import {
  Lock,
  Shield,
  Zap,
  Cpu,
  Layers,
  Sparkles,
  Radio,
  Eye,
  Crosshair,
  Key,
  ChevronRight,
  Clock,
  Activity,
  CheckCircle,
} from 'lucide-react';
import type { AuctionConfig, LedgerState, CircuitStep, WalletState, BidCommitment } from '../types';
import { useCountdown } from '../hooks/useCountdown';
import { computeCommitmentHash, generateSalt, truncateHash, timeAgo } from '../utils/crypto';
import { soundFx } from '../utils/audio';

interface Props {
  config: AuctionConfig;
  lots: AuctionConfig[];
  selectedLotId: string;
  onSelectLot: (id: string) => void;
  ledgerState: LedgerState;
  commitments: BidCommitment[];
  myCommitmentHash: string | null;
  circuitStep: CircuitStep;
  wallet: WalletState;
  onCommitBid: (amount: number) => Promise<void>;
  onConnectWallet: () => void;
  onOpenTab: (tab: any) => void;
}

export const CyberCommandCenter: React.FC<Props> = ({
  config,
  lots,
  selectedLotId,
  onSelectLot,
  ledgerState,
  commitments,
  myCommitmentHash,
  circuitStep,
  wallet,
  onCommitBid,
  onConnectWallet,
  onOpenTab,
}) => {
  const countdown = useCountdown(config.endTime);
  const [wireframeMode, setWireframeMode] = useState<boolean>(false);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [showAmount, setShowAmount] = useState<boolean>(false);
  const [liveSalt] = useState<string>(() => generateSalt());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const numericAmount = parseFloat(bidAmount) || 0;
  const isValidAmount = numericAmount >= ledgerState.reserve_price;
  const isLoading = circuitStep !== 'idle';
  const liveHash = numericAmount > 0 ? computeCommitmentHash(numericAmount, liveSalt) : '';

  const handleLotChange = (id: string) => {
    soundFx.playWarp();
    onSelectLot(id);
  };

  const handleApplyPreset = (mult: number) => {
    soundFx.playKey();
    const calculated = Math.round(ledgerState.reserve_price * mult);
    setBidAmount(calculated.toString());
  };

  const handleSubmitBid = async () => {
    if (!isValidAmount) {
      setError(`Minimum bid is ${ledgerState.reserve_price.toLocaleString()} tDUST`);
      soundFx.playError();
      return;
    }
    setError('');
    soundFx.playBid();
    try {
      await onCommitBid(numericAmount);
      setSubmitted(true);
      setBidAmount('');
      soundFx.playSuccess();
    } catch {
      setError('Transaction aborted. Please retry.');
      soundFx.playError();
    }
  };

  return (
    <div className="space-y-6">
      {/* ── Top Catalog Ticker Bar ───────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-midnight-900/60 p-2.5 rounded-2xl border border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-2 px-2">
          <Radio className="w-4 h-4 text-auction-gold animate-pulse" />
          <span className="text-xs font-mono text-slate-300 uppercase tracking-widest font-semibold">
            Confidential Lot Registry:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {lots.map(lot => {
            const isSelected = lot.id === selectedLotId;
            return (
              <button
                key={lot.id}
                onClick={() => handleLotChange(lot.id)}
                onMouseEnter={() => soundFx.playHover()}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-r from-auction-gold/20 to-vault-purple/20 border-auction-gold text-slate-100 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                }`}
              >
                <img src={lot.itemImage} alt="" className="w-5 h-5 rounded object-cover" />
                <span className="font-semibold">{lot.title}</span>
                <span className="text-[10px] text-auction-gold font-bold">
                  {lot.reservePrice.toLocaleString()} tDUST
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Panoramic Bento Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Module 1: 3D Holographic Lot Viewport & Telemetry (Span 7) */}
        <SpotlightCard className="lg:col-span-7 p-6 space-y-5" spotlightColor="rgba(245, 158, 11, 0.14)">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-full bg-auction-gold/15 border border-auction-gold/40 text-xs font-mono text-auction-gold font-bold">
                LOT #{config.id} // {config.rarity}
              </span>
              <span className="text-xs font-mono text-cipher-teal bg-cipher-teal/10 px-2 py-0.5 rounded border border-cipher-teal/20">
                MIDNIGHT PREPROD
              </span>
            </div>

            {/* Countdown Badge */}
            {!countdown.expired && (
              <div className="flex items-center gap-2 font-mono text-xs text-slate-300 bg-midnight-950/80 px-3 py-1 rounded-full border border-white/10">
                <Clock className="w-3.5 h-3.5 text-auction-gold animate-spin" />
                <span>
                  {countdown.hours}h {countdown.minutes}m {countdown.seconds}s remaining
                </span>
              </div>
            )}
          </div>

          {/* Title & Description */}
          <div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
              <span className="gradient-text-gold">{config.title}</span>
            </h2>
            <p className="mt-2 text-slate-300 text-xs sm:text-sm leading-relaxed">
              {config.description}
            </p>
          </div>

          {/* Hologram Card Viewport */}
          <div className="relative aspect-video sm:aspect-[21/9] rounded-xl overflow-hidden border border-auction-gold/30 bg-midnight-950 group">
            <img
              src={config.itemImage}
              alt={config.title}
              className={`w-full h-full object-cover transition-all duration-700 ${
                wireframeMode
                  ? 'filter invert hue-rotate-180 brightness-125 contrast-150'
                  : 'group-hover:scale-105 filter brightness-95'
              }`}
            />
            {/* Hologram Grid & Scanlines */}
            <div className="absolute inset-0 bg-auction-grid opacity-35 pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="w-full h-16 bg-gradient-to-b from-transparent via-auction-gold/25 to-transparent animate-scan-line opacity-75" />
            </div>

            {/* Wireframe Toggle Button */}
            <button
              onClick={() => {
                soundFx.playScan();
                setWireframeMode(w => !w);
              }}
              className="absolute top-3 right-3 z-30 p-2 rounded-xl bg-black/70 border border-white/20 text-slate-200 hover:text-auction-gold transition-colors flex items-center gap-1.5 text-xs font-mono"
            >
              <Crosshair className={`w-3.5 h-3.5 ${wireframeMode ? 'text-auction-gold animate-spin' : ''}`} />
              <span className="hidden sm:inline">{wireframeMode ? 'NORMAL_VIEW' : 'SPECTRAL_SCAN'}</span>
            </button>

            {/* Bottom Telemetry Overlay */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-midnight-950 via-midnight-950/85 to-transparent p-4 flex items-end justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
                  Reserve Threshold (ZK Constraint)
                </span>
                <span className="font-display text-lg sm:text-xl font-bold text-neon-gold">
                  {config.reservePrice.toLocaleString()} tDUST
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/80 border border-auction-gold/30 text-xs font-mono text-auction-gold">
                <Lock className="w-3.5 h-3.5" />
                <span>SEALED BIDS: {ledgerState.bid_count}</span>
              </div>
            </div>
          </div>

          {/* Cryptographic Parameters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            {config.specs.map(spec => (
              <div key={spec.label} className="bg-midnight-950/80 p-2.5 rounded-xl border border-white/5">
                <span className="text-[9px] font-mono text-slate-500 uppercase block">{spec.label}</span>
                <span className="text-xs font-mono font-semibold text-slate-200 truncate block mt-0.5">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </SpotlightCard>

        {/* Module 2: Instant Sealed Bid Formulation Chamber (Span 5) */}
        <SpotlightCard className="lg:col-span-5 p-6 space-y-5" spotlightColor="rgba(139, 92, 246, 0.15)">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-auction-gold/15 border border-auction-gold/30 text-auction-gold">
                <Lock className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white tracking-wide">
                  SEALED BID FORMULATION
                </h3>
                <p className="text-[11px] font-mono text-slate-400">Client-Side Witness Sandbox</p>
              </div>
            </div>

            <span className="flex items-center gap-1 text-[10px] font-mono text-cipher-green">
              <span className="w-1.5 h-1.5 rounded-full bg-cipher-green animate-ping" />
              ZK ARMED
            </span>
          </div>

          {!wallet.connected ? (
            <div className="text-center py-10 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-midnight-950 border border-auction-gold/30 flex items-center justify-center">
                <Key className="w-6 h-6 text-auction-gold/60" />
              </div>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Connect your Midnight Lace wallet to formulate an on-chain zero-knowledge bid
              </p>
              <button
                onClick={() => {
                  soundFx.playClick();
                  onConnectWallet();
                }}
                className="btn-gold text-white text-xs font-bold py-2.5 px-6"
              >
                Connect Wallet
              </button>
            </div>
          ) : !ledgerState.auction_open ? (
            <div className="text-center py-10 space-y-2 bg-midnight-950/80 p-4 rounded-xl border border-white/5">
              <p className="text-amber-400 font-display font-semibold text-sm">BIDDING PERIOD CONCLUDED</p>
              <p className="text-xs text-slate-400">
                The sealed bidding window has closed. Explore the settlement tab to review the ZK proof outcome.
              </p>
            </div>
          ) : submitted && circuitStep === 'idle' ? (
            <div className="text-center py-8 space-y-3 bg-midnight-950/80 p-4 rounded-xl border border-cipher-green/30">
              <CheckCircle className="w-10 h-10 text-cipher-green mx-auto animate-winner-burst" />
              <p className="text-cipher-green font-display font-bold text-base">BID COMMITTED TO CHAIN</p>
              <p className="text-xs text-slate-400">
                Your valuation is cryptographically concealed under a 256-bit Pedersen commitment.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="btn-ghost-gold text-xs font-semibold py-2 px-5 mt-2"
              >
                Commit Another Bid
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 flex items-center gap-1">
                    <Key className="w-3 h-3 text-auction-gold" />
                    Bid Amount (tDUST)
                  </span>
                  <button
                    onClick={() => setShowAmount(s => !s)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showAmount ? 'Mask Value' : 'Reveal Value'}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showAmount ? 'number' : 'password'}
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                    placeholder={`Min Reserve: ${ledgerState.reserve_price.toLocaleString()} tDUST`}
                    className="bid-input pr-28 text-base"
                    min={ledgerState.reserve_price}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-black/70 border border-auction-gold/30 text-[9px] font-mono text-auction-gold">
                    WITNESS_LOCK
                  </div>
                </div>

                {/* Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {[
                    { label: 'Min', mult: 1.0 },
                    { label: '+15%', mult: 1.15 },
                    { label: '+30%', mult: 1.3 },
                    { label: '+50%', mult: 1.5 },
                    { label: '2.0x', mult: 2.0 },
                  ].map(p => (
                    <button
                      key={p.label}
                      onClick={() => handleApplyPreset(p.mult)}
                      className="px-2.5 py-1 rounded bg-white/5 border border-white/10 hover:border-auction-gold/50 text-[10px] font-mono text-slate-300 transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {numericAmount > 0 && numericAmount < ledgerState.reserve_price && (
                  <p className="text-[11px] text-red-400 font-mono">
                    ⚠ Amount must meet or exceed reserve of {ledgerState.reserve_price.toLocaleString()} tDUST
                  </p>
                )}
              </div>

              {/* Real-time Commitment Preview */}
              {liveHash && (
                <div className="bg-midnight-950/90 p-3 rounded-xl border border-vault-purple/30 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-vault-purple-light" />
                      Public Commitment Anchor (C)
                    </span>
                    <span className="text-vault-purple-light">PEDERSEN_HASH</span>
                  </div>
                  <div className="font-mono text-xs text-vault-purple-light break-all bg-black/60 p-2 rounded border border-white/5">
                    0x{liveHash}
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                onClick={handleSubmitBid}
                disabled={!isValidAmount || isLoading}
                onMouseEnter={() => soundFx.playHover()}
                className="w-full btn-gold text-white font-bold py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50 cyber-cut"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating ZK-SNARK...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Commit Sealed Bid On-Chain</span>
                  </>
                )}
              </button>

              <div className="text-[10px] font-mono text-slate-500 leading-tight">
                🔒 Privacy Guarantee: Valuation remains in client browser memory. Only the cryptographic hash (C) is broadcast to Midnight gossip peers.
              </div>
            </div>
          )}
        </SpotlightCard>
      </div>

      {/* ── Bento Row 2: ZK Reactor & Adversary Simulator (Span 6 + 6) ─ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <SpotlightCard className="lg:col-span-6 p-6" spotlightColor="rgba(6, 182, 212, 0.14)">
          <ZKCommitmentReactor />
        </SpotlightCard>

        <SpotlightCard className="lg:col-span-6 p-6" spotlightColor="rgba(239, 68, 68, 0.12)">
          <AdversarySimulatorWidget />
        </SpotlightCard>
      </div>

      {/* ── Bento Row 3: Live Commitment Vault Matrix ─────────────── */}
      <SpotlightCard className="p-6 space-y-4" spotlightColor="rgba(245, 158, 11, 0.12)">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-auction-gold/15 border border-auction-gold/30 text-auction-gold">
              <Shield className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h4 className="font-display text-sm font-bold text-white tracking-wider">
                LIVE ON-CHAIN COMMITMENT VAULT MATRIX
              </h4>
              <p className="text-[11px] font-mono text-slate-400">
                Verifiable cryptographic capsules permanently anchored on Midnight Preprod
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenTab('vault')}
            className="text-xs font-mono text-auction-gold hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Inspect Full Vault Matrix</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {commitments.slice(0, 4).map((c, i) => {
            const isMine = c.hash === myCommitmentHash;
            return (
              <div
                key={c.id}
                className={`p-3.5 rounded-xl border relative overflow-hidden transition-all duration-300 font-mono ${
                  isMine
                    ? 'bg-gradient-to-b from-auction-gold/20 to-midnight-950 border-auction-gold/70 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                    : 'bg-midnight-950/80 border-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-2 text-[10px]">
                  <span className="text-slate-500">CAPSULE #{c.id}</span>
                  <span className={isMine ? 'text-auction-gold font-bold' : 'text-slate-400'}>
                    {isMine ? 'YOUR COMMITMENT' : 'SEALED'}
                  </span>
                </div>
                <p className="text-xs text-slate-200 font-semibold truncate mb-1">
                  0x{truncateHash(c.hash)}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-white/5">
                  <span>{timeAgo(c.timestamp)}</span>
                  <span className="text-cipher-green">VALID_PROOF π</span>
                </div>
              </div>
            );
          })}
        </div>
      </SpotlightCard>
    </div>
  );
};
