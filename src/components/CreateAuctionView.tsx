import React, { useState } from 'react';
import {
  PlusCircle,
  Shield,
  Layers,
  FileText,
  Clock,
  Coins,
  CheckCircle2,
  AlertCircle,
  Cpu,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ExternalLink,
  Code2,
} from 'lucide-react';
import { soundFx } from '../utils/audio';

interface Props {
  onSuccess: (newLot: any) => void;
  onCancel: () => void;
}

export const CreateAuctionView: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [step, setStep] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Cryptographic Asset');
  const [reservePrice, setReservePrice] = useState('2000');
  const [durationHours, setDurationHours] = useState('24');
  const [minIncrement, setMinIncrement] = useState('100');
  const [provingSystem, setProvingSystem] = useState('Halo2-Compact-v4');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [deployedTxHash, setDeployedTxHash] = useState<string | null>(null);

  const steps = [
    { num: 1, label: 'Asset Details' },
    { num: 2, label: 'Auction Rules' },
    { num: 3, label: 'Privacy Config' },
    { num: 4, label: 'Pre-flight Review' },
    { num: 5, label: 'Deploy Vault' },
  ];

  const handleNext = () => {
    soundFx.playClick();
    setStep(prev => Math.min(prev + 1, 5));
  };

  const handleBack = () => {
    soundFx.playClick();
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleDeploy = async () => {
    soundFx.playClick();
    setIsDeploying(true);
    setDeployStep(1);

    // Simulate real Midnight deployment pipeline
    setTimeout(() => setDeployStep(2), 700);
    setTimeout(() => setDeployStep(3), 1500);
    setTimeout(() => {
      setDeployStep(4);
      const fakeTx = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      setDeployedTxHash(fakeTx);
      setIsDeploying(false);
      soundFx.playSuccess();
    }, 2400);
  };

  const handleComplete = () => {
    onSuccess({
      id: `cb-lot-00${Math.floor(Math.random() * 90) + 10}`,
      title: title || 'Midnight Private Genesis Asset',
      description: description || 'Confidential sealed-bid asset initialized on Midnight Preprod.',
      category,
      reservePrice: parseFloat(reservePrice) || 2000,
      endTime: Date.now() + parseInt(durationHours) * 3600 * 1000,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* ── Top Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-purple-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Deploy Confidential Auction
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Initialize a sealed-bid auction contract with client-side witness masking on Midnight Preprod.
          </p>
        </div>

        <button
          onClick={onCancel}
          className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
        >
          Cancel & Return
        </button>
      </div>

      {/* ── 5-Step Stepper Progress Bar ─────────────────────────────────── */}
      <div className="surface-card p-4 border-white/[0.08]">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {steps.map(s => {
            const isCompleted = step > s.num;
            const isCurrent = step === s.num;
            return (
              <div
                key={s.num}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isCurrent
                    ? 'border-purple-500/40 bg-purple-500/10'
                    : isCompleted
                    ? 'border-emerald-500/30 bg-emerald-500/[0.04]'
                    : 'border-white/[0.04] bg-slate-950/40 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400">
                    STEP 0{s.num}
                  </span>
                  {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                </div>
                <div
                  className={`text-xs font-medium mt-1 truncate ${
                    isCurrent ? 'text-purple-300 font-semibold' : 'text-slate-300'
                  }`}
                >
                  {s.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Step Content Panels ────────────────────────────────────────── */}
      <div className="surface-card p-6 sm:p-8 border-white/[0.08] space-y-6">
        {/* STEP 1: ASSET DETAILS */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                1. Asset Information & Identification
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Define the title, asset classification, and metadata for the confidential auction item.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Asset Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Zero-Knowledge Prover Node Cluster - Epoch 8"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="form-input text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="form-input text-xs"
                  >
                    <option value="Cryptographic Asset">Cryptographic Asset</option>
                    <option value="Infrastructure / Compute">Infrastructure / Compute</option>
                    <option value="AI / Private Weights">AI / Private Weights</option>
                    <option value="Real World Asset (RWA)">Real World Asset (RWA)</option>
                    <option value="Enterprise License">Enterprise License</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Asset Standard</label>
                  <input
                    type="text"
                    disabled
                    value="Midnight Shielded NFT / Token Standard"
                    className="form-input text-xs opacity-75 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide verifiable specifications and provenance details for prospective bidders..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="form-input text-xs resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: AUCTION RULES */}
        {step === 2 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                2. Sealed-Bid Economic Rules
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Set reserve constraints, round duration, and anti-sniping parameters.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Reserve Price (tDUST) *</label>
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    step="100"
                    value={reservePrice}
                    onChange={e => setReservePrice(e.target.value)}
                    className="form-input text-xs font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-[10px]">
                    tDUST
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">Minimum valuation required for winning claim.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Duration (Hours) *</label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="168"
                    value={durationHours}
                    onChange={e => setDurationHours(e.target.value)}
                    className="form-input text-xs font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-[10px]">
                    HRS
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">Deterministic block epoch expiration.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Min Increment (tDUST)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={minIncrement}
                    onChange={e => setMinIncrement(e.target.value)}
                    className="form-input text-xs font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-[10px]">
                    tDUST
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">ZK constraint granularity limit.</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-white/[0.06] flex items-start gap-3">
              <Clock className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <p className="font-medium text-white">Sealed Epoch Guarantee</p>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Unlike traditional auctions with rolling countdowns vulnerable to last-second sniping, CloakBid executes instantaneous epoch finality where all bids are locked simultaneously.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PRIVACY & PROVING PARAMETERS */}
        {step === 3 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                3. Zero-Knowledge Prover Configuration
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure Compact circuit constraints, salt entropy, and witness validation rules.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-purple-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-purple-300 font-semibold">Proving System</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300">
                    Active
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Halo2 PLONKish polynomial commitment scheme compiled via Midnight Compact compiler.
                </p>
                <div className="pt-2 text-[10px] text-slate-500">
                  Circuit ID: <span className="text-slate-300">cloakbid_auction_verifier_v4</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-400 font-semibold">Salt Entropy Requirement</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                    256-bit
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Cryptographically secure browser CSPRNG salt generation prevents rainbow table preimage attacks.
                </p>
                <div className="pt-2 text-[10px] text-slate-500">
                  Primitive: <span className="text-slate-300">Poseidon Hash on Pasta Curves</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PRE-FLIGHT REVIEW */}
        {step === 4 && (
          <div className="space-y-5 animate-in fade-in duration-150">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                4. Pre-Flight Verification & Parameter Summary
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Review compiled parameters prior to on-chain state initialization on Midnight Preprod.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/70 border border-white/[0.08] divide-y divide-white/[0.06] text-xs font-mono">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Asset Title:</span>
                <span className="text-white font-medium">{title || 'Confidential Asset #001'}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="text-purple-300">{category}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Reserve Price:</span>
                <span className="text-white font-bold">{reservePrice} tDUST</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Auction Duration:</span>
                <span className="text-white">{durationHours} Hours</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Target Network:</span>
                <span className="text-emerald-400">Midnight Preview (Preprod RPC)</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-slate-400">Estimated Gas Fee:</span>
                <span className="text-slate-300">0.0028 tDUST (~$0.0001)</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: DEPLOY VAULT */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in duration-150">
            <div>
              <h2 className="text-base font-semibold text-white tracking-tight">
                5. On-Chain Compact Vault Initialization
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Broadcast transaction to Midnight Preprod to instantiate the sealed-bid smart contract.
              </p>
            </div>

            {deployedTxHash ? (
              <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-950/15 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Auction Vault Successfully Deployed!
                  </h3>
                  <p className="text-xs text-slate-300 font-mono mt-1">
                    Verified on Midnight Preprod Consensus
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-white/10 font-mono text-xs text-slate-300 break-all select-all">
                  Tx Hash: {deployedTxHash}
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleComplete}
                    className="btn-primary text-xs !py-2.5 !px-6"
                  >
                    Open Live Auction Vault
                  </button>
                </div>
              </div>
            ) : isDeploying ? (
              <div className="p-8 rounded-xl bg-slate-950/60 border border-purple-500/20 space-y-5 text-center">
                <Cpu className="w-10 h-10 text-purple-400 animate-spin mx-auto" />
                <div>
                  <h4 className="text-sm font-semibold text-white font-mono">
                    {deployStep === 1 && 'Compiling Compact Smart Contract Bytecode...'}
                    {deployStep === 2 && 'Generating Circuit Verification Key (VK)...'}
                    {deployStep === 3 && 'Broadcasting Transaction to Midnight Preprod...'}
                    {deployStep === 4 && 'Confirming Block Consensus...'}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Please keep this window open while the transaction is finalized.
                  </p>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full transition-all duration-500"
                    style={{ width: `${deployStep * 25}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-white/[0.08] bg-slate-950/40 text-center space-y-4">
                <Sparkles className="w-10 h-10 text-purple-400 mx-auto" />
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Ready to Broadcast to Midnight Preprod
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                    Your wallet balance has sufficient tDUST to cover gas fees for contract initialization.
                  </p>
                </div>

                <button
                  onClick={handleDeploy}
                  className="btn-primary text-xs !py-3 !px-8 font-semibold shadow-lg shadow-purple-500/20"
                >
                  Confirm & Deploy Auction Vault
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── Bottom Stepper Controls ──────────────────────────────────── */}
        {!deployedTxHash && !isDeploying && (
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
            <button
              onClick={step === 1 ? onCancel : handleBack}
              className="btn-secondary text-xs !py-2 !px-4 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{step === 1 ? 'Cancel' : 'Previous Step'}</span>
            </button>

            {step < 5 ? (
              <button
                onClick={handleNext}
                className="btn-primary text-xs !py-2 !px-5 flex items-center gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
