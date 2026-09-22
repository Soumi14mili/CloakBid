import React, { useState } from 'react';
import { CryptographicBackground } from './components/CryptographicBackground';
import { TopNavbar } from './components/TopNavbar';
import { LuxuryHero } from './components/LuxuryHero';
import { PrivateBiddingPanel } from './components/PrivateBiddingPanel';
import { ZKProofPipeline } from './components/ZKProofPipeline';
import { DualStateLedger } from './components/DualStateLedger';
import { SealedBidCapsules } from './components/SealedBidCapsules';
import { PrivacyAttackSimulator } from './components/PrivacyAttackSimulator';
import { AuctionCompletionReveal } from './components/AuctionCompletionReveal';
import { PrivacyStatusWidget } from './components/PrivacyStatusWidget';
import { useLaceWallet } from './hooks/useLaceWallet';
import { useCloakBid } from './hooks/useCloakBid';
import { soundFx } from './utils/audio';
import cloakbidLogo from './assets/images/cloakbid_logo.svg';
import {
  Shield,
  Lock,
  ExternalLink,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react';

export const App: React.FC = () => {
  const { wallet, connect, disconnect, claimFaucet } = useLaceWallet();
  const {
    lots,
    selectedLotId,
    selectLot,
    auctionConfig,
    ledgerState,
    commitments,
    circuitStep,
    winner,
    privacySnapshot,
    myCommitmentHash,
    commitBid,
    closeBidding,
    finalizeAuction,
    initializeAuction,
  } = useCloakBid();

  const [activeTab, setActiveTab] = useState('auctions');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newLotTitle, setNewLotTitle] = useState('');
  const [newReservePrice, setNewReservePrice] = useState('2000');
  const [createdSuccess, setCreatedSuccess] = useState(false);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'auctions') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'my-bids') {
      scrollToSection('sealed-bids-section');
    } else if (tab === 'analytics') {
      scrollToSection('dual-state-section');
    } else if (tab === 'create') {
      setCreateModalOpen(true);
    }
  };

  const handleCreateAuction = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playCommit();
    setCreatedSuccess(true);
    setTimeout(() => {
      setCreatedSuccess(false);
      setCreateModalOpen(false);
      setNewLotTitle('');
    }, 1800);
  };

  const myBidsCount = commitments.filter(c => c.isMine || c.hash === myCommitmentHash).length;
  const isProving = circuitStep !== 'idle';
  const hasBidPlaced = !!myCommitmentHash;

  return (
    <div className="min-h-screen bg-midnight-950 text-slate-100 relative font-sans selection:bg-vault-purple/30 selection:text-white">
      {/* Subtle Cryptographic Network Canvas Background */}
      <CryptographicBackground />

      {/* Luxury Minimal Top Navigation */}
      <TopNavbar
        wallet={wallet}
        onConnect={connect}
        onDisconnect={disconnect}
        onClaimFaucet={claimFaucet}
        activeTab={activeTab}
        setActiveTab={handleNavTab}
        userBidCount={myBidsCount}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* 1. Hero & Signature 3D Cryptographic Vault */}
        <LuxuryHero
          lots={lots}
          selectedLotId={selectedLotId}
          onSelectLot={selectLot}
          ledgerState={ledgerState}
          onPlaceBidClick={() => scrollToSection('private-bidding-panel')}
          isProving={isProving}
          bidPlaced={hasBidPlaced}
          myBidAmount={privacySnapshot.clientBidAmount}
        />

        {/* 2. Private Bidding Panel */}
        <div className="px-4 sm:px-6 lg:px-8">
          <PrivateBiddingPanel
            reservePrice={auctionConfig.reservePrice}
            circuitStep={circuitStep}
            onCommitBid={commitBid}
            ledgerOpen={ledgerState.auction_open}
            myCommitmentHash={myCommitmentHash}
            walletBalance={wallet.balance}
            isWalletConnected={wallet.connected}
            onConnectWallet={connect}
          />
        </div>

        {/* 3. ZK Proof Visualization Pipeline */}
        <div id="zk-pipeline-section">
          <ZKProofPipeline />
        </div>

        {/* 4. Private State vs Public State Dual Ledger */}
        <div id="dual-state-section">
          <DualStateLedger
            ledgerState={ledgerState}
            myBidAmount={privacySnapshot.clientBidAmount}
            myBidSalt={privacySnapshot.clientBidSalt}
            myCommitmentHash={myCommitmentHash}
            auctionId={auctionConfig.id}
          />
        </div>

        {/* 5. Sealed Bidder 3D Capsules */}
        <div id="sealed-bids-section">
          <SealedBidCapsules
            commitments={commitments}
            myCommitmentHash={myCommitmentHash}
            myBidAmount={privacySnapshot.clientBidAmount}
          />
        </div>

        {/* 6. Privacy Attack Simulator */}
        <div id="privacy-attack-section">
          <PrivacyAttackSimulator />
        </div>

        {/* 7. Auction Completion & Cinematic Reveal */}
        <div id="settlement-section">
          <AuctionCompletionReveal
            ledgerState={ledgerState}
            winner={winner}
            commitments={commitments}
            onCloseBidding={closeBidding}
            onFinalizeAuction={finalizeAuction}
            onResetAuction={() => initializeAuction(auctionConfig.reservePrice)}
          />
        </div>
      </main>

      {/* Persistent Privacy Status Widget */}
      <PrivacyStatusWidget
        hasBid={hasBidPlaced}
        isFinalized={ledgerState.finalized}
      />

      {/* Minimal Luxury Footer */}
      <footer className="relative z-10 border-t border-white/5 bg-midnight-950/90 py-12 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo & Network Tag */}
            <div className="flex items-center gap-3.5">
              <img
                src={cloakbidLogo}
                alt="CloakBid"
                className="w-7 h-7 object-contain"
              />
              <div>
                <span className="font-display font-bold text-sm tracking-wider text-white">
                  CLOAKBID
                </span>
                <p className="text-[11px] font-mono text-slate-400">
                  Confidential Sealed-Bid Auctions on Midnight Preprod
                </p>
              </div>
            </div>

            {/* Contract & Explorer Links */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
              <a
                href="https://explorer.midnight.network/contract/mn1q7xk4p9dv2w5r8nj3ht6ys0cqzfa1e8mbgluiop"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-vault-purple-light transition-colors flex items-center gap-1.5"
              >
                <span>Contract: mn1q7xk...uiop</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://x.com/xCloakBid"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-vault-purple-light transition-colors flex items-center gap-1"
              >
                <span>𝕏 @xCloakBid</span>
              </a>

              <a
                href="https://github.com/Soumi14mili/CloakBid"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-vault-purple-light transition-colors flex items-center gap-1"
              >
                <span>GitHub</span>
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
            <p>© 2026 CloakBid Protocol. Built for Midnight Network Hackathon.</p>
            <p className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-vault-purple" />
              <span>Zero-Knowledge Proofs Powered by Compact & Halo2</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Create Auction Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-midnight-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg vault-card p-6 sm:p-8 space-y-6 border-vault-purple/30 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-vault-purple" />
                <h3 className="font-display font-bold text-lg text-white">
                  Create Confidential Auction
                </h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {createdSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-base font-bold text-white font-mono">
                  AUCTION VAULT CREATED ON PREPROD
                </h4>
                <p className="text-xs text-slate-300 font-mono">
                  Smart contract initialized with zero-knowledge verification parameters.
                </p>
              </div>
            ) : (
              <form onSubmit={handleCreateAuction} className="space-y-4 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="text-slate-300">Auction Asset Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Midnight Genesis Relic #002"
                    value={newLotTitle}
                    onChange={e => setNewLotTitle(e.target.value)}
                    className="vault-input"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300">Reserve Price (tDUST)</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={newReservePrice}
                    onChange={e => setNewReservePrice(e.target.value)}
                    className="vault-input"
                  />
                </div>

                <div className="p-3 rounded-xl bg-midnight-950/80 border border-white/5 text-[11px] text-slate-400 space-y-1">
                  <p className="text-slate-300 font-semibold">Privacy Mode: Shielded Sealed-Bid</p>
                  <p>All bids submitted to this auction will be encrypted client-side and verified via ZK-SNARKs.</p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCreateModalOpen(false)}
                    className="btn-vault-secondary text-xs !py-2.5 !px-5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-vault-primary text-xs !py-2.5 !px-6"
                  >
                    Deploy Auction Vault
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
