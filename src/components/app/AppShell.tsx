import React, { useState } from 'react';
import { AppNavbar } from './AppNavbar';
import { AuctionListView } from './AuctionListView';
import { AuctionDetailView } from './AuctionDetailView';
import { MyBidsPage } from './MyBidsPage';
import { CreateAuctionPage } from './CreateAuctionPage';
import { AnalyticsPage } from './AnalyticsPage';
import cloakVaultBanner from '../../assets/images/cloak_vault_banner.png';
import type { useCloakBid } from '../../hooks/useCloakBid';
import type { useLaceWallet } from '../../hooks/useLaceWallet';

interface Props {
  cloakBid: ReturnType<typeof useCloakBid>;
  laceWallet: ReturnType<typeof useLaceWallet>;
  onBackToLanding: () => void;
  initialTab?: 'auctions' | 'my-bids' | 'create' | 'analytics';
}

export const AppShell: React.FC<Props> = ({
  cloakBid,
  laceWallet,
  onBackToLanding,
  initialTab = 'auctions',
}) => {
  const [activeTab, setActiveTab] = useState<'auctions' | 'my-bids' | 'create' | 'analytics'>(initialTab);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

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
  } = cloakBid;

  const { wallet, connect, disconnect } = laceWallet;

  const handleSelectAndDetail = (lotId: string) => {
    selectLot(lotId);
    setViewMode('detail');
  };

  const handleTabChange = (tab: 'auctions' | 'my-bids' | 'create' | 'analytics') => {
    setActiveTab(tab);
    if (tab === 'auctions') {
      setViewMode('list');
    }
  };

  return (
    <div style={{ background: '#08090C' }} className="min-h-screen text-cb-t1 flex flex-col">
      <AppNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        wallet={wallet}
        onConnect={connect}
        onDisconnect={disconnect}
        onBackToLanding={onBackToLanding}
      />

      <main className="flex-1 pb-16 md:pb-8">
        {activeTab === 'auctions' && (
          viewMode === 'list' ? (
            <AuctionListView
              lots={lots}
              selectedLotId={selectedLotId}
              onSelectLot={selectLot}
              onViewDetail={handleSelectAndDetail}
            />
          ) : (
            <AuctionDetailView
              auction={auctionConfig}
              ledgerState={ledgerState}
              circuitStep={circuitStep}
              commitments={commitments}
              winner={winner}
              privacySnapshot={privacySnapshot}
              myCommitmentHash={myCommitmentHash}
              walletConnected={wallet.connected}
              onCommitBid={commitBid}
              onCloseBidding={closeBidding}
              onFinalize={finalizeAuction}
              onBack={() => setViewMode('list')}
            />
          )
        )}

        {activeTab === 'my-bids' && (
          <MyBidsPage
            commitments={commitments}
            lots={lots}
            myCommitmentHash={myCommitmentHash}
            walletConnected={wallet.connected}
            walletAddress={wallet.address}
          />
        )}

        {activeTab === 'create' && <CreateAuctionPage />}

        {activeTab === 'analytics' && (
          <AnalyticsPage
            commitments={commitments}
            ledgerState={ledgerState}
          />
        )}
      </main>

      {/* App bottom subtle bar */}
      <footer className="border-t border-[rgba(255,255,255,0.04)] py-8 px-5 sm:px-8 bg-cb-sub text-center text-xs text-cb-t3">
        <div className="max-w-content mx-auto space-y-6">
          <div className="overflow-hidden rounded-xl border border-[rgba(255,255,255,0.06)] bg-gradient-to-b from-[#12151B] to-[#08090C] p-2 shadow-lg max-w-4xl mx-auto">
            <img
              src={cloakVaultBanner}
              alt="CloakBid Zero-Knowledge Execution Vault"
              className="w-full h-auto object-cover rounded-lg"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span>CloakBid Protocol — Zero-Knowledge Sealed-Bid Infrastructure</span>
            <span className="font-mono">Midnight Preview Contract: 51d23a...8b15</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
