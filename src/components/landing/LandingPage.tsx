import React from 'react';
import { LandingNavbar } from './LandingNavbar';
import { HeroSection } from './HeroSection';
import { TrustStrip } from './TrustStrip';
import { ProblemSection } from './ProblemSection';
import { SolutionFlow } from './SolutionFlow';
import { HowItWorks } from './HowItWorks';
import { StateVisualization } from './StateVisualization';
import { ComparisonSection } from './ComparisonSection';
import { ProductPreview } from './ProductPreview';
import { SecuritySection } from './SecuritySection';
import { UseCases } from './UseCases';
import { MidnightSection } from './MidnightSection';
import { DeveloperSection } from './DeveloperSection';
import { FinalCTA } from './FinalCTA';
import { LandingFooter } from './LandingFooter';

interface Props {
  onEnterApp: () => void;
  onConnectWallet: () => Promise<void>;
  walletConnected: boolean;
}

export const LandingPage: React.FC<Props> = ({
  onEnterApp,
  onConnectWallet,
  walletConnected,
}) => {
  return (
    <div style={{ background: '#08090C' }} className="overflow-x-hidden">
      <LandingNavbar
        onEnterApp={onEnterApp}
        onConnectWallet={onConnectWallet}
        walletConnected={walletConnected}
      />

      <main>
        <HeroSection
          onEnterApp={onEnterApp}
          onConnectWallet={onConnectWallet}
          walletConnected={walletConnected}
        />

        <TrustStrip />
        <ProblemSection />
        <SolutionFlow />
        <HowItWorks />
        <StateVisualization />
        <ComparisonSection />
        <ProductPreview onEnterApp={onEnterApp} />
        <SecuritySection />
        <UseCases />
        <MidnightSection />
        <DeveloperSection />
        <FinalCTA onEnterApp={onEnterApp} />
      </main>

      <LandingFooter onEnterApp={onEnterApp} />
    </div>
  );
};
