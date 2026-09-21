import React, { useEffect, useState } from 'react';
import { Trophy, Star, Shield, Zap, ExternalLink, Copy, Check } from 'lucide-react';
import type { WinnerData } from '../types';
import { truncateHash } from '../utils/crypto';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';

interface Props {
  winner: WinnerData | null;
  myCommitmentHash: string | null;
}

export const WinnerReveal: React.FC<Props> = ({ winner, myCommitmentHash }) => {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const isMyWin = winner && myCommitmentHash && winner.commitmentHash === myCommitmentHash;

  useEffect(() => {
    if (winner && !revealed) {
      setTimeout(() => {
        setRevealed(true);
        soundFx.playWinner();
        // Fire confetti
        confetti({
          particleCount: 200,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#F59E0B', '#FCD34D', '#8B5CF6', '#06B6D4', '#ffffff'],
          gravity: 0.8,
        });
        setTimeout(() => confetti({
          particleCount: 80,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.6 },
          colors: ['#F59E0B', '#D97706'],
        }), 400);
        setTimeout(() => confetti({
          particleCount: 80,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.6 },
          colors: ['#8B5CF6', '#A78BFA'],
        }), 600);
      }, 300);
    }
  }, [winner, revealed]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!winner) {
    return (
      <div className="glass-card p-8 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-midnight-800 border border-midnight-700 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-slate-600" />
        </div>
        <p className="text-slate-500 font-mono text-sm">Auction not yet finalized.</p>
        <p className="text-xs text-slate-600 font-mono">Close bidding and run finalization to reveal the winner.</p>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border ${
      isMyWin
        ? 'border-auction-gold/60 bg-gradient-to-b from-auction-gold/10 to-midnight-900/80'
        : 'border-vault-purple/40 bg-gradient-to-b from-vault-purple/10 to-midnight-900/80'
    }`} style={{ boxShadow: isMyWin ? '0 0 80px -10px rgba(245,158,11,0.5)' : '0 0 40px -10px rgba(139,92,246,0.4)' }}>

      {/* Animated background burst */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl animate-glow-breathe ${
          isMyWin ? 'bg-auction-gold/10' : 'bg-vault-purple/10'
        }`} />
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-auction-gold/60"
            style={{
              top: `${20 + i * 12}%`,
              left: `${10 + i * 15}%`,
              animation: `float-up ${1.5 + i * 0.3}s ease-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 p-8 space-y-6 ${revealed ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
        {/* Trophy */}
        <div className="text-center space-y-3">
          <div className="relative inline-block">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
              isMyWin ? 'bg-auction-gold/20 border-2 border-auction-gold' : 'bg-vault-purple/20 border-2 border-vault-purple'
            }`} style={{ animation: 'winner-burst 0.8s cubic-bezier(0.175,0.885,0.32,1.275) both' }}>
              <Trophy className={`w-12 h-12 ${isMyWin ? 'text-auction-gold' : 'text-vault-purple'}`} />
            </div>
            {[...Array(8)].map((_, i) => (
              <Star
                key={i}
                className="absolute w-3 h-3 text-auction-gold"
                style={{
                  top: `${50 + 45 * Math.sin(i * Math.PI / 4)}%`,
                  left: `${50 + 45 * Math.cos(i * Math.PI / 4)}%`,
                  transform: 'translate(-50%,-50%)',
                  animation: `glow-breathe ${0.8 + i * 0.1}s ease-in-out ${i * 0.1}s infinite`,
                  opacity: 0.6,
                }}
              />
            ))}
          </div>

          <div>
            {isMyWin ? (
              <>
                <h2 className="font-display text-3xl font-black gradient-text-gold">YOU WON!</h2>
                <p className="text-auction-gold/80 text-sm font-mono mt-1">Your sealed bid was the highest verified offer</p>
              </>
            ) : (
              <>
                <h2 className="font-display text-3xl font-black text-neon-purple">AUCTION SETTLED</h2>
                <p className="text-vault-purple/80 text-sm font-mono mt-1">Winner verified by zero-knowledge proof</p>
              </>
            )}
          </div>
        </div>

        {/* Winner details */}
        <div className="space-y-3">
          {[
            { label: 'Winner Address', value: winner.address, canCopy: true },
            { label: 'Winning Commitment', value: truncateHash(winner.commitmentHash), canCopy: false },
            { label: 'ZK Proof Hash', value: truncateHash(winner.proofHash), canCopy: true },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between px-4 py-3 rounded-xl bg-midnight-900/60 border border-white/5">
              <div>
                <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{row.label}</p>
                <p className="text-sm font-mono text-slate-200 mt-0.5">{row.value}</p>
              </div>
              {row.canCopy && (
                <button onClick={() => handleCopy(row.value)} className="text-slate-500 hover:text-slate-300 transition-colors">
                  {copied ? <Check className="w-4 h-4 text-cipher-green" /> : <Copy className="w-4 h-4" />}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* ZK Badge */}
        <div className="flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-cipher-teal/5 border border-cipher-teal/20">
          <Shield className="w-5 h-5 text-cipher-teal" />
          <div>
            <p className="text-xs font-mono text-cipher-teal font-semibold">Zero-Knowledge Verified Winner</p>
            <p className="text-[10px] font-mono text-slate-500">No losing bid amounts were revealed during settlement</p>
          </div>
          <Zap className="w-5 h-5 text-cipher-teal" />
        </div>

        <a
          href="https://explorer.midnight.network"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 text-xs font-mono text-slate-500 hover:text-cipher-teal transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View on Midnight Explorer
        </a>
      </div>
    </div>
  );
};
