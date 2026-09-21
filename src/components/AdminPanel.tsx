import React, { useState } from 'react';
import { Settings, Play, Lock, RefreshCw, AlertTriangle, Loader } from 'lucide-react';
import type { LedgerState, CircuitStep } from '../types';
import { soundFx } from '../utils/audio';

interface Props {
  ledgerState: LedgerState;
  circuitStep: CircuitStep;
  onInitialize: (reservePrice: number) => Promise<void>;
  onCloseBidding: () => Promise<void>;
  onFinalize: () => Promise<void>;
}

export const AdminPanel: React.FC<Props> = ({
  ledgerState, circuitStep, onInitialize, onCloseBidding, onFinalize
}) => {
  const [reserveInput, setReserveInput] = useState('500');
  const [loading, setLoading] = useState<string | null>(null);

  const handle = async (key: string, fn: () => Promise<void>) => {
    soundFx.playClick();
    setLoading(key);
    try { await fn(); } finally { setLoading(null); }
  };

  const Btn: React.FC<{
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    variant?: 'gold' | 'teal' | 'purple' | 'red';
    loadKey: string;
  }> = ({ label, icon, onClick, disabled, variant = 'gold', loadKey }) => {
    const colors = {
      gold: 'border-auction-gold/30 text-auction-gold hover:bg-auction-gold/10',
      teal: 'border-cipher-teal/30 text-cipher-teal hover:bg-cipher-teal/10',
      purple: 'border-vault-purple/30 text-vault-purple hover:bg-vault-purple/10',
      red: 'border-red-500/30 text-red-400 hover:bg-red-500/10',
    };
    return (
      <button
        onClick={onClick}
        disabled={disabled || loading !== null}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-mono transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed ${colors[variant]}`}
      >
        {loading === loadKey
          ? <Loader className="w-4 h-4 animate-spin" />
          : icon}
        {label}
      </button>
    );
  };

  return (
    <div className="glass-card p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-vault-purple/10 border border-vault-purple/30 flex items-center justify-center">
          <Settings className="w-5 h-5 text-vault-purple" />
        </div>
        <div>
          <h2 className="font-display text-base font-bold text-white">ADMIN CONTROLS</h2>
          <p className="text-xs font-mono text-slate-400">Auction lifecycle management</p>
        </div>
      </div>

      {/* Status */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Auction Open', val: ledgerState.auction_open ? 'YES' : 'NO', ok: ledgerState.auction_open },
          { label: 'Finalized', val: ledgerState.finalized ? 'YES' : 'NO', ok: ledgerState.finalized },
          { label: 'Bids', val: ledgerState.bid_count.toString(), ok: ledgerState.bid_count > 0 },
        ].map(s => (
          <div key={s.label} className="rounded-xl bg-midnight-900/60 border border-white/5 p-3 text-center">
            <p className="text-[10px] font-mono text-slate-500">{s.label}</p>
            <p className={`font-mono text-sm font-bold mt-1 ${s.ok ? 'text-cipher-green' : 'text-slate-400'}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Reserve Price input */}
      <div className="space-y-2">
        <label className="text-xs font-mono text-slate-400 uppercase tracking-wider">New Reserve Price (tDUST)</label>
        <input
          type="number"
          value={reserveInput}
          onChange={e => setReserveInput(e.target.value)}
          className="bid-input"
          min="1"
        />
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Btn
          label="Initialize Auction"
          icon={<Play className="w-4 h-4" />}
          onClick={() => handle('init', () => onInitialize(parseInt(reserveInput) || 500))}
          loadKey="init"
          variant="teal"
        />
        <Btn
          label="Close Bidding Window"
          icon={<Lock className="w-4 h-4" />}
          onClick={() => handle('close', onCloseBidding)}
          disabled={!ledgerState.auction_open}
          loadKey="close"
          variant="red"
        />
        <Btn
          label="Finalize & Prove Winner (ZK)"
          icon={<RefreshCw className="w-4 h-4" />}
          onClick={() => handle('finalize', onFinalize)}
          disabled={ledgerState.auction_open || ledgerState.finalized || ledgerState.bid_count === 0}
          loadKey="finalize"
          variant="gold"
        />
      </div>

      {/* Warning */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs font-mono text-amber-300/70">
          Admin actions are irreversible on-chain. Close bidding before finalization.
          Finalization triggers the ZK winner-proof circuit.
        </p>
      </div>
    </div>
  );
};
