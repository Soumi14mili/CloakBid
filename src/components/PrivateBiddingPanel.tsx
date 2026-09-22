import React, { useState, useEffect } from 'react';
import {
  Lock,
  Shield,
  Key,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Cpu,
  AlertCircle,
} from 'lucide-react';
import type { CircuitStep, LedgerState } from '../types';
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

  // Sync amount when reserve price changes
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

  // Step mapping for the 5 visual stages:
  // ENTER BID -> ENCRYPTING -> GENERATING ZK PROOF -> VERIFYING -> SEALED BID ACCEPTED ✓
  const getStageIndex = (): number => {
    switch (circuitStep) {
      case 'idle':
        return myCommitmentHash ? 4 : 0;
      case 'reading-witness':
      case 'hashing':
        return 1; // ENCRYPTING
      case 'proving':
        return 2; // GENERATING ZK PROOF
      case 'submitting':
        return 3; // VERIFYING
      case 'confirmed':
        return 4; // SEALED BID ACCEPTED
      default:
        return 0;
    }
  };

  const currentStage = getStageIndex();
  const isProcessing = circuitStep !== 'idle';

  const stages = [
    { label: 'ENTER BID', desc: 'Private witness setup' },
    { label: 'ENCRYPTING', desc: 'Computing 256-bit commitment' },
    { label: 'GENERATING ZK PROOF', desc: 'Halo2 / PLONK circuit constraint' },
    { label: 'VERIFYING', desc: 'Midnight Preprod dual-state check' },
    { label: 'SEALED BID ACCEPTED', desc: 'Zero information disclosed' },
  ];

  return (
    <div id="private-bidding-panel" className="relative w-full max-w-2xl mx-auto my-12">
      {/* Outer ambient glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-vault-purple/30 via-cipher-teal/20 to-vault-purple/30 rounded-3xl blur-xl opacity-50 pointer-events-none" />

      {/* Floating Glass Panel */}
      <div className="relative vault-card p-6 sm:p-8 border-vault-purple/30 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-vault-purple/20 border border-vault-purple/40 flex items-center justify-center text-vault-purple-light">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                PLACE SEALED BID
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Midnight ZK-Shielded Escrow
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ENCLAVE READY
          </span>
        </div>

        {/* Reassurance Callout */}
        <div className="my-6 p-4 rounded-xl bg-midnight-950/70 border border-vault-purple/20 flex items-start gap-3">
          <Shield className="w-5 h-5 text-vault-purple-light flex-shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong className="text-white font-medium">Your bid amount remains private. </strong>
            Midnight verifies the validity of your bid without exposing its value to the auctioneer, other bidders, or the public ledger.
          </p>
        </div>

        {/* Circular Cryptographic Reactor Visualization (Active during proving) */}
        {isProcessing && (
          <div className="my-6 p-6 rounded-2xl bg-midnight-950/90 border border-vault-purple/40 flex flex-col items-center justify-center space-y-4">
            {/* Reactor Rings */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-vault-purple/40 animate-ring-rotate" />
              <div className="absolute inset-2 rounded-full border border-cyan-400/40 animate-ring-rotate-reverse" />
              <div className="absolute inset-5 rounded-full bg-vault-purple/20 blur-md animate-pulse" />
              <div className="relative w-12 h-12 rounded-full bg-midnight-900 border border-vault-purple flex items-center justify-center shadow-vault-glow">
                <Cpu className="w-6 h-6 text-vault-purple-light animate-pulse" />
              </div>
            </div>

            <div className="text-center space-y-1">
              <p className="font-mono text-sm font-bold text-white tracking-wide">
                {stages[currentStage].label}
              </p>
              <p className="text-xs font-mono text-cipher-teal">
                {stages[currentStage].desc}
              </p>
            </div>
          </div>
        )}

        {/* Multi-Stage Visual Step Indicators */}
        <div className="grid grid-cols-5 gap-1.5 mb-8">
          {stages.map((stage, idx) => {
            const isDone = currentStage > idx;
            const isCurrent = currentStage === idx;
            return (
              <div key={idx} className="flex flex-col items-center text-center">
                <div
                  className={`w-full h-1.5 rounded-full transition-all duration-500 mb-2 ${
                    isDone
                      ? 'bg-emerald-400 shadow-[0_0_8px_#34D399]'
                      : isCurrent
                      ? 'bg-vault-purple animate-pulse shadow-[0_0_10px_#8B5CF6]'
                      : 'bg-white/10'
                  }`}
                />
                <span
                  className={`text-[9px] font-mono leading-tight ${
                    isCurrent
                      ? 'text-vault-purple-light font-bold'
                      : isDone
                      ? 'text-emerald-400'
                      : 'text-slate-600'
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Bid Form */}
        <form onSubmit={handleBidSubmit} className="space-y-6">
          {/* Bid Amount Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <label htmlFor="bid-amount" className="text-slate-300 font-medium">
                Bid Amount
              </label>
              <span className="text-slate-400">
                Reserve: <strong className="text-slate-200">{reservePrice.toLocaleString()} tDUST</strong>
              </span>
            </div>

            <div className="relative">
              <input
                id="bid-amount"
                type="number"
                min={reservePrice}
                step="50"
                value={amount}
                disabled={isProcessing}
                onChange={e => setAmount(Math.max(0, Number(e.target.value)))}
                className="vault-input text-lg font-bold pr-20"
                placeholder={reservePrice.toString()}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                <span className="text-xs font-mono font-bold text-vault-purple-light bg-vault-purple/20 px-2 py-1 rounded">
                  tDUST
                </span>
              </div>
            </div>

            {/* Quick amount increments */}
            <div className="flex items-center gap-2 pt-1">
              {[100, 500, 1000].map(inc => (
                <button
                  key={inc}
                  type="button"
                  disabled={isProcessing}
                  onClick={() => {
                    soundFx.playClick();
                    setAmount(prev => prev + inc);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-slate-300 border border-white/5 transition-colors"
                >
                  +{inc}
                </button>
              ))}
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => {
                  soundFx.playClick();
                  setAmount(reservePrice);
                }}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-slate-400 border border-white/5 ml-auto"
              >
                Reset to Reserve
              </button>
            </div>
          </div>

          {/* Secret Salt Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <label htmlFor="secret-salt" className="text-slate-300 font-medium flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-cipher-teal" />
                <span>Secret 256-Bit Salt</span>
              </label>
              <button
                type="button"
                onClick={handleRegenerateSalt}
                disabled={isProcessing}
                className="text-[11px] text-cipher-teal hover:underline flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Regenerate</span>
              </button>
            </div>

            <div className="relative">
              <input
                id="secret-salt"
                type={showSalt ? 'text' : 'password'}
                value={salt}
                readOnly
                disabled={isProcessing}
                className="vault-input text-xs tracking-wider pr-10 text-slate-400"
              />
              <button
                type="button"
                onClick={() => setShowSalt(!showSalt)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
              >
                {showSalt ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Blinds your bid into an unbreakable cryptographic commitment before leaving your device.
            </p>
          </div>

          {inputError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{inputError}</span>
            </div>
          )}

          {/* Action Button */}
          {!isWalletConnected ? (
            <button
              type="button"
              onClick={onConnectWallet}
              className="w-full btn-vault-primary !py-4 text-sm font-semibold"
            >
              <span>CONNECT LACE WALLET TO BID</span>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isProcessing || !ledgerOpen}
              className={`w-full btn-vault-primary !py-4 text-sm font-semibold tracking-wider ${
                isProcessing ? 'opacity-80 cursor-wait' : ''
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>SYNTHESIZING ZERO-KNOWLEDGE PROOF...</span>
                </span>
              ) : myCommitmentHash ? (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>SUBMIT ANOTHER SEALED BID</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>GENERATE ZK PROOF</span>
                </span>
              )}
            </button>
          )}
        </form>

        {/* Accepted Commitment Receipt */}
        {myCommitmentHash && !isProcessing && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-start gap-3 animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-xs font-mono font-bold text-emerald-300">
                SEALED BID RECORDED ON MIDNIGHT
              </p>
              <p className="text-xs text-slate-300 leading-relaxed font-mono break-all">
                Hash: <span className="text-white">{myCommitmentHash}</span>
              </p>
              <p className="text-[11px] text-slate-400">
                Your bid amount is zero-knowledge shielded. The contract only knows your bid is valid and meets the reserve.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
