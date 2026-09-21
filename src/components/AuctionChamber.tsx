import React, { useState, useEffect, useRef } from 'react';
import { Lock, Eye, EyeOff, Zap, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import type { LedgerState, CircuitStep, WalletState } from '../types';
import { computeCommitmentHash, generateSalt, truncateHash } from '../utils/crypto';
import { soundFx } from '../utils/audio';

interface Props {
  ledgerState: LedgerState;
  circuitStep: CircuitStep;
  wallet: WalletState;
  onCommitBid: (amount: number) => Promise<void>;
  onConnectWallet: () => void;
}

export const AuctionChamber: React.FC<Props> = ({
  ledgerState, circuitStep, wallet, onCommitBid, onConnectWallet
}) => {
  const [bidAmount, setBidAmount] = useState('');
  const [showAmount, setShowAmount] = useState(false);
  const [liveHash, setLiveHash] = useState('');
  const [liveSalt] = useState(() => generateSalt());
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const numericAmount = parseFloat(bidAmount) || 0;
  const isValidAmount = numericAmount >= ledgerState.reserve_price;
  const isLoading = circuitStep !== 'idle';

  useEffect(() => {
    if (numericAmount > 0) {
      const hash = computeCommitmentHash(numericAmount, liveSalt);
      setLiveHash(hash);
    } else {
      setLiveHash('');
    }
  }, [numericAmount, liveSalt]);

  const handleSubmit = async () => {
    if (!isValidAmount) {
      setError(`Minimum bid is ${ledgerState.reserve_price.toLocaleString()} tDUST`);
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
      setError('Transaction failed. Please try again.');
      soundFx.playError();
    }
  };

  const STEP_LABELS: Record<CircuitStep, string> = {
    idle: '',
    'reading-witness': 'Reading private witness...',
    hashing: 'Hashing bid with salt (Pedersen)...',
    proving: 'Generating ZK proof (PLONK)...',
    submitting: 'Broadcasting to Midnight chain...',
    confirmed: 'Bid committed on-chain!',
    error: 'Proof generation failed',
  };

  const STEP_COLORS: Record<CircuitStep, string> = {
    idle: 'text-slate-400',
    'reading-witness': 'text-vault-purple',
    hashing: 'text-auction-gold',
    proving: 'text-cipher-teal',
    submitting: 'text-auction-gold',
    confirmed: 'text-cipher-green',
    error: 'text-red-400',
  };

  return (
    <div className="space-y-4">
      <div className="glass-card-gold p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-auction-gold/10 border border-auction-gold/30 flex items-center justify-center">
              <Lock className="w-5 h-5 text-auction-gold" />
            </div>
            <div>
              <h2 className="font-display text-base font-bold text-white">SEALED BID CHAMBER</h2>
              <p className="text-xs font-mono text-slate-400">Your bid amount never leaves this device</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cipher-green animate-pulse" />
            <span className="text-cipher-green">ZK Ready</span>
          </div>
        </div>

        {!wallet.connected ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-midnight-800 border border-auction-gold/20 flex items-center justify-center">
              <Lock className="w-8 h-8 text-auction-gold/50" />
            </div>
            <p className="text-slate-400">Connect your wallet to place a sealed bid</p>
            <button onClick={() => { soundFx.playClick(); onConnectWallet(); }} className="btn-gold text-white">
              Connect Wallet
            </button>
          </div>
        ) : !ledgerState.auction_open ? (
          <div className="text-center py-8 space-y-3">
            <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
            <p className="text-amber-300 font-semibold">Bidding Period Has Ended</p>
            <p className="text-xs text-slate-400">The sealed bidding window is closed. Wait for finalization.</p>
          </div>
        ) : submitted && circuitStep === 'idle' ? (
          <div className="text-center py-8 space-y-3">
            <CheckCircle className="w-12 h-12 text-cipher-green mx-auto animate-winner-burst" />
            <p className="text-cipher-green font-display font-bold text-lg">BID SEALED!</p>
            <p className="text-sm text-slate-400">Your commitment is locked on-chain. No one can see your amount.</p>
            <button onClick={() => setSubmitted(false)} className="btn-ghost-gold text-sm">
              Place Another Bid
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Bid Input */}
            <div className="space-y-2">
              <label className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Your Bid Amount (tDUST)</span>
                <button
                  onClick={() => setShowAmount(s => !s)}
                  className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showAmount ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  {showAmount ? 'Hide' : 'Show'}
                </button>
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={e => setBidAmount(e.target.value)}
                  placeholder={`Min: ${ledgerState.reserve_price.toLocaleString()} tDUST`}
                  className="bid-input pr-24"
                  min={ledgerState.reserve_price}
                  step="1"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-auction-gold/60" />
                  <span className="text-xs font-mono text-auction-gold/60">PRIVATE</span>
                </div>
              </div>
              {numericAmount > 0 && numericAmount < ledgerState.reserve_price && (
                <p className="text-xs text-red-400 font-mono">⚠ Below reserve price: {ledgerState.reserve_price.toLocaleString()} tDUST</p>
              )}
            </div>

            {/* Live Commitment Hash Preview */}
            {liveHash && (
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Live Commitment Hash (Public)</span>
                <div className="relative overflow-hidden rounded-xl bg-midnight-900/80 border border-vault-purple/20 p-3">
                  <div className="absolute inset-0 holographic" />
                  <p className="font-mono text-xs text-vault-purple-light break-all relative z-10">
                    {liveHash}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-vault-purple/40 to-transparent animate-shimmer" />
                </div>
                <p className="text-[10px] font-mono text-slate-600">
                  ↑ This is all an adversary sees. Amount is cryptographically hidden.
                </p>
              </div>
            )}

            {/* ZK Step Indicator */}
            {isLoading && (
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-midnight-900/60 border border-auction-gold/20">
                <span className="w-4 h-4 border-2 border-auction-gold/30 border-t-auction-gold rounded-full animate-spin flex-shrink-0" />
                <span className={`text-sm font-mono ${STEP_COLORS[circuitStep]}`}>
                  {STEP_LABELS[circuitStep]}
                </span>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-400 font-mono bg-red-500/5 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!isValidAmount || isLoading}
              className="w-full btn-gold text-white font-bold py-4 text-base flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating ZK Proof...</>
              ) : (
                <><Zap className="w-5 h-5" /> Seal & Commit Bid</>
              )}
            </button>

            {/* Privacy notice */}
            <div className="flex items-start gap-2 text-[11px] font-mono text-slate-500">
              <Shield className="w-3.5 h-3.5 text-cipher-teal flex-shrink-0 mt-0.5" />
              <span>
                Your bid is encrypted client-side. Only the commitment hash ({truncateHash(liveHash || '0'.repeat(64))}) is stored on-chain.
                The ZK proof guarantees you meet the reserve without revealing your amount.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
