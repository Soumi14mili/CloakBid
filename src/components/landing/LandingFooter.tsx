import React from 'react';
import { Shield, Github, ExternalLink } from 'lucide-react';
import cloakVaultBanner from '../../assets/images/cloak_vault_banner.png';

interface Props {
  onEnterApp: () => void;
}

interface FooterLinkItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface FooterColumnProps {
  heading: string;
  links: FooterLinkItem[];
}

const FooterColumn: React.FC<FooterColumnProps> = ({ heading, links }) => (
  <div>
    <p className="text-[11px] font-semibold uppercase tracking-widest text-cb-t3 mb-4">
      {heading}
    </p>
    <ul className="space-y-0.5">
      {links.map((link) => (
        <li key={link.label}>
          {link.href ? (
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-[13px] text-cb-t2 hover:text-cb-t1 transition-colors py-1"
            >
              {link.label}
            </a>
          ) : (
            <button
              onClick={link.onClick}
              className="block text-[13px] text-cb-t2 hover:text-cb-t1 transition-colors py-1 text-left"
            >
              {link.label}
            </button>
          )}
        </li>
      ))}
    </ul>
  </div>
);

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

export const LandingFooter: React.FC<Props> = ({ onEnterApp }) => {
  const productLinks: FooterLinkItem[] = [
    { label: 'Auctions', onClick: onEnterApp },
    { label: 'How It Works', onClick: () => scrollTo('how-it-works') },
    { label: 'Security', onClick: () => scrollTo('security') },
    { label: 'Use Cases', onClick: () => scrollTo('use-cases') },
  ];

  const developerLinks: FooterLinkItem[] = [
    { label: 'Documentation', href: 'https://docs.midnight.network' },
    { label: 'Protocol', href: 'https://midnight.network' },
    { label: 'GitHub', href: 'https://github.com/Soumi14mili/CloakBid' },
    { label: 'Smart Contracts', href: 'https://github.com/Soumi14mili/CloakBid' },
  ];

  const networkLinks: FooterLinkItem[] = [
    { label: 'Midnight Network', href: 'https://midnight.network' },
    { label: 'Preview Explorer', href: 'https://midnight.network' },
    { label: 'Wallet Setup', href: 'https://midnight.network' },
    { label: 'tDUST Faucet', href: 'https://midnight.network' },
  ];

  return (
    <footer
      style={{ backgroundColor: '#0D0F13', borderTop: '1px solid rgba(255,255,255,0.05)' }}
      className="py-16 px-5 sm:px-8"
    >
      <div className="max-w-content mx-auto">
        {/* Cloak Vault Visual Banner in Footer */}
        <div className="mb-14 overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-[#12151B] to-[#08090C] p-2 sm:p-3 shadow-2xl relative group">
          <div className="relative overflow-hidden rounded-xl">
            <img
              src={cloakVaultBanner}
              alt="CloakBid Zero-Knowledge Execution Vault"
              className="w-full h-auto object-cover rounded-xl transition-transform duration-700 group-hover:scale-[1.01]"
              loading="lazy"
            />
            {/* Subtle overlay gradient */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#08090C]/60 via-transparent to-transparent" />

            {/* Overlay badge info */}
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#08090C]/85 backdrop-blur-md border border-white/10 text-cb-t2 font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-cb-accent" />
                THE CLOAK VAULT — ZERO-KNOWLEDGE EXECUTION ENVIRONMENT
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#08090C]/85 backdrop-blur-md border border-white/10 text-cb-success font-mono text-[11px]">
                <span className="w-1.5 h-1.5 rounded-full bg-cb-success" />
                ON-CHAIN VERIFIED
              </span>
            </div>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">

          {/* Brand column — spans 2 cols on lg */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            {/* Wordmark */}
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-cb-accent" />
              <span className="text-[16px] font-semibold text-cb-t1 tracking-tight">
                CloakBid
              </span>
            </div>

            {/* Description */}
            <p className="text-cb-t2 text-[13px] mt-3 leading-relaxed max-w-xs">
              Privacy-preserving sealed-bid auctions. Build auctions where
              confidentiality and verifiability coexist.
            </p>

            {/* Social links */}
            <div className="mt-5 flex gap-3">
              <a
                href="https://github.com/Soumi14mili/CloakBid"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost btn-sm flex items-center gap-1.5"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a
                href="https://x.com/xCloakBid"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost btn-sm flex items-center gap-1.5"
              >
                <ExternalLink className="w-4 h-4" />
                X / Twitter
              </a>
            </div>

            {/* Network badge */}
            <div className="mt-4 inline-flex items-center gap-1.5 text-[11px] text-cb-t3">
              <span className="w-1.5 h-1.5 rounded-full bg-cb-success" />
              Midnight Preview
            </div>
          </div>

          {/* Product column */}
          <FooterColumn heading="Product" links={productLinks} />

          {/* Developers column */}
          <FooterColumn heading="Developers" links={developerLinks} />

          {/* Network column */}
          <FooterColumn heading="Network" links={networkLinks} />
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
        >
          <p className="text-[12px] text-cb-t3">
            © 2026 CloakBid Protocol. Built for Midnight Crescent Challenge — Level 4.
          </p>
          <p className="mono text-[11px] text-cb-t3">
            Contract: 51d23a07...8b15 · Midnight Preview
          </p>
        </div>
      </div>
    </footer>
  );
};
