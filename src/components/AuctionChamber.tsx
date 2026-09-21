import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Zap, Shield, AlertTriangle, CheckCircle, Sparkles, KeyRound } from 'lucide-react';
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
  ledgerState,
  circuitStep,
  wallet,
  onCommitBid,
  onConnectWallet,
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
      soundFx.playError();
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

  const applyPreset = (multiplier: number) => {
    soundFx.playKey();
    const calculated = Math.round(ledgerState.reserve_price * multiplier);
    setBidAmount(calculated.toString());
  };

  const STEP_LABELS: Record<CircuitStep, string> = {
    idle: '',
    'reading-witness': 'Allocating private witness registers...',
    hashing: 'Synthesizing Pedersen commitment (g^amount * h^salt)...',
    proving: 'Computing PLONK quotient & KZG commitment π...',
    submitting: 'Broadcasting zero-knowledge transaction to Midnight...',
    confirmed: 'Bid commitment anchored on-chain!',
    error: 'Proof generation aborted',
  };

  const STEP_COLORS: Record<CircuitStep, string> = {
    idle: 'text-slate-400',
    'reading-witness': 'text-vault-purple-light',
    hashing: 'text-auction-gold',
    proving: 'text-cipher-teal',
    submitting: 'text-auction-gold',
    confirmed: 'text-cipher-green',
    error: 'text-red-400',
  };

  return (
    <div className="space-y-4">
      <div className="glass-card-gold p-6 sm:p-8 space-y-6 cyber-cut">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-auction-gold/15 border border-auction-gold/40 flex items-center justify-center">
              <Lock className="w-5 h-5 text-auction-gold animate-pulse" />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-white tracking-wider">
                SEALED BID CHAMBER
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Your bid amount is zero-knowledge protected and never leaves this client
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-cipher-green animate-ping" />
            <span className="text-cipher-green font-semibold">ZK Sandbox Active</span>
          </div>
        </div>

        {!wallet.connected ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-midnight-900 border border-auction-gold/30 flex items-center justify-center">
              <KeyRound className="w-8 h-8 text-auction-gold/60" />
            </div>
            <div>
              <h4 className="text-slate-200 font-semibold text-sm">Wallet Authentication Required</h4>
              <p className="text-slate-400 text-xs mt-1">Connect your Midnight Lace wallet to formulate a sealed bid</p>
            </div>
            <button
              onClick={() => {
                soundFx.playClick();
                onConnectWallet();
              }}
              className="btn-gold text-white text-xs font-semibold py-3 px-6"
            >
              Connect Lace Wallet
            </button>
          </div>
        ) : !ledgerState.auction_open ? (
          <div className="text-center py-10 space-y-3">
            <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto animate-pulse" />
            <p className="text-amber-300 font-semibold font-display">SEALED BIDDING CONCLUDED</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              The cryptographic submission period is complete. Switch to Settlement to verify the ZK outcome.
            </p>
          </div>
        ) : submitted && circuitStep === 'idle' ? (
          <div className="text-center py-10 space-y-4">
            <CheckCircle className="w-14 h-14 text-cipher-green mx-auto animate-winner-burst" />
            <div>
              <p className="text-cipher-green font-display font-bold text-xl">BID CRYPTOGRAPHICALLY COMMITTED</p>
              <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
                Your commitment hash is locked on the Midnight Preprod ledger. No observer or competitor can deduce your valuation.
              </p>
            </div>
            <button
              onClick={() => {
                soundFx.playClick();
                setSubmitted(false);
              }}
              className="btn-ghost-gold text-xs font-semibold py-2.5 px-6"
            >
              Submit Another Sealed Bid
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Bid Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-auction-gold" />
                  Your Bid Amount (tDUST)
                </label>
                <button
                  onClick={() => {
                    soundFx.playHover();
                    setShowAmount(s => !s);
                  }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  {showAmount ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showAmount ? 'Hide Value' : 'Show Value'}</span>
                </button>
              </div>

              <div className="relative">
                <input
                  type={showAmount ? 'number' : 'password'}
                  value={bidAmount}
                  onChange={e => setBidAmount(e.target.value)}
                  placeholder={`Min Reserve: ${ledgerState.reserve_price.toLocaleString()} tDUST`}
                  className="bid-input pr-28"
                  min={ledgerState.reserve_price}
                  step="1"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 rounded bg-black/60 border border-auction-gold/30">
                  <Lock className="w-3 h-3 text-auction-gold" />
                  <span className="text-[10px] font-mono text-auction-gold font-bold">CLIENT_WITNESS</span>
                </div>
              </div>

              {/* Bid Preset Quick Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Presets:</span>
                {[
                  { label: 'Reserve (1.0x)', mult: 1.0 },
                  { label: '+15%', mult: 1.15 },
                  { label: '+30%', mult: 1.3 },
                  { label: '+50%', mult: 1.5 },
                  { label: '2.0x Double', mult: 2.0 },
                ].map(p => (
                  <button
                    key={p.label}
                    onClick={() => applyPreset(p.mult)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-auction-gold/50 hover:bg-auction-gold/10 text-[11px] font-mono text-slate-300 transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              {numericAmount > 0 && numericAmount < ledgerState.reserve_price && (
                <p className="text-xs text-red-400 font-mono mt-1">
                  ⚠ Error: Bid must be at least {ledgerState.reserve_price.toLocaleString()} tDUST
                </p>
              )}
            </div>

            {/* Live Real-time Cryptographic Preview */}
            {liveHash && (
              <div className="space-y-2 p-4 rounded-xl bg-midnight-900/90 border border-vault-purple/30">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-vault-purple-light" />
                    Live Pedersen Commitment Hash
                  </span>
                  <span className="text-vault-purple-light text-[10px]">256-BIT CSPRNG NONCE</span>
                </div>

                <div className="relative overflow-hidden rounded-lg bg-black/70 border border-vault-purple/20 p-3">
                  <div className="absolute inset-0 holographic pointer-events-none" />
                  <p className="font-mono text-xs text-vault-purple-light break-all relative z-10 select-all">
                    0x{liveHash}
                  </p>
                </div>
                <p className="text-[10px] font-mono text-slate-500">
                  ↑ This hash will be publicly recorded on the Midnight ledger. No adversary or miner can calculate your bid value.
                </p>
              </div>
            )}

            {/* ZK Step Loading Theater */}
            {isLoading && (
              <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-midnight-900/90 border border-auction-gold/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                <span className="w-5 h-5 border-2 border-auction-gold/30 border-t-auction-gold rounded-full animate-spin flex-shrink-0" />
                <span className={`text-xs sm:text-sm font-mono font-semibold ${STEP_COLORS[circuitStep]}`}>
                  {STEP_LABELS[circuitStep]}
                </span>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-400 font-mono bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit Sealed Bid Button */}
            <button
              onClick={handleSubmit}
              disabled={!isValidAmount || isLoading}
              onMouseEnter={() => soundFx.playHover()}
              className="w-full btn-gold text-white font-bold py-4 text-base flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cyber-cut"
            >
              {isLoading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Synthesizing ZK-SNARK Proof...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Seal & Commit Bid via Zero-Knowledge</span>
                </>
              )}
            </button>

            {/* Security Guarantee Banner */}
            <div className="flex items-start gap-2.5 text-[11px] font-mono text-slate-400 bg-black/40 p-3 rounded-xl border border-white/5">
              <Shield className="w-4 h-4 text-cipher-teal flex-shrink-0 mt-0.5" />
              <span>
                Dual-State Isolation: The amount is converted into a private witness in local browser memory.
                The PLONK arithmetic constraint strictly proves <code className="text-auction-gold">bid_amount &gt;= {ledgerState.reserve_price}</code> without public disclosure.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
