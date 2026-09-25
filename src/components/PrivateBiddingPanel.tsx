import React, { useState, useEffect } from 'react';
import {
  Lock,
  Shield,
  Key,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  CheckCircle2,
  AlertCircle,
  Cpu,
} from 'lucide-react';
import type { CircuitStep } from '../types';
import { generateSalt } from '../utils/crypto';
import { soundFx } from '../utils/audio';

interface Props {
  reservePrice: number;
  circuitStep: CircuitStep;
  onCommitBid: (amount: number) => Promise<void>;
  ledgerOpen: boolean;
  myCommitmentHash: string | null;
  walletBalance?: string;
  isWalletConnected?: boolean;
  onConnectWallet?: () => void;
}

export const PrivateBiddingPanel: React.FC<Props> = ({
  reservePrice,
  circuitStep,
  onCommitBid,
  ledgerOpen,
  myCommitmentHash,
  walletBalance = '12,500.00 tDUST',
  isWalletConnected = true,
  onConnectWallet,
}) => {
  const [amount, setAmount] = useState<number>(reservePrice);
  const [salt, setSalt] = useState<string>(generateSalt());
  const [showSalt, setShowSalt] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);

  useEffect(() => {
    if (amount < reservePrice) {
      setAmount(reservePrice);
    }
  }, [reservePrice]);

  const handleRegenerateSalt = () => {
    soundFx.playClick();
    setSalt(generateSalt());
  };

  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ledgerOpen) {
      setInputError('Bidding is closed for this auction.');
      return;
    }
    if (amount < reservePrice) {
      setInputError(`Bid must be at least ${reservePrice.toLocaleString()} tDUST.`);
      return;
    }

    setInputError(null);
    soundFx.playCommit();
    await onCommitBid(amount);
  };

  const isProving = circuitStep !== 'idle';
  const hasBidPlaced = !!myCommitmentHash;

  // Step progress percentage calculation
  let progressPercent = 0;
  let statusText = 'Ready for proof generation';
  if (circuitStep === 'reading-witness') {
    progressPercent = 25;
    statusText = 'Formulating private witness parameters...';
  } else if (circuitStep === 'hashing') {
    progressPercent = 50;
    statusText = 'Computing 256-bit Pedersen commitment...';
  } else if (circuitStep === 'proving') {
    progressPercent = 75;
    statusText = 'Synthesizing PLONK zero-knowledge proof...';
  } else if (circuitStep === 'submitting') {
    progressPercent = 90;
    statusText = 'Broadcasting proof to Midnight Preprod...';
  } else if (circuitStep === 'confirmed') {
    progressPercent = 100;
    statusText = 'ZK Proof verified and sealed on-chain.';
  }

  return (
    <div id="private-bidding-panel" className="relative w-full max-w-2xl mx-auto my-10">
      {/* Clean Card Container */}
      <div className="vault-card p-6 sm:p-8 border-white/[0.08] shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-vault-purple/15 border border-vault-purple/30 flex items-center justify-center text-vault-purple-light">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                PLACE SEALED BID
              </h2>
              <p className="text-xs text-slate-400">
                Midnight ZK Enclave · Dual-State Protection
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Enclave Ready</span>
          </div>
        </div>

        {/* Section Description */}
        <div className="my-5 p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs sm:text-sm text-slate-300 leading-relaxed space-y-1">
          <p className="font-medium text-white">Your bid amount remains private.</p>
          <p className="text-slate-400">Midnight verifies bid validity without exposing the bid value.</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleBidSubmit} className="space-y-4">
          {/* Bid Amount Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-300 font-medium">Bid amount</label>
              <span className="text-slate-400 font-mono text-[11px]">
                Min: {reservePrice.toLocaleString()} tDUST
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                min={reservePrice}
                step={50}
                required
                disabled={isProving || !ledgerOpen}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="vault-input pr-20 font-bold text-base"
                placeholder="1,500"
              />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 select-none">
                tDUST
              </div>
            </div>
          </div>

          {/* Private Salt Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="text-slate-300 font-medium">Private salt</label>
              <span className="text-slate-400 text-[11px]">256-bit client nonce</span>
            </div>

            <div className="relative flex items-center">
              <input
                type={showSalt ? 'text' : 'password'}
                readOnly
                value={salt}
                className="vault-input pr-20 text-xs tracking-wider"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowSalt(!showSalt)}
                  title={showSalt ? 'Hide salt' : 'Show salt'}
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                >
                  {showSalt ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleRegenerateSalt}
                  disabled={isProving}
                  title="Generate new salt nonce"
                  className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-white/5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Validation error */}
          {inputError && (
            <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{inputError}</span>
            </div>
          )}

          {/* Subtle Progress Bar During Generation */}
          {isProving && (
            <div className="my-4 p-4 rounded-lg bg-midnight-950/80 border border-vault-purple/30 space-y-2.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-vault-purple-light font-semibold flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 animate-pulse" />
                  GENERATING ZERO-KNOWLEDGE PROOF
                </span>
                <span className="text-slate-400">{progressPercent}%</span>
              </div>

              {/* Precise progress bar */}
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-vault-purple transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <p className="text-[11px] font-mono text-slate-400 truncate">
                {statusText}
              </p>
            </div>
          )}

          {/* Primary Action Button */}
          <div className="pt-2">
            {!isWalletConnected ? (
              <button
                type="button"
                onClick={onConnectWallet}
                className="w-full btn-vault-primary !py-3 font-semibold text-sm"
              >
                Connect Wallet to Place Sealed Bid
              </button>
            ) : (
              <button
                type="submit"
                disabled={isProving || !ledgerOpen}
                className="w-full btn-vault-primary !py-3 font-semibold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProving ? (
                  <span className="flex items-center justify-center gap-2 font-mono">
                    <RefreshCw className="w-4 h-4 animate-spin text-vault-purple-light" />
                    <span>SYNTHESIZING PROOF...</span>
                  </span>
                ) : hasBidPlaced ? (
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>UPDATE SEALED BID</span>
                  </span>
                ) : (
                  <span>GENERATE ZK PROOF</span>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Secondary information */}
        <p className="mt-3.5 text-center text-xs text-slate-400">
          Your bid will be committed privately before submission.
        </p>

        {/* Small Trust Indicators */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Bid remains private</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Balance requirement verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>ZK proof generated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>On-chain verification</span>
          </div>
        </div>
      </div>
    </div>
  );
};
