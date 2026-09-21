import React, { useState } from 'react';
import { CosmicAuctionBackground } from './components/CosmicAuctionBackground';
import { AuctionHeader } from './components/AuctionHeader';
import { AuctionHero } from './components/AuctionHero';
import { AuctionStats } from './components/AuctionStats';
import { AuctionPhaseStepper } from './components/AuctionPhaseStepper';
import { AuctionChamber } from './components/AuctionChamber';
import { BidCommitmentVault } from './components/BidCommitmentVault';
import { ZKBidProver } from './components/ZKBidProver';
import { WinnerReveal } from './components/WinnerReveal';
import { PrivacyShieldPanel } from './components/PrivacyShieldPanel';
import { BidHistoryTimeline } from './components/BidHistoryTimeline';
import { AdminPanel } from './components/AdminPanel';
import { ContractBanner } from './components/ContractBanner';
import { NetworkPulse } from './components/NetworkPulse';
import { useLaceWallet } from './hooks/useLaceWallet';
import { useCloakBid } from './hooks/useCloakBid';
import { soundFx } from './utils/audio';
import {
  Gavel,
  Shield,
  Trophy,
  Clock,
  Lock,
  Settings,
  Cpu,
  BookOpen,
  Github,
  ExternalLink,
} from 'lucide-react';

type Tab = 'bid' | 'vault' | 'prover' | 'settlement' | 'privacy' | 'history' | 'admin';

export const App: React.FC = () => {
  const { wallet, isLaceAvailable, connect, disconnect, claimFaucet } = useLaceWallet();
  const {
    lots,
    selectedLotId,
    selectLot,
    auctionConfig,
    ledgerState,
    commitments,
    circuitStep,
    transactions,
    winner,
    privacySnapshot,
    myCommitmentHash,
    commitBid,
    closeBidding,
    finalizeAuction,
    initializeAuction,
  } = useCloakBid();

  const [activeTab, setActiveTab] = useState<Tab>('bid');
  const [proverDismissed, setProverDismissed] = useState(false);

  const handleTab = (t: Tab) => {
    soundFx.playClick();
    setActiveTab(t);
  };

  const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode; color: string; badge?: string }> = [
    { id: 'bid', label: 'Bid Chamber', icon: <Lock className="w-4 h-4" />, color: 'auction-gold' },
    {
      id: 'vault',
      label: 'Commitment Vault',
      icon: <Shield className="w-4 h-4" />,
      color: 'vault-purple',
      badge: commitments.length > 0 ? commitments.length.toString() : undefined,
    },
    {
      id: 'prover',
      label: 'ZK Prover',
      icon: <Cpu className="w-4 h-4" />,
      color: 'cipher-teal',
      badge: circuitStep !== 'idle' ? '●' : undefined,
    },
    { id: 'settlement', label: 'Settlement', icon: <Trophy className="w-4 h-4" />, color: 'auction-gold' },
    { id: 'privacy', label: 'Privacy Audit', icon: <Shield className="w-4 h-4" />, color: 'amber' },
    {
      id: 'history',
      label: 'Transactions',
      icon: <Clock className="w-4 h-4" />,
      color: 'slate',
      badge: transactions.length > 0 ? transactions.length.toString() : undefined,
    },
    { id: 'admin', label: 'Admin', icon: <Settings className="w-4 h-4" />, color: 'vault-purple' },
  ];

  const TAB_ACTIVE_CLASSES: Record<Tab, string> = {
    bid: 'bg-gradient-to-r from-auction-gold/20 to-amber-600/20 text-auction-gold border-auction-gold/50 shadow-[0_0_12px_-2px_rgba(245,158,11,0.4)]',
    vault: 'bg-gradient-to-r from-vault-purple/20 to-indigo-600/20 text-vault-purple-light border-vault-purple/50 shadow-[0_0_12px_-2px_rgba(139,92,246,0.4)]',
    prover: 'bg-gradient-to-r from-cipher-teal/20 to-blue-600/20 text-cipher-teal border-cipher-teal/50 shadow-[0_0_12px_-2px_rgba(6,182,212,0.4)]',
    settlement: 'bg-gradient-to-r from-auction-gold/20 to-amber-600/20 text-auction-gold border-auction-gold/50 shadow-[0_0_12px_-2px_rgba(245,158,11,0.4)]',
    privacy: 'bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-400 border-amber-500/50 shadow-[0_0_12px_-2px_rgba(245,158,11,0.3)]',
    history: 'bg-gradient-to-r from-slate-600/20 to-slate-700/20 text-slate-300 border-slate-500/50',
    admin: 'bg-gradient-to-r from-vault-purple/20 to-pink-600/20 text-vault-purple-light border-vault-purple/50 shadow-[0_0_12px_-2px_rgba(139,92,246,0.4)]',
  };

  return (
    <div className="min-h-screen bg-midnight-950 text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-auction-gold/30 selection:text-auction-gold-light">
      {/* Animated cosmic background */}
      <CosmicAuctionBackground />

      {/* ZK Prover fullscreen theater */}
      <ZKBidProver
        isOpen={circuitStep !== 'idle' && !proverDismissed}
        circuitStep={circuitStep}
        onClose={() => setProverDismissed(true)}
      />

      {/* Header */}
      <AuctionHeader
        wallet={wallet}
        isLaceAvailable={isLaceAvailable}
        onConnect={connect}
        onDisconnect={disconnect}
        onClaimFaucet={claimFaucet}
      />

      {/* Main */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 space-y-5">

        {/* Hero */}
        <AuctionHero
          config={auctionConfig}
          lots={lots}
          selectedLotId={selectedLotId}
          onSelectLot={selectLot}
          ledgerState={ledgerState}
          onOpenBid={() => handleTab('bid')}
          onOpenVault={() => handleTab('vault')}
        />

        {/* Network pulse */}
        <NetworkPulse />

        {/* Contract banner */}
        <ContractBanner />

        {/* Stats row */}
        <AuctionStats ledgerState={ledgerState} />

        {/* Phase stepper */}
        <AuctionPhaseStepper ledgerState={ledgerState} />

        {/* Navigation tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-midnight-800/80 scrollbar-none">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTab(tab.id)}
              className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all whitespace-nowrap flex items-center gap-2 flex-shrink-0 ${
                activeTab === tab.id
                  ? TAB_ACTIVE_CLASSES[tab.id]
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-midnight-800/80'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-midnight-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div className="min-h-[400px]">
          {activeTab === 'bid' && (
            <AuctionChamber
              ledgerState={ledgerState}
              circuitStep={circuitStep}
              wallet={wallet}
              onCommitBid={async (amount) => {
                setProverDismissed(false);
                await commitBid(amount);
              }}
              onConnectWallet={connect}
            />
          )}
          {activeTab === 'vault' && (
            <BidCommitmentVault
              commitments={commitments}
              myCommitmentHash={myCommitmentHash}
            />
          )}
          {activeTab === 'prover' && (
            <div className="glass-card p-8 text-center space-y-4">
              <Cpu className="w-12 h-12 text-cipher-teal mx-auto animate-glow-breathe" />
              <h3 className="font-display text-lg font-bold text-white">ZK PROVER CONSOLE</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                The ZK proof theater opens automatically when you submit a bid.
                Place a bid in the <strong className="text-auction-gold">Bid Chamber</strong> to see the full proof generation sequence.
              </p>
              <div className="grid grid-cols-3 gap-4 mt-4 max-w-sm mx-auto">
                {['PLONK', 'Pedersen', 'Groth16'].map(alg => (
                  <div key={alg} className="px-3 py-2 rounded-lg bg-cipher-teal/10 border border-cipher-teal/20 text-xs font-mono text-cipher-teal">
                    {alg}
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'settlement' && (
            <WinnerReveal winner={winner} myCommitmentHash={myCommitmentHash} />
          )}
          {activeTab === 'privacy' && (
            <PrivacyShieldPanel snapshot={privacySnapshot} />
          )}
          {activeTab === 'history' && (
            <BidHistoryTimeline transactions={transactions} />
          )}
          {activeTab === 'admin' && (
            <AdminPanel
              ledgerState={ledgerState}
              circuitStep={circuitStep}
              onInitialize={initializeAuction}
              onCloseBidding={closeBidding}
              onFinalize={finalizeAuction}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-midnight-800/80 bg-midnight-950/90 backdrop-blur-md py-8 relative z-10 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/images/cloakbid_logo.svg"
              alt="CloakBid"
              className="w-6 h-6 object-contain filter drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]"
            />
            <span className="text-xs font-mono text-slate-400">
              CloakBid · Confidential Sealed-Bid Auctions on Midnight Preprod
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-400 font-mono">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-auction-gold transition-colors flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href="https://docs.midnight.network"
              target="_blank"
              rel="noreferrer"
              className="hover:text-auction-gold transition-colors flex items-center gap-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Midnight Docs</span>
            </a>
            <a
              href="https://explorer.midnight.network"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cipher-teal transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Explorer</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
