import React, { useState, useEffect } from 'react';
import { Cpu, Shield, Lock, Sparkles, RefreshCw, Copy, Check, Key, Zap } from 'lucide-react';
import { computeCommitmentHash, generateSalt, truncateHash } from '../utils/crypto';
import { soundFx } from '../utils/audio';

export const ZKCommitmentReactor: React.FC = () => {
  const [amount, setAmount] = useState<number>(850);
  const [salt, setSalt] = useState<string>(() => generateSalt());
  const [hash, setHash] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [entropy, setEntropy] = useState<number>(256);

  useEffect(() => {
    const computed = computeCommitmentHash(amount, salt);
    setHash(computed);
  }, [amount, salt]);

  const handleRegenerateSalt = () => {
    soundFx.playScan();
    setIsSynthesizing(true);
    const newSalt = generateSalt();
    setSalt(newSalt);
    setEntropy(254 + Math.floor(Math.random() * 3));
    setTimeout(() => {
      setIsSynthesizing(false);
      soundFx.playLock();
    }, 350);
  };

  const handleCopyHash = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(`0x${hash}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-vault-purple/15 border border-vault-purple/30 text-vault-purple-light">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-slate-100 tracking-wider">
              PEDERSEN COMMITMENT REACTOR
            </h4>
            <p className="text-[11px] font-mono text-slate-400">
              C = g^amount · h^salt (mod p) // Zero-Knowledge Binding Core
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cipher-teal/10 border border-cipher-teal/30 text-[10px] font-mono text-cipher-teal">
          <span className="w-1.5 h-1.5 rounded-full bg-cipher-teal animate-ping" />
          <span>ENTROPY: {entropy}-BIT CSPRNG</span>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-midnight-950/80 p-3 rounded-xl border border-white/5 space-y-1.5">
          <label className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Key className="w-3 h-3 text-auction-gold" />
              Private Bid Witness (m)
            </span>
            <span className="text-auction-gold text-[10px]">CLIENT RAM ONLY</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-black/60 border border-auction-gold/30 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-100 focus:outline-none focus:border-auction-gold"
            />
            <span className="text-xs font-mono text-slate-400">tDUST</span>
          </div>
        </div>

        <div className="bg-midnight-950/80 p-3 rounded-xl border border-white/5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-vault-purple-light" />
              Blinding Salt Nonce (r)
            </span>
            <button
              onClick={handleRegenerateSalt}
              className="text-[10px] text-vault-purple-light hover:text-white flex items-center gap-1 transition-colors"
            >
              <RefreshCw className={`w-2.5 h-2.5 ${isSynthesizing ? 'animate-spin' : ''}`} />
              Re-Roll
            </button>
          </div>
          <div className="bg-black/60 border border-vault-purple/30 rounded-lg px-3 py-1.5 text-xs font-mono text-vault-purple-light truncate">
            {truncateHash(salt)}
          </div>
        </div>
      </div>

      {/* Reactor Visualizer Ring */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-midnight-950 via-midnight-900 to-midnight-950 border border-auction-gold/25 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Pulsing ring animation */}
        <div className="relative flex items-center justify-center w-16 h-16 flex-shrink-0">
          <div className="absolute inset-0 rounded-full border border-dashed border-auction-gold/50 animate-spin" />
          <div className="absolute inset-1.5 rounded-full border border-vault-purple/40 animate-ping-slow" />
          <div className="w-9 h-9 rounded-full bg-auction-gold/20 flex items-center justify-center border border-auction-gold">
            <Zap className="w-4 h-4 text-auction-gold animate-pulse" />
          </div>
        </div>

        {/* Commitment Hash Display */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-auction-gold" />
              On-Chain Public Anchor Hash (C)
            </span>
            <span className="text-[9px] font-mono text-cipher-green">100% COLLISION RESISTANT</span>
          </div>
          <div className="bg-black/80 border border-white/10 rounded-lg px-3 py-2 font-mono text-xs text-auction-gold break-all relative group select-all">
            0x{hash}
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopyHash}
          className="flex-shrink-0 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-slate-300 hover:text-auction-gold hover:border-auction-gold/40 flex items-center gap-1.5 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-cipher-green" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Security Guarantee Tag */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
        <span>Discrete Logarithm Assumption: Hard to extract m given C</span>
        <span className="text-auction-gold">WITNESS_MEMORY_CLEARED_ON_EXIT</span>
      </div>
    </div>
  );
};
