import React from 'react';
import { Rocket, Gavel, Lock, Trophy, Check } from 'lucide-react';
import type { LedgerState } from '../types';

interface Props {
  ledgerState: LedgerState;
}

const PHASES = [
  { id: 'deploy', label: 'Deploy', sub: 'Contract initialized', icon: Rocket },
  { id: 'bidding', label: 'Bidding', sub: 'Sealed bids open', icon: Gavel },
  { id: 'closed', label: 'Closed', sub: 'Bidding window ended', icon: Lock },
  { id: 'finalized', label: 'Winner', sub: 'ZK proof verified', icon: Trophy },
] as const;

const PHASE_ORDER = ['deploy', 'bidding', 'closed', 'finalized'] as const;

export const AuctionPhaseStepper: React.FC<Props> = ({ ledgerState }) => {
  const getCurrentPhase = (): typeof PHASE_ORDER[number] => {
    if (ledgerState.finalized) return 'finalized';
    if (!ledgerState.auction_open) return 'closed';
    return 'bidding';
  };

  const currentPhase = getCurrentPhase();
  const currentIdx = PHASE_ORDER.indexOf(currentPhase);

  return (
    <div className="glass-card p-6">
      <h3 className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-6">Auction Lifecycle</h3>
      <div className="relative flex items-start justify-between">
        {/* Base connector */}
        <div className="absolute left-5 right-5 top-5 h-px bg-midnight-700" />
        {/* Progress connector */}
        <div
          className="absolute left-5 top-5 h-px bg-gradient-to-r from-cipher-teal via-auction-gold to-vault-purple transition-all duration-1000"
          style={{ width: currentIdx > 0 ? `${(currentIdx / (PHASES.length - 1)) * (100 - 10)}%` : '0%' }}
        />

        {PHASES.map((phase, idx) => {
          const Icon = phase.icon;
          const isDone = idx < currentIdx;
          const isActive = idx === currentIdx;

          return (
            <div key={phase.id} className="relative flex flex-col items-center gap-2 z-10 flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                  isDone
                    ? 'bg-cipher-teal border-cipher-teal shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                    : isActive
                    ? 'bg-midnight-800 border-auction-gold shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-bid-pulse'
                    : 'bg-midnight-900 border-midnight-700'
                }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 text-white" />
                ) : isActive ? (
                  <Icon className="w-4 h-4 text-auction-gold" />
                ) : (
                  <Icon className="w-4 h-4 text-midnight-600" />
                )}
              </div>
              <div className="text-center">
                <p className={`text-xs font-semibold ${
                  isActive ? 'text-auction-gold' : isDone ? 'text-cipher-teal' : 'text-slate-600'
                }`}>{phase.label}</p>
                <p className="text-[10px] font-mono text-slate-600 mt-0.5 hidden sm:block leading-tight">{phase.sub}</p>
              </div>
              {isActive && (
                <span className="absolute -top-1 -right-0 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-auction-gold opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-auction-gold" />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
