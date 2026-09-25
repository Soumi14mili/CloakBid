import React, { useState } from 'react';
import {
  Shield,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface Props {
  hasBid?: boolean;
  isFinalized?: boolean;
}

export const PrivacyStatusWidget: React.FC<Props> = ({
  hasBid = false,
  isFinalized = false,
}) => {
  const [expanded, setExpanded] = useState(false);

  const statusItems = [
    { label: 'Bid Amount', status: 'PRIVATE', type: 'private' },
    { label: 'Commitment', status: 'VERIFIED', type: 'verified' },
    { label: 'Wallet Balance', status: 'PRIVATE', type: 'private' },
    { label: 'ZK Proof', status: 'VERIFIED', type: 'verified' },
    { label: 'Settlement', status: isFinalized ? 'VERIFIED' : 'READY', type: isFinalized ? 'verified' : 'neutral' },
  ];

  return (
    <aside aria-label="Privacy Status Monitor" className="fixed bottom-4 right-4 z-40">
      {expanded ? (
        <div className="vault-card p-3.5 w-64 border-white/10 bg-midnight-950/95 shadow-xl space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-vault-purple-light" />
              <span className="font-mono text-xs font-semibold text-white tracking-wider">
                PRIVACY STATUS
              </span>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Status Items List */}
          <div className="space-y-1.5 font-mono text-[11px]">
            {statusItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-1 px-2 rounded bg-white/[0.02]"
              >
                <span className="text-slate-400">{item.label}</span>
                <span
                  className={`font-semibold flex items-center gap-1 ${
                    item.type === 'verified'
                      ? 'text-emerald-400'
                      : item.type === 'private'
                      ? 'text-vault-purple-light'
                      : 'text-slate-300'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.type === 'verified'
                        ? 'bg-emerald-400'
                        : item.type === 'private'
                        ? 'bg-vault-purple-light'
                        : 'bg-slate-400'
                    }`}
                  />
                  <span>{item.status}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Enclave Network Footer */}
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Enclave</span>
            <span className="text-slate-300">Midnight Preprod</span>
          </div>
        </div>
      ) : (
        /* Collapsed Minimal Status Pill */
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md vault-card border-white/10 bg-midnight-950/90 hover:border-white/20 transition-all text-xs font-mono shadow-md"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-slate-200 font-medium">PRIVACY STATUS</span>
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}
    </aside>
  );
};
