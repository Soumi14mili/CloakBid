import { useState } from 'react';
import { Shield, Menu, X } from 'lucide-react';

interface Props {
  onEnterApp: () => void;
  onConnectWallet: () => Promise<void>;
  walletConnected: boolean;
}

interface NavLink {
  label: string;
  sectionId: string;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Product',      sectionId: 'product'      },
  { label: 'How It Works', sectionId: 'how-it-works' },
  { label: 'Security',     sectionId: 'security'     },
  { label: 'Developers',   sectionId: 'developers'   },
];

function scrollTo(sectionId: string): void {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

export const LandingNavbar: React.FC<Props> = ({
  onEnterApp,
  onConnectWallet,
  walletConnected,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    scrollTo(sectionId);
    setMobileOpen(false);
  };

  const handleLogoClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'rgba(8,9,12,0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderColor: 'rgba(255,255,255,0.05)',
      }}
    >
      {/* ── Main bar ─────────────────────────────────────────────────────── */}
      <div
        className="mx-auto flex h-[60px] max-w-[1200px] items-center justify-between px-5 sm:px-8"
      >
        {/* LEFT — Wordmark */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-2 focus:outline-none"
          aria-label="Scroll to top"
        >
          <Shield size={16} color="#635BFF" strokeWidth={2.2} />
          <span className="text-[15px] font-semibold tracking-tight text-cb-t1">
            CloakBid
          </span>
        </button>

        {/* CENTER — Desktop nav links */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
          {NAV_LINKS.map(({ label, sectionId }) => (
            <button
              key={sectionId}
              onClick={() => handleNavClick(sectionId)}
              className="nav-link focus:outline-none"
            >
              {label}
            </button>
          ))}
        </nav>

        {/* RIGHT — Actions */}
        <div className="flex items-center gap-2">
          {/* Documentation — hidden on mobile */}
          <a
            href="#"
            className="nav-link hidden sm:inline-flex"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>

          {/* Connect Wallet / Connected indicator */}
          {walletConnected ? (
            <div className="hidden items-center gap-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-cb-success" />
              <span className="text-[13px] font-medium text-cb-t2">Connected</span>
            </div>
          ) : (
            <button
              onClick={onConnectWallet}
              className="btn-ghost btn-sm hidden sm:inline-flex"
            >
              Connect Wallet
            </button>
          )}

          {/* Explore Auctions CTA */}
          <button
            onClick={onEnterApp}
            className="btn-primary btn-sm"
          >
            Explore Auctions
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="btn-ghost btn-sm ml-1 p-2 md:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ──────────────────────────────────────────────── */}
      {mobileOpen && (
        <div
          className="border-t md:hidden"
          style={{ borderColor: 'rgba(255,255,255,0.05)' }}
        >
          <nav
            className="mx-auto flex max-w-[1200px] flex-col px-5 py-3"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map(({ label, sectionId }) => (
              <button
                key={sectionId}
                onClick={() => handleNavClick(sectionId)}
                className="nav-link w-full py-2 text-left focus:outline-none"
              >
                {label}
              </button>
            ))}

            {/* Documentation in mobile menu */}
            <a
              href="#"
              className="nav-link py-2"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
            >
              Documentation
            </a>

            {/* Wallet state in mobile menu */}
            <div className="mt-2 border-t pt-3" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              {walletConnected ? (
                <div className="flex items-center gap-1.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-cb-success" />
                  <span className="text-[13px] font-medium text-cb-t2">Wallet Connected</span>
                </div>
              ) : (
                <button
                  onClick={async () => {
                    await onConnectWallet();
                    setMobileOpen(false);
                  }}
                  className="btn-ghost btn-sm w-full justify-center"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
