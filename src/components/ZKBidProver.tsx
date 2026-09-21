import React, { useState, useEffect } from 'react';
import { Cpu, ArrowRight, Check, Lock, Hash, Zap, Shield, X } from 'lucide-react';
import type { CircuitStep } from '../types';

interface Props {
  isOpen: boolean;
  circuitStep: CircuitStep;
  onClose: () => void;
}

const STEPS: Array<{ id: CircuitStep; label: string; detail: string; color: string }> = [
  {
    id: 'reading-witness',
    label: 'Read Private Witness',
    detail: 'bid_amount() + bid_salt() loaded from local memory',
    color: '#A78BFA',
  },
  {
    id: 'hashing',
    label: 'Pedersen Hash',
    detail: 'commitment = hash(amount ∥ salt) computed in ZK circuit',
    color: '#F59E0B',
  },
  {
    id: 'proving',
    label: 'PLONK Proof Generation',
    detail: 'ZK-SNARK proof: amount ≥ reserve_price (without revealing amount)',
    color: '#06B6D4',
  },
  {
    id: 'submitting',
    label: 'On-Chain Submission',
    detail: 'Only commitment hash + proof submitted to Midnight ledger',
    color: '#10B981',
  },
  {
    id: 'confirmed',
    label: 'Confirmed',
    detail: 'Bid sealed on-chain. Amount remains forever private.',
    color: '#34D399',
  },
];

const STEP_ORDER = STEPS.map(s => s.id);

export const ZKBidProver: React.FC<Props> = ({ isOpen, circuitStep, onClose }) => {
  const [matrixChars, setMatrixChars] = useState<string[]>([]);
  const currentIdx = STEP_ORDER.indexOf(circuitStep);

  useEffect(() => {
    const chars = '0123456789abcdef';
    const generate = () =>
      Array.from({ length: 60 }, () => chars[Math.floor(Math.random() * chars.length)]);
    setMatrixChars(generate());
    const interval = setInterval(() => setMatrixChars(generate()), 120);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-midnight-950/95 backdrop-blur-xl" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Close */}
        {circuitStep === 'confirmed' || circuitStep === 'idle' ? (
          <button
            onClick={onClose}
            className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-midnight-800 border border-midnight-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors z-20"
          >
            <X className="w-4 h-4" />
          </button>
        ) : null}

        {/* Card */}
        <div className="glass-card-gold p-8 space-y-8 relative overflow-hidden">
          {/* Matrix rain background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
            <div className="font-mono text-[10px] text-auction-gold leading-4 break-all p-4">
              {matrixChars.join(' ')}
            </div>
          </div>

          {/* Header */}
          <div className="text-center relative z-10">
            <div className="relative inline-block">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-auction-gold/10 border border-auction-gold/30 flex items-center justify-center">
                <Cpu className="w-8 h-8 text-auction-gold animate-glow-breathe" />
              </div>
              <div className="absolute inset-0 rounded-2xl border border-auction-gold/20 animate-bid-pulse" />
            </div>
            <h2 className="font-display text-xl font-bold text-white mt-4">ZK PROOF GENERATOR</h2>
            <p className="text-xs font-mono text-slate-400 mt-1">Midnight Compact Circuit Execution</p>
          </div>

          {/* Circuit flow */}
          <div className="relative z-10 space-y-3">
            {/* Data flow line */}
            <div className="absolute left-7 top-8 bottom-8 w-px bg-gradient-to-b from-vault-purple via-auction-gold to-cipher-green opacity-30" />

            {STEPS.map((step, idx) => {
              const isDone = currentIdx > idx;
              const isActive = currentIdx === idx;
              const isPending = currentIdx < idx;

              return (
                <div key={step.id} className="flex items-start gap-4 relative">
                  {/* Step icon */}
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all duration-500 ${
                      isDone
                        ? 'bg-cipher-green/20 border-cipher-green'
                        : isActive
                        ? 'bg-auction-gold/10 border-auction-gold animate-bid-pulse'
                        : 'bg-midnight-800 border-midnight-700'
                    }`}
                    style={{ zIndex: 1 }}
                  >
                    {isDone ? (
                      <Check className="w-4 h-4 text-cipher-green" />
                    ) : isActive ? (
                      <span
                        className="w-4 h-4 border-2 border-auction-gold/30 border-t-auction-gold rounded-full animate-spin"
                      />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-midnight-600" />
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 pb-3 transition-all duration-500 ${isPending ? 'opacity-30' : 'opacity-100'}`}>
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm font-semibold ${
                          isDone ? 'text-cipher-green' : isActive ? 'text-auction-gold' : 'text-slate-500'
                        }`}
                      >
                        {step.label}
                      </p>
                      {isActive && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-auction-gold/20 text-auction-gold font-mono animate-pulse">
                          RUNNING
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-slate-500 mt-0.5">{step.detail}</p>

                    {/* Active: data stream */}
                    {isActive && (
                      <div className="mt-2 px-3 py-2 rounded-lg bg-midnight-900/80 border border-auction-gold/10">
                        <p className="text-[10px] font-mono text-auction-gold/70 animate-pulse">
                          {matrixChars.slice(0, 32).join('')}...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom info */}
          {circuitStep === 'confirmed' && (
            <div className="relative z-10 flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-cipher-green/5 border border-cipher-green/30">
              <Shield className="w-5 h-5 text-cipher-green" />
              <div>
                <p className="text-sm font-mono text-cipher-green font-semibold">Proof Generated & Submitted</p>
                <p className="text-[10px] font-mono text-slate-500">Your bid is sealed. Amount: forever private.</p>
              </div>
              <Zap className="w-5 h-5 text-cipher-green" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
