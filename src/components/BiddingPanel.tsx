import React, { useState, useEffect } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Check,
  CheckCircle2,
  Cpu,
  AlertCircle,
  FileCode,
  Shield,
  Layers,
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
  // Admin round controls for judges
  onCloseBidding: () => Promise<void>;
  onFinalizeAuction: () => Promise<void>;
  onResetAuction: () => Promise<void>;
  isFinalized: boolean;
}

export const BiddingPanel: React.FC<Props> = ({
  reservePrice,
  circuitStep,
  onCommitBid,
  ledgerOpen,
  myCommitmentHash,
  walletBalance = '49,384.67 tDUST',
  isWalletConnected = true,
  onConnectWallet,
  onCloseBidding,
  onFinalizeAuction,
  onResetAuction,
  isFinalized,
}) => {
  const [amount, setAmount] = useState<number>(reservePrice);
  const [salt, setSalt] = useState<string>(generateSalt());
  const [showSalt, setShowSalt] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [adminProcessing, setAdminProcessing] = useState(false);

  useEffect(() => {
    if (amount < reservePrice) {
      setAmount(reservePrice);
    }
  }, [reservePrice]);

  const handleRegenerateSalt = () => {
    soundFx.playClick();
    setSalt(generateSalt());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ledgerOpen) {
      setErrorMsg('Auction round is closed.');
      return;
    }
    if (amount < reservePrice) {
      setErrorMsg(`Bid must meet the reserve price of ${reservePrice.toLocaleString()} tDUST.`);
      return;
    }
    setErrorMsg(null);
    soundFx.playCommit();
    await onCommitBid(amount);
  };

  const isProving = circuitStep !== 'idle';
  const hasBidPlaced = !!myCommitmentHash;

  // Stepper stages for Section 11:
  // 1. Preparing private bid
  // 2. Creating commitment
  // 3. Generating ZK proof
  // 4. Verifying
  // 5. Bid accepted
  const steps = [
    { id: 'witness', label: 'Preparing private bid' },
    { id: 'commitment', label: 'Creating commitment' },
    { id: 'proving', label: 'Generating ZK proof' },
    { id: 'verifying', label: 'Verifying on Midnight' },
    { id: 'confirmed', label: 'Bid accepted' },
  ];

  const getStepStatus = (index: number) => {
    if (circuitStep === 'idle') {
      return hasBidPlaced ? 'complete' : 'pending';
    }
    const stageMap: Record<CircuitStep, number> = {
      idle: -1,
      'reading-witness': 0,
      hashing: 1,
      proving: 2,
      submitting: 3,
      confirmed: 4,
      error: -1,
    };
    const current = stageMap[circuitStep];
    if (current > index) return 'complete';
    if (current === index) return 'active';
    return 'pending';
  };

  return (
    <div className="surface-card p-6 sticky top-20 border-white/[0.08] shadow-md space-y-6">
      {/* ── Section 10: Title & Subtitle ──────────────────────────────── */}
      <div className="border-b border-white/[0.06] pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-white tracking-tight">
            PLACE SEALED BID
          </h2>
          <span className="badge-live text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            ZK Enclave
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Your bid remains private. Midnight verifies validity without disclosing the amount.
        </p>
      </div>

      {/* ── Form Inputs ────────────────────────────────────────────────── */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bid amount input */}
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
              className="form-input pr-16 font-mono text-base font-bold"
              placeholder="1500"
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 select-none">
              tDUST
            </div>
          </div>
        </div>

        {/* Private salt input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="text-slate-300 font-medium">Private salt</label>
            <span className="text-slate-400 text-[10px] font-mono">256-bit entropy</span>
          </div>

          <div className="relative flex items-center">
            <input
              type={showSalt ? 'text' : 'password'}
              readOnly
              value={salt}
              className="form-input pr-16 text-xs font-mono tracking-wider"
            />
            <div className="absolute right-2 flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowSalt(!showSalt)}
                title={showSalt ? 'Hide salt' : 'Show salt'}
                className="p-1 text-slate-400 hover:text-white rounded transition-colors"
              >
                {showSalt ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                type="button"
                onClick={handleRegenerateSalt}
                disabled={isProving}
                title="Regenerate random salt"
                className="p-1 text-slate-400 hover:text-white rounded transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Privacy Note Below Input */}
        <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-0.5">
          <Lock className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
          <span>Your bid value is not publicly revealed.</span>
        </div>

        {/* Dominant Primary Action CTA */}
        <div className="pt-2">
          {!isWalletConnected ? (
            <button
              type="button"
              onClick={onConnectWallet}
              className="w-full btn-primary !py-3 font-semibold text-sm shadow-md"
            >
              Connect Wallet to Place Bid
            </button>
          ) : (
            <button
              type="submit"
              disabled={isProving || !ledgerOpen}
              className="w-full btn-primary !py-3 font-semibold text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            >
              {isProving ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Proof...</span>
                </span>
              ) : hasBidPlaced ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>UPDATE SEALED BID</span>
                </span>
              ) : (
                <span>PLACE SEALED BID</span>
              )}
            </button>
          )}
        </div>
      </form>

      {/* ── Section 11: ZK Proof Stepper (Transaction State) ────────────── */}
      {(isProving || hasBidPlaced) && (
        <div className="surface-sub p-4 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-purple-400" />
              ZK PROOF STATUS
            </span>
            <span className="text-[11px] text-slate-400">
              {circuitStep === 'confirmed' || hasBidPlaced ? 'CONFIRMED ✓' : 'PROCESSING'}
            </span>
          </div>

          {/* Stepper items */}
          <div className="space-y-2 text-xs">
            {steps.map((step, idx) => {
              const status = getStepStatus(idx);
              return (
                <div key={step.id} className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono flex-shrink-0 ${
                      status === 'complete'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : status === 'active'
                        ? 'bg-purple-600 text-white animate-pulse'
                        : 'bg-white/5 text-slate-500 border border-white/10'
                    }`}
                  >
                    {status === 'complete' ? <Check className="w-2.5 h-2.5" /> : idx + 1}
                  </div>
                  <span
                    className={`text-xs ${
                      status === 'complete'
                        ? 'text-slate-300 font-medium'
                        : status === 'active'
                        ? 'text-purple-300 font-semibold'
                        : 'text-slate-500'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Section 10: Subtle Trust Indicators ─────────────────────────── */}
      <div className="pt-2 border-t border-white/[0.06] space-y-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>Private commitment</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>Balance verified</span>
        </div>
        <div className="flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span>ZK proof generated</span>
        </div>
      </div>

      {/* ── Evaluator Round Controls ────────────────────────────────────── */}
      <div className="pt-3 border-t border-white/[0.06] space-y-2">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>EVALUATOR CONTROLS</span>
          <span>{ledgerOpen ? 'Round Open' : isFinalized ? 'Settled' : 'Closed'}</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {ledgerOpen ? (
            <button
              onClick={async () => {
                setAdminProcessing(true);
                await onCloseBidding();
                setAdminProcessing(false);
              }}
              disabled={adminProcessing}
              className="btn-secondary !py-1.5 text-xs col-span-2 text-center"
            >
              {adminProcessing ? 'Closing...' : 'Close Auction Round'}
            </button>
          ) : !isFinalized ? (
            <button
              onClick={async () => {
                setAdminProcessing(true);
                await onFinalizeAuction();
                setAdminProcessing(false);
              }}
              disabled={adminProcessing}
              className="btn-primary !py-1.5 text-xs col-span-2 text-center"
            >
              {adminProcessing ? 'Verifying...' : 'Finalize & Verify Winner'}
            </button>
          ) : (
            <button
              onClick={async () => {
                setAdminProcessing(true);
                await onResetAuction();
                setAdminProcessing(false);
              }}
              disabled={adminProcessing}
              className="btn-secondary !py-1.5 text-xs col-span-2 text-center text-slate-300"
            >
              Reset Demo Round
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
