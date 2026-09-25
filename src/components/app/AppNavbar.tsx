import React, { useState, useRef, useEffect } from 'react';
import {
  Shield,
  LayoutGrid,
  Bookmark,
  Plus,
  BarChart2,
  ChevronDown,
  LogOut,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

type Tab = 'auctions' | 'my-bids' | 'create' | 'analytics';

interface WalletState {
  connected: boolean;
  address: string;
  balance: string;
  network: string;
}

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  wallet: WalletState;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  onBackToLanding: () => void;
}

// ─── Tab Config ──────────────────────────────────────────────────────────────

interface TabConfig {
  id: Tab;
  label: string;
  Icon: React.ComponentType<{ size?: number | string; className?: string }>;
}

const TABS: TabConfig[] = [
  { id: 'auctions',   label: 'Auctions',  Icon: LayoutGrid },
  { id: 'my-bids',    label: 'My Bids',   Icon: Bookmark   },
  { id: 'create',     label: 'Create',    Icon: Plus       },
  { id: 'analytics',  label: 'Analytics', Icon: BarChart2  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

/** Logo + "Preview" badge on the left side */
const Logo: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 group focus:outline-none"
    aria-label="Go to landing page"
  >
    <div className="flex items-center gap-2">
      <Shield size={16} className="text-cb-accent shrink-0" />
      <span className="text-[15px] font-semibold text-cb-t1 leading-none">
        CloakBid
      </span>
    </div>

    {/* Vertical separator */}
    <span className="h-3.5 w-px bg-cb-t3 opacity-40 shrink-0" aria-hidden="true" />

    {/* Preview badge */}
    <span className="text-[11px] font-mono text-cb-t3 bg-cb-elevated rounded px-2 py-0.5 leading-none select-none">
      Preview
    </span>
  </button>
);

/** Desktop centre tab bar */
const DesktopTabs: React.FC<{ activeTab: Tab; onTabChange: (t: Tab) => void }> = ({
  activeTab,
  onTabChange,
}) => (
  <nav className="hidden md:flex items-center gap-0.5" aria-label="Primary navigation">
    {TABS.map(({ id, label, Icon }) => {
      const isActive = activeTab === id;
      return (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={[
            'flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-md transition-colors duration-150',
            isActive
              ? 'text-cb-t1 bg-cb-elevated'
              : 'text-cb-t3 hover:text-cb-t2 hover:bg-white/[0.03]',
          ].join(' ')}
          aria-current={isActive ? 'page' : undefined}
        >
          <Icon size={14} className="shrink-0" />
          {label}
        </button>
      );
    })}
  </nav>
);

/** Truncate a Cardano-style address to `mn_addr_...XXXXXXXX` */
function truncateAddress(address: string): string {
  if (!address || address.length <= 8) return address;
  return `mn_addr_...${address.slice(-8)}`;
}

/** Connected wallet chip with dropdown */
const WalletChip: React.FC<{
  wallet: WalletState;
  onDisconnect: () => void;
}> = ({ wallet, onDisconnect }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;

    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={[
          'flex items-center gap-2 bg-cb-elevated border rounded-lg px-3 py-1.5 transition-colors duration-150 focus:outline-none',
          open
            ? 'border-white/[0.12]'
            : 'border-white/[0.05] hover:border-white/[0.09]',
        ].join(' ')}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Wallet options"
      >
        {/* Status dot */}
        <span className="w-1.5 h-1.5 rounded-full bg-cb-success shrink-0" aria-hidden="true" />

        {/* Address */}
        <span className="font-mono text-[11px] text-cb-t2 leading-none">
          {truncateAddress(wallet.address)}
        </span>

        {/* Balance */}
        <span className="text-[11px] text-cb-t1 font-medium leading-none">
          {wallet.balance}
        </span>

        <ChevronDown
          size={12}
          className={[
            'text-cb-t3 shrink-0 transition-transform duration-150',
            open ? 'rotate-180' : 'rotate-0',
          ].join(' ')}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-1.5 w-44 bg-cb-elevated border border-white/[0.07] rounded-lg shadow-lg overflow-hidden z-50"
          role="menu"
        >
          {/* Network indicator */}
          <div className="px-3 py-2 border-b border-white/[0.05]">
            <p className="text-[10px] text-cb-t3 uppercase tracking-widest font-medium">
              Network
            </p>
            <p className="text-[12px] text-cb-t2 font-mono mt-0.5">{wallet.network}</p>
          </div>

          {/* Disconnect */}
          <button
            onClick={() => {
              setOpen(false);
              onDisconnect();
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-[13px] text-cb-t2 hover:text-cb-error hover:bg-white/[0.03] transition-colors duration-100 focus:outline-none"
            role="menuitem"
          >
            <LogOut size={13} className="shrink-0" aria-hidden="true" />
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
};

/** Disconnected — simple connect button */
const ConnectButton: React.FC<{ onConnect: () => Promise<void> }> = ({ onConnect }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onConnect();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="btn-primary btn-sm disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? 'Connecting…' : 'Connect Wallet'}
    </button>
  );
};

/** Mobile bottom tab bar (fixed) */
const MobileTabBar: React.FC<{ activeTab: Tab; onTabChange: (t: Tab) => void }> = ({
  activeTab,
  onTabChange,
}) => (
  <nav
    className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around py-2 bg-cb-sub border-t border-white/[0.05]"
    aria-label="Mobile navigation"
  >
    {TABS.map(({ id, label, Icon }) => {
      const isActive = activeTab === id;
      return (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={[
            'flex flex-col items-center gap-1 px-3 py-1 rounded-md transition-colors duration-150 focus:outline-none min-w-0',
            isActive ? 'text-cb-accent' : 'text-cb-t3',
          ].join(' ')}
          aria-current={isActive ? 'page' : undefined}
        >
          <Icon size={18} className="shrink-0" aria-hidden="true" />
          <span className="text-[10px] font-medium leading-none truncate">{label}</span>
        </button>
      );
    })}
  </nav>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const AppNavbar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  wallet,
  onConnect,
  onDisconnect,
  onBackToLanding,
}) => {
  return (
    <>
      {/* ── Sticky top bar ── */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{
          background: 'rgba(8,9,12,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-4">
          {/* Left: Logo */}
          <Logo onClick={onBackToLanding} />

          {/* Centre: Tab navigation (desktop only) */}
          <DesktopTabs activeTab={activeTab} onTabChange={onTabChange} />

          {/* Right: Wallet */}
          <div className="shrink-0">
            {wallet.connected ? (
              <WalletChip wallet={wallet} onDisconnect={onDisconnect} />
            ) : (
              <ConnectButton onConnect={onConnect} />
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile bottom tab bar ── */}
      <MobileTabBar activeTab={activeTab} onTabChange={onTabChange} />
    </>
  );
};
