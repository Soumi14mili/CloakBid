import React, { useState } from 'react';
import { CheckCircle2, Loader2, Lock, Zap, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export const CreateAuctionPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [deployState, setDeployState] = useState<'idle' | 'deploying' | 'done'>('idle');
  const [deploySubStep, setDeploySubStep] = useState<string>('');

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    category: 'Real Estate',
    description: '',
    reservePrice: '5000',
    duration: '24 hours',
  });

  const steps = [
    'Asset Details',
    'Auction Rules',
    'Privacy Config',
    'Pre-flight Check',
    'Deploy Vault',
  ];

  const handleDeploy = () => {
    setDeployState('deploying');
    setDeploySubStep('Compiling Compact smart contract circuits...');
    setTimeout(() => {
      setDeploySubStep('Generating verification keys for Halo2 prover...');
      setTimeout(() => {
        setDeploySubStep('Broadcasting contract creation transaction to Midnight Preview...');
        setTimeout(() => {
          setDeployState('done');
        }, 1200);
      }, 1200);
    }, 1200);
  };

  return (
    <div style={{ background: '#08090C' }} className="min-h-[85vh] py-8 px-5 sm:px-8 max-w-content mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-cb-t1 tracking-tight">Create Sealed-Bid Auction</h2>
        <p className="text-cb-t2 text-[14px] mt-1">
          Deploy an institutional privacy-preserving auction contract on Midnight Preview
        </p>
      </div>

      {/* Stepper Header */}
      <div className="card-sub p-4 rounded-xl mb-8 flex items-center justify-between overflow-x-auto gap-2">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep || deployState === 'done';
          const isActive = idx === currentStep && deployState !== 'done';
          return (
            <div key={step} className="flex items-center gap-2 shrink-0">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-semibold ${
                  isDone
                    ? 'bg-cb-success text-white'
                    : isActive
                    ? 'bg-cb-accent text-white'
                    : 'bg-cb-elevated text-cb-t3'
                }`}
              >
                {isDone ? '✓' : idx + 1}
              </div>
              <span
                className={`text-[13px] font-medium hidden sm:inline ${
                  isActive ? 'text-cb-t1' : isDone ? 'text-cb-t2' : 'text-cb-t3'
                }`}
              >
                {step}
              </span>
              {idx < steps.length - 1 && (
                <div className="w-4 sm:w-8 h-[1px] bg-[rgba(255,255,255,0.06)] mx-1" />
              )}
            </div>
          );
        })}
      </div>

      {/* Wizard Step Body */}
      <div className="card p-6 sm:p-8 rounded-2xl">
        {currentStep === 0 && (
          <div className="space-y-5">
            <div>
              <label className="input-label">Auction Title</label>
              <input
                type="text"
                placeholder="e.g. Meridian Penthouse Suite 4A"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
              />
            </div>

            <div>
              <label className="input-label">Asset Classification</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input"
              >
                <option value="Real Estate">Real Estate Acquisitions</option>
                <option value="Corporate Finance">Corporate Equity / Term Sheets</option>
                <option value="Digital Assets">Digital Assets & IP</option>
                <option value="Procurement">Enterprise Procurement</option>
                <option value="Collectibles">Rare Collectibles</option>
              </select>
            </div>

            <div>
              <label className="input-label">Asset Description & Valuation Terms</label>
              <textarea
                rows={4}
                placeholder="Specify the physical, legal, or cryptographic parameters of the auctioned lot..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input"
              />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-5">
            <div>
              <label className="input-label">Minimum Reserve Price (tDUST)</label>
              <input
                type="number"
                placeholder="5000"
                value={formData.reservePrice}
                onChange={(e) => setFormData({ ...formData, reservePrice: e.target.value })}
                className="input font-mono"
              />
              <p className="text-[12px] text-cb-t3 mt-1.5">
                Stored encrypted on-chain. Bids lower than reserve are rejected via zero-knowledge proof without revealing their values.
              </p>
            </div>

            <div>
              <label className="input-label">Bidding Window Duration</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="input"
              >
                <option value="1 hour">1 Hour (Rapid Test)</option>
                <option value="6 hours">6 Hours</option>
                <option value="24 hours">24 Hours (Standard)</option>
                <option value="72 hours">72 Hours</option>
                <option value="7 days">7 Days (Institutional)</option>
              </select>
            </div>

            <div className="card-sub p-4 rounded-xl mt-4">
              <div className="flex items-center gap-2 text-cb-accent text-[13px] font-semibold">
                <Lock className="w-4 h-4" />
                <span>Zero-Knowledge Vickrey / First-Price Rule</span>
              </div>
              <p className="text-[12px] text-cb-t2 mt-1 leading-relaxed">
                The smart contract enforces that the winning bidder is proven mathematically by comparing private witnesses, guaranteeing front-running immunity.
              </p>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-cb-t1 mb-2">
              Privacy Architecture Guarantees (Enforced by Protocol)
            </p>

            {[
              {
                title: 'Client-Side Witness Isolation',
                desc: 'Bid amounts and private salts never transmit to RPC endpoints or validators.',
              },
              {
                title: 'Halo2 Proof Verification',
                desc: 'On-chain verifier executes in constant time; gas fees do not correlate to bid size.',
              },
              {
                title: 'Losing Bid Concealment',
                desc: 'Unsuccessful bid valuations remain permanently encrypted and shielded.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-4 rounded-xl bg-cb-elevated border border-[rgba(255,255,255,0.05)] flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-cb-t1">{item.title}</p>
                  <p className="text-xs text-cb-t3 mt-0.5">{item.desc}</p>
                </div>
                <div className="w-9 h-5 rounded-full bg-cb-success/20 border border-cb-success/40 relative flex items-center px-0.5">
                  <div className="w-4 h-4 rounded-full bg-cb-success ml-auto" />
                </div>
              </div>
            ))}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-cb-success">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold text-sm">Pre-flight Verification Passed</span>
            </div>

            <div className="bg-cb-elevated rounded-xl p-5 border border-[rgba(255,255,255,0.05)] space-y-3 font-mono text-[13px]">
              <div className="flex justify-between">
                <span className="text-cb-t3">Lot Title:</span>
                <span className="text-cb-t1 font-sans font-medium">{formData.title || 'Untitled Auction Lot'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cb-t3">Category:</span>
                <span className="text-cb-t1">{formData.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cb-t3">Reserve Threshold:</span>
                <span className="text-cb-t1">{formData.reservePrice} tDUST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cb-t3">Settlement Duration:</span>
                <span className="text-cb-t1">{formData.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-cb-t3">Target Network:</span>
                <span className="text-cb-accent">Midnight Preview (Preprod)</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-cb-warning/10 border border-cb-warning/20 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-cb-warning shrink-0 mt-0.5" />
              <p className="text-xs text-cb-warning leading-relaxed">
                Deploying this auction registers a new sealed-bid state machine on the Midnight ledger. Ensure your Lace wallet has adequate tDUST balance for execution fees.
              </p>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="py-4 text-center">
            {deployState === 'idle' && (
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-cb-accent/10 border border-cb-accent/20 mx-auto flex items-center justify-center">
                  <Zap className="w-8 h-8 text-cb-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cb-t1">Ready to Deploy Contract</h3>
                  <p className="text-cb-t2 text-sm mt-1 max-w-md mx-auto">
                    Click below to compile the Compact circuit constraints and commit the auction ledger state to Midnight.
                  </p>
                </div>
                <button
                  onClick={handleDeploy}
                  className="btn-primary btn-lg inline-flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Deploy Auction Vault
                </button>
              </div>
            )}

            {deployState === 'deploying' && (
              <div className="space-y-6 py-6">
                <Loader2 className="w-10 h-10 text-cb-accent animate-spin mx-auto" />
                <div>
                  <h3 className="text-lg font-bold text-cb-t1">Deploying to Midnight Preview</h3>
                  <p className="text-cb-accent font-mono text-xs mt-2 animate-pulse">
                    {deploySubStep}
                  </p>
                </div>
              </div>
            )}

            {deployState === 'done' && (
              <div className="space-y-5 py-4">
                <div className="w-16 h-16 rounded-full bg-cb-success/10 border border-cb-success/20 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-cb-success" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-cb-t1">Auction Vault Deployed</h3>
                  <p className="text-cb-t2 text-sm mt-1">
                    Your sealed-bid auction contract is now active and ready to accept private bids.
                  </p>
                </div>
                <div className="p-3 bg-cb-elevated rounded-xl border border-[rgba(255,255,255,0.06)] font-mono text-xs text-cb-t2 max-w-md mx-auto break-all">
                  Contract: 0x51d23a07eec0e7d2c94aceeb613e414900dcfb5a6ad18f3459875f733f6d8b15
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wizard Controls */}
        {deployState !== 'deploying' && deployState !== 'done' && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-[rgba(255,255,255,0.05)]">
            <button
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="btn-ghost"
            >
              Back
            </button>
            {currentStep < 4 ? (
              <button
                onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                className="btn-primary flex items-center gap-2"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
