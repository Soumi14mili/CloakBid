import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { DashboardOverview } from './components/DashboardOverview';
import { AuctionDetail } from './components/AuctionDetail';
import { MyBidsView } from './components/MyBidsView';
import { CreateAuctionView } from './components/CreateAuctionView';
import { AnalyticsView } from './components/AnalyticsView';
import { Footer } from './components/Footer';
import { useLaceWallet } from './hooks/useLaceWallet';
import { useCloakBid } from './hooks/useCloakBid';
import { soundFx } from './utils/audio';

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

  // Navigation state: 'auctions' | 'my-bids' | 'create' | 'analytics'
  const [activeTab, setActiveTab] = useState<string>('auctions');

  // Sub-view for auctions: 'overview' (all lots) or 'detail' (selected lot)
  const [auctionViewMode, setAuctionViewMode] = useState<'overview' | 'detail'>('overview');

  const handleSelectAuction = (lotId: string) => {
    selectLot(lotId);
    setAuctionViewMode('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToOverview = () => {
    setAuctionViewMode('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavTab = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'auctions') {
      // Return to overview if clicking Auctions
      setAuctionViewMode('overview');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuctionCreated = (newLot: any) => {
    setActiveTab('auctions');
    setAuctionViewMode('detail');
  };

  const userBidCount = commitments.filter(
    c => c.isMine || c.hash === myCommitmentHash
  ).length;

  const currentLot = lots.find(l => l.id === selectedLotId) || auctionConfig;

  return (
    <div className="min-h-screen bg-[#080B11] text-slate-100 flex flex-col font-sans selection:bg-purple-600/30 selection:text-white">
      {/* Subtle coordinate dot pattern background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Global Minimalist Navigation Bar */}
      <Navbar
        wallet={wallet}
        onConnect={connect}
        onDisconnect={disconnect}
        onClaimFaucet={claimFaucet}
        activeTab={activeTab}
        setActiveTab={handleNavTab}
        userBidCount={userBidCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* AUCTIONS TAB */}
        {activeTab === 'auctions' && (
          <>
            {auctionViewMode === 'overview' ? (
              <DashboardOverview
                lots={lots}
                selectedLotId={selectedLotId}
                onSelectAuction={handleSelectAuction}
                ledgerState={ledgerState}
                myCommitmentHash={myCommitmentHash}
              />
            ) : (
              <AuctionDetail
                lot={currentLot}
                onBack={handleBackToOverview}
                ledgerState={ledgerState}
                circuitStep={circuitStep}
                commitments={commitments}
                winner={winner}
                privacySnapshot={privacySnapshot}
                myCommitmentHash={myCommitmentHash}
                wallet={wallet}
                onCommitBid={commitBid}
                onConnectWallet={connect}
                onCloseBidding={closeBidding}
                onFinalizeAuction={finalizeAuction}
                onResetAuction={async () => {
                  await initializeAuction(currentLot.reservePrice);
                }}
              />
            )}
          </>
        )}

        {/* MY BIDS TAB */}
        {activeTab === 'my-bids' && (
          <MyBidsView
            commitments={commitments}
            myCommitmentHash={myCommitmentHash}
            myBidAmount={privacySnapshot.clientBidAmount}
            myBidSalt={privacySnapshot.clientBidSalt}
            lots={lots}
            onSelectAuction={handleSelectAuction}
            ledgerState={ledgerState}
          />
        )}

        {/* CREATE AUCTION TAB */}
        {activeTab === 'create' && (
          <CreateAuctionView
            onSuccess={handleAuctionCreated}
            onCancel={() => setActiveTab('auctions')}
          />
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && <AnalyticsView />}
      </main>

      {/* Clean Minimalist Footer */}
      <Footer />
    </div>
  );
};
