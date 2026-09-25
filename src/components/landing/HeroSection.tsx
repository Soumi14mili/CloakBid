import React, { useState } from 'react';
import { ArrowRight, Lock, ShieldCheck, ChevronRight } from 'lucide-react';

interface Props {
  onEnterApp: () => void;
  onConnectWallet: () => Promise<void>;
  walletConnected: boolean;
}

// The Cloak Vault — premium inline SVG visual
const CloakVault: React.FC = () => (
  <div className="relative w-full max-w-[560px] mx-auto select-none" aria-hidden="true">
    <svg
      viewBox="0 0 560 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      {/* Definitions */}
      <defs>
        <linearGradient id="vaultGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1a1d25" />
          <stop offset="100%" stopColor="#0f1117" />
        </linearGradient>
        <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#635BFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="successGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2ECC8A" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#27ae73" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="cardGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#181c23" />
          <stop offset="100%" stopColor="#12151b" />
        </linearGradient>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="subtleGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="cardClip1">
          <rect x="0" y="0" width="140" height="76" rx="8" />
        </clipPath>
        <clipPath id="cardClip2">
          <rect x="0" y="0" width="140" height="76" rx="8" />
        </clipPath>
        <clipPath id="cardClip3">
          <rect x="0" y="0" width="140" height="76" rx="8" />
        </clipPath>
        <clipPath id="resultClip">
          <rect x="0" y="0" width="140" height="96" rx="8" />
        </clipPath>
      </defs>

      {/* ── Background atmosphere (very subtle) ── */}
      <ellipse cx="280" cy="200" rx="200" ry="130" fill="rgba(99,91,255,0.04)" />

      {/* ── INPUT BID CARDS (left side) ── */}
      {/* Card 1 - top */}
      <g transform="translate(18, 58)" opacity="0.9">
        <rect width="140" height="72" rx="8" fill="url(#cardGrad1)" />
        <rect width="140" height="72" rx="8" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <text x="12" y="20" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="'JetBrains Mono', monospace" letterSpacing="1.5">PRIVATE BID</text>
        <text x="12" y="40" fill="rgba(255,255,255,0.2)" fontSize="13" fontFamily="'JetBrains Mono', monospace" letterSpacing="2">████████</text>
        <rect x="12" y="50" width="40" height="3" rx="1.5" fill="rgba(255,255,255,0.06)" />
        <rect x="58" y="50" width="24" height="3" rx="1.5" fill="rgba(99,91,255,0.2)" />
        {/* Lock icon simplified */}
        <rect x="117" y="10" width="12" height="10" rx="2" fill="none" stroke="rgba(99,91,255,0.5)" strokeWidth="1.2" />
        <path d="M120 10 V7 Q123 3 126 7 V10" stroke="rgba(99,91,255,0.5)" strokeWidth="1.2" fill="none" />
      </g>

      {/* Card 2 - middle */}
      <g transform="translate(8, 158)" opacity="0.85">
        <rect width="140" height="72" rx="8" fill="url(#cardGrad1)" />
        <rect width="140" height="72" rx="8" stroke="rgba(255,255,255,0.07)" strokeWidth="1" />
        <text x="12" y="20" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="'JetBrains Mono', monospace" letterSpacing="1.5">PRIVATE BID</text>
        <text x="12" y="40" fill="rgba(255,255,255,0.2)" fontSize="13" fontFamily="'JetBrains Mono', monospace" letterSpacing="2">████████</text>
        <rect x="12" y="50" width="56" height="3" rx="1.5" fill="rgba(255,255,255,0.06)" />
        <rect x="117" y="10" width="12" height="10" rx="2" fill="none" stroke="rgba(99,91,255,0.5)" strokeWidth="1.2" />
        <path d="M120 10 V7 Q123 3 126 7 V10" stroke="rgba(99,91,255,0.5)" strokeWidth="1.2" fill="none" />
      </g>

      {/* Card 3 - bottom */}
      <g transform="translate(18, 260)" opacity="0.75">
        <rect width="140" height="72" rx="8" fill="url(#cardGrad1)" />
        <rect width="140" height="72" rx="8" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        <text x="12" y="20" fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="'JetBrains Mono', monospace" letterSpacing="1.5">PRIVATE BID</text>
        <text x="12" y="40" fill="rgba(255,255,255,0.18)" fontSize="13" fontFamily="'JetBrains Mono', monospace" letterSpacing="2">████████</text>
        <rect x="12" y="50" width="32" height="3" rx="1.5" fill="rgba(255,255,255,0.05)" />
        <rect x="117" y="10" width="12" height="10" rx="2" fill="none" stroke="rgba(99,91,255,0.4)" strokeWidth="1.2" />
        <path d="M120 10 V7 Q123 3 126 7 V10" stroke="rgba(99,91,255,0.4)" strokeWidth="1.2" fill="none" />
      </g>

      {/* ── FLOW ARROWS (left to vault) ── */}
      <g opacity="0.35">
        <path d="M159 94 Q195 94 195 195" stroke="rgba(99,91,255,0.6)" strokeWidth="1" strokeDasharray="4 3" fill="none" />
        <path d="M149 194 H195" stroke="rgba(99,91,255,0.6)" strokeWidth="1" strokeDasharray="4 3" fill="none" />
        <path d="M159 296 Q195 296 195 200" stroke="rgba(99,91,255,0.6)" strokeWidth="1" strokeDasharray="4 3" fill="none" />
      </g>
      {/* Arrow heads */}
      <polygon points="193,191 200,195 193,199" fill="rgba(99,91,255,0.5)" />

      {/* ── VAULT (center) ── */}
      {/* Outer vault container */}
      <rect x="205" y="128" width="150" height="144" rx="16" fill="url(#vaultGrad)" />
      <rect x="205" y="128" width="150" height="144" rx="16" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      {/* Vault inner surface */}
      <rect x="217" y="140" width="126" height="120" rx="10" fill="rgba(8,9,12,0.8)" />
      <rect x="217" y="140" width="126" height="120" rx="10" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

      {/* ZK layer label */}
      <text x="280" y="175" fill="rgba(255,255,255,0.4)" fontSize="7" fontFamily="'JetBrains Mono', monospace" textAnchor="middle" letterSpacing="2">ZERO-KNOWLEDGE</text>

      {/* Central ZK core — simple geometric */}
      <circle cx="280" cy="205" r="28" fill="rgba(99,91,255,0.08)" />
      <circle cx="280" cy="205" r="20" fill="rgba(99,91,255,0.12)" />
      <circle cx="280" cy="205" r="12" fill="url(#accentGrad)" opacity="0.7" />

      {/* ZK shield shape in center */}
      <path
        d="M280 196 L273 199 L273 207 Q273 213 280 216 Q287 213 287 207 L287 199 Z"
        fill="rgba(255,255,255,0.9)"
        fillOpacity="0.95"
      />

      {/* Verification label */}
      <text x="280" y="235" fill="rgba(255,255,255,0.35)" fontSize="7" fontFamily="'JetBrains Mono', monospace" textAnchor="middle" letterSpacing="2">VERIFICATION</text>

      {/* ── FLOW ARROWS (vault to result) ── */}
      <g opacity="0.45">
        <path d="M355 200 H395" stroke="rgba(46,204,138,0.7)" strokeWidth="1.2" fill="none" />
        <polygon points="392,196 400,200 392,204" fill="rgba(46,204,138,0.7)" />
      </g>

      {/* ── RESULT CARD (right) ── */}
      <g transform="translate(402, 155)">
        {/* Subtle success glow behind card */}
        <rect x="-4" y="-4" width="152" height="104" rx="12" fill="rgba(46,204,138,0.05)" />

        <rect width="144" height="96" rx="10" fill="url(#cardGrad1)" />
        <rect width="144" height="96" rx="10" stroke="rgba(46,204,138,0.25)" strokeWidth="1" />

        {/* Top accent line */}
        <rect width="144" height="3" rx="1.5" fill="url(#successGrad)" opacity="0.7" />

        {/* VERIFIED label */}
        <text x="12" y="24" fill="#2ECC8A" fontSize="8" fontFamily="'JetBrains Mono', monospace" letterSpacing="1.5">VERIFIED RESULT</text>

        {/* Check mark */}
        <circle cx="128" cy="18" r="9" fill="rgba(46,204,138,0.15)" />
        <path d="M123 18 L126 21 L133 14" stroke="#2ECC8A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Winner info */}
        <text x="12" y="44" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="'JetBrains Mono', monospace">HIGHEST BID</text>
        <rect x="12" y="50" width="60" height="8" rx="3" fill="rgba(46,204,138,0.12)" />
        <text x="12" y="57.5" fill="rgba(46,204,138,0.8)" fontSize="7" fontFamily="'JetBrains Mono', monospace" letterSpacing="1">WINNER</text>

        {/* Losing bids masked */}
        <text x="12" y="75" fill="rgba(255,255,255,0.2)" fontSize="8" fontFamily="'JetBrains Mono', monospace">Others: ████  ████</text>

        {/* On-chain label */}
        <text x="12" y="89" fill="rgba(255,255,255,0.2)" fontSize="7" fontFamily="'JetBrains Mono', monospace" letterSpacing="1">ON-CHAIN · MIDNIGHT</text>
      </g>

      {/* ── Bottom label strip ── */}
      {/* Private inputs label */}
      <text x="88" y="360" fill="rgba(255,255,255,0.25)" fontSize="9" textAnchor="middle" fontFamily="Inter, sans-serif" letterSpacing="0.5">PRIVATE INPUTS</text>
      {/* Vault label */}
      <text x="280" y="295" fill="rgba(255,255,255,0.2)" fontSize="8" textAnchor="middle" fontFamily="Inter, sans-serif" letterSpacing="1">ZK VAULT</text>
      {/* Result label */}
      <text x="474" y="274" fill="rgba(46,204,138,0.5)" fontSize="9" textAnchor="middle" fontFamily="Inter, sans-serif" letterSpacing="0.5">VERIFIED OUTPUT</text>
    </svg>
  </div>
);

export const HeroSection: React.FC<Props> = ({ onEnterApp, onConnectWallet, walletConnected }) => {
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    await onConnectWallet();
    setConnecting(false);
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-5 sm:px-8 pt-20 pb-16"
      style={{ background: '#08090C' }}
    >
      {/* Very subtle background gradient — not a glow, just depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 10%, rgba(99,91,255,0.05) 0%, transparent 60%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-content mx-auto">
        {/* Top badge */}
        <div className="flex justify-center mb-10">
          <span className="badge-accent text-[12px] px-4 py-1.5 flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: '#635BFF' }}
            />
            Live on Midnight Preview Network
          </span>
        </div>

        {/* Main hero layout: headline left, visual right */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-14 lg:gap-8">
          {/* LEFT — Headline & CTAs */}
          <div className="lg:w-1/2 flex flex-col items-start text-left max-w-xl">
            <h1
              className="text-5xl sm:text-6xl lg:text-[64px] font-bold tracking-tight text-cb-t1 leading-[1.08]"
            >
              PRIVATE AUCTIONS.
              <br />
              <span className="gradient-text">PUBLICLY VERIFIABLE</span>
              <br />
              RESULTS.
            </h1>

            <p className="mt-7 text-cb-t2 text-lg leading-relaxed max-w-md">
              Run sealed-bid auctions where bid values remain private while
              the auction outcome can be cryptographically verified. Built on
              Midnight.
            </p>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mt-10">
              <button
                onClick={onEnterApp}
                className="btn-primary btn-lg flex items-center gap-2"
              >
                Explore Auctions
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onEnterApp}
                className="btn-secondary btn-lg"
              >
                Create an Auction
              </button>
              <a
                href="https://midnight.network"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost btn-lg hidden sm:flex"
              >
                Read the Protocol
              </a>
            </div>

            {/* Trust signals below CTAs */}
            <div className="flex items-center gap-6 mt-10 text-[13px] text-cb-t3">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Zero-knowledge proofs
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                On-chain settlement
              </span>
            </div>
          </div>

          {/* RIGHT — Cloak Vault Visual */}
          <div className="lg:w-1/2 flex items-center justify-center">
            <CloakVault />
          </div>
        </div>

        {/* Bottom — quick stat strip */}
        <div
          className="mt-20 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          {[
            { value: '49,384', label: 'tDUST Balance' },
            { value: '3', label: 'Active Auctions' },
            { value: '100%', label: 'ZK Verified' },
            { value: 'Midnight', label: 'Preview Network' },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="text-2xl font-bold text-cb-t1 tracking-tight">
                {stat.value}
              </span>
              <span className="text-[12px] text-cb-t3 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
