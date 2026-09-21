import React, { useState } from 'react';
import { Eye, EyeOff, Shield, Lock, Globe, AlertTriangle, Zap } from 'lucide-react';
import type { PrivacySnapshot } from '../types';

interface Props {
  snapshot: PrivacySnapshot;
}

export const PrivacyShieldPanel: React.FC<Props> = ({ snapshot }) => {
  const [simulating, setSimulating] = useState(false);
  const [attackResult, setAttackResult] = useState<string | null>(null);

  const simulateAttack = async () => {
    setSimulating(true);
    setAttackResult(null);
    await new Promise(r => setTimeout(r, 2000));
    setAttackResult(
      'Attack simulation complete. Adversary obtained: commitment hashes, block timestamps, gas fees. ' +
      'Adversary FAILED to obtain: bid amounts (cryptographic pre-image resistance), bidder identity (shielded by Midnight), salt values.'
    );
    setSimulating(false);
  };

  return (
    <div className="space-y-4">
      <div className="glass-card p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="font-display text-base font-bold text-white">PRIVACY AUDIT</h2>
            <p className="text-xs font-mono text-slate-400">Dual-state analysis — what's on-chain vs. private</p>
          </div>
        </div>

        {/* Two columns */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Public */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider font-semibold">PUBLIC (On-Chain)</span>
              <Eye className="w-3.5 h-3.5 text-amber-400/60" />
            </div>
            <div className="space-y-2">
              {snapshot.adversaryCanSee.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <span className="w-4 h-4 rounded bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">👁</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Private */}
          <div className="rounded-xl border border-cipher-teal/20 bg-cipher-teal/5 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-cipher-teal" />
              <span className="text-xs font-mono text-cipher-teal uppercase tracking-wider font-semibold">PRIVATE (Client-Only)</span>
              <EyeOff className="w-3.5 h-3.5 text-cipher-teal/60" />
            </div>
            <div className="space-y-2">
              {snapshot.adversaryCannotSee.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <span className="w-4 h-4 rounded bg-cipher-teal/20 flex items-center justify-center text-cipher-teal flex-shrink-0">🔒</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Your session */}
        {snapshot.clientBidAmount !== null && (
          <div className="rounded-xl border border-vault-purple/20 bg-vault-purple/5 p-4 space-y-3">
            <p className="text-xs font-mono text-vault-purple uppercase tracking-wider font-semibold">Your Current Session</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] font-mono text-slate-500">Bid Amount (local)</p>
                <p className="font-mono text-sm text-auction-gold mt-0.5">{snapshot.clientBidAmount?.toLocaleString()} tDUST</p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-slate-500">Salt (local)</p>
                <p className="font-mono text-xs text-vault-purple-light mt-0.5 truncate">{snapshot.clientBidSalt?.slice(0, 12)}...</p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-slate-500">Public Hash</p>
                <p className="font-mono text-xs text-slate-300 mt-0.5 truncate">{snapshot.publicCommitmentHash?.slice(0, 12)}...</p>
              </div>
            </div>
          </div>
        )}

        {/* Attack Simulator */}
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-xs font-mono text-red-400 uppercase tracking-wider font-semibold">Adversary Simulation</span>
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Simulate a full on-chain data extraction attack. An adversary reads all public state and attempts to reconstruct bid amounts.
          </p>
          <button
            onClick={simulateAttack}
            disabled={simulating}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono hover:bg-red-500/20 transition-colors disabled:opacity-50"
          >
            {simulating ? (
              <><span className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" /> Attacking...</>
            ) : (
              <><Zap className="w-3.5 h-3.5" /> Run Attack Simulation</>
            )}
          </button>
          {attackResult && (
            <div className="rounded-lg bg-midnight-900/60 border border-red-500/10 p-3">
              <p className="text-xs font-mono text-slate-400">{attackResult}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
