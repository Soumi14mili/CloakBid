import React, { useState } from 'react';
import {
  Lock,
  CheckCircle2,
  Shield,
  ChevronUp,
  ChevronDown,
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

  return (
    <aside aria-label="Privacy Status" className="fixed bottom-5 right-5 z-40">
      {/* Expanded Status Card */}
      {expanded ? (
        <div className="vault-card p-4 w-72 border-vault-purple/30 bg-midnight-950/95 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-vault-purple" />
              <span className="font-mono text-xs font-bold text-white tracking-wider">
                PRIVACY STATUS
              </span>
            </div>
            <button
              onClick={() => setExpanded(false)}
              className="text-slate-400 hover:text-white p-0.5 rounded"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 font-mono text-[11px]">
            <div className="flex items-center justify-between py-1 px-2 rounded bg-midnight-900/80">
              <span className="text-slate-400">Bid Amount</span>
              <span className="text-vault-purple-light font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-vault-purple" />
                PRIVATE
              </span>
            </div>

            <div className="flex items-center justify-between py-1 px-2 rounded bg-midnight-900/80">
              <span className="text-slate-400">Commitment</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                VERIFIED
              </span>
            </div>

            <div className="flex items-center justify-between py-1 px-2 rounded bg-midnight-900/80">
              <span className="text-slate-400">Wallet Balance</span>
              <span className="text-vault-purple-light font-bold flex items-center gap-1">
                <Lock className="w-3 h-3 text-vault-purple" />
                PRIVATE
              </span>
            </div>

            <div className="flex items-center justify-between py-1 px-2 rounded bg-midnight-900/80">
              <span className="text-slate-400">Winner Proof</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {isFinalized ? 'VERIFIED' : 'READY'}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Midnight Preprod
            </span>
            <span>Halo2 / PLONK</span>
          </div>
        </div>
      ) : (
        /* Collapsed Floating Pill */
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-full vault-card border-vault-purple/30 bg-midnight-950/90 hover:border-vault-purple/60 hover:shadow-vault-glow transition-all text-xs font-mono shadow-xl"
        >
          <Lock className="w-3.5 h-3.5 text-vault-purple" />
          <span className="text-white font-medium">PRIVACY STATUS</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34D399]" />
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}
    </aside>
  );
};
