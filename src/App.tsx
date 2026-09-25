import React, { useState } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { AppShell } from './components/app/AppShell';
import { useCloakBid } from './hooks/useCloakBid';
import { useLaceWallet } from './hooks/useLaceWallet';

export const App: React.FC = () => {
  const cloakBid = useCloakBid();
  const laceWallet = useLaceWallet();

  // Mode: 'landing' (marketing & architecture showcase) or 'app' (live auction console)
  const [mode, setMode] = useState<'landing' | 'app'>('landing');
  const [initialAppTab, setInitialAppTab] = useState<'auctions' | 'my-bids' | 'create' | 'analytics'>('auctions');

  const handleEnterApp = (targetTab: 'auctions' | 'my-bids' | 'create' | 'analytics' = 'auctions') => {
    setInitialAppTab(targetTab);
    setMode('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLanding = () => {
    setMode('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConnectWalletFromLanding = async () => {
    await laceWallet.connect();
    // After connecting, take user directly into app
    handleEnterApp('auctions');
  };

  return (
    <div className="min-h-screen bg-cb-base text-cb-t1 selection:bg-cb-accent/20">
      {mode === 'landing' ? (
        <LandingPage
          onEnterApp={() => handleEnterApp('auctions')}
          onConnectWallet={handleConnectWalletFromLanding}
          walletConnected={laceWallet.wallet.connected}
        />
      ) : (
        <AppShell
          cloakBid={cloakBid}
          laceWallet={laceWallet}
          onBackToLanding={handleBackToLanding}
          initialTab={initialAppTab}
        />
      )}
    </div>
  );
};

export default App;
