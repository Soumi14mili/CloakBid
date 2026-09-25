import React, { useState, useEffect } from 'react';
import { Gavel, Lock, ShieldCheck, LayoutGrid, Clock, Tag } from 'lucide-react';
import type { AuctionConfig } from '../../types';

interface Props {
  lots: AuctionConfig[];
  selectedLotId: string;
  onSelectLot: (id: string) => void;
  onViewDetail: (id: string) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type FilterTab = 'All' | 'Live' | 'Settled';

function formatCountdown(endTime: number): string {
  const diff = endTime - Date.now();
  if (diff <= 0) return 'Ended';
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

type Rarity = 'MYTHIC' | 'CLASSIFIED' | 'GENESIS';

interface RarityTheme {
  gradientFrom: string;
  gradientTo: string;
  iconColor: string;
}

const rarityTheme: Record<Rarity, RarityTheme> = {
  MYTHIC: {
    gradientFrom: 'rgba(99,91,255,0.15)',
    gradientTo: 'rgba(8,9,12,0.9)',
    iconColor: '#635BFF',
  },
  CLASSIFIED: {
    gradientFrom: 'rgba(46,204,138,0.1)',
    gradientTo: 'rgba(8,9,12,0.9)',
    iconColor: '#2ECC8A',
  },
  GENESIS: {
    gradientFrom: 'rgba(231,169,59,0.1)',
    gradientTo: 'rgba(8,9,12,0.9)',
    iconColor: '#E7A93B',
  },
};

function getRarityTheme(rarity: string): RarityTheme {
  return rarityTheme[rarity as Rarity] ?? rarityTheme.MYTHIC;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface CountdownCellProps {
  endTime: number;
}

const CountdownCell: React.FC<CountdownCellProps> = ({ endTime }) => {
  const [label, setLabel] = useState(() => formatCountdown(endTime));

  useEffect(() => {
    const id = setInterval(() => setLabel(formatCountdown(endTime)), 1000);
    return () => clearInterval(id);
  }, [endTime]);

  return <span>{label}</span>;
};

interface AuctionCardProps {
  lot: AuctionConfig;
  isSelected: boolean;
  onSelect: () => void;
  onViewDetail: () => void;
}

const AuctionCard: React.FC<AuctionCardProps> = ({
  lot,
  isSelected,
  onSelect,
  onViewDetail,
}) => {
  const theme = getRarityTheme(lot.rarity);

  return (
    <div
      onClick={onSelect}
      className={[
        'card hover-lift cursor-pointer rounded-xl overflow-hidden',
        isSelected ? 'border border-cb-accent/30' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Image / banner area */}
      <div
        className="h-36 flex items-center justify-center"
        style={{
          background: `linear-gradient(160deg, ${theme.gradientFrom}, ${theme.gradientTo})`,
        }}
      >
        <Gavel
          className="w-10 h-10"
          style={{ color: theme.iconColor }}
          strokeWidth={1.5}
        />
      </div>

      {/* Card body */}
      <div className="p-5">
        {/* Status + rarity row */}
        <div className="flex items-center justify-between">
          <span className="badge-live">LIVE</span>
          <span className="text-[11px] font-mono text-cb-t3 tracking-wider uppercase">
            {lot.rarity}
          </span>
        </div>

        {/* Title */}
        <p className="font-semibold text-cb-t1 text-[16px] mt-3 leading-snug line-clamp-2">
          {lot.title}
        </p>

        {/* Category */}
        <div className="flex items-center gap-1 mt-1">
          <Tag className="w-3 h-3 text-cb-t3" strokeWidth={1.5} />
          <span className="text-[12px] text-cb-t3">{lot.category}</span>
        </div>

        {/* Divider */}
        <div className="divider mt-4 mb-4" />

        {/* Reserve + countdown row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <span className="text-[11px] text-cb-t3 uppercase tracking-wider">
              Reserve
            </span>
            <span className="masked font-mono text-[12px] text-cb-t3 tracking-widest">
              ████████ tDUST
            </span>
          </div>
          <div className="flex items-center gap-1 text-cb-t2">
            <Clock className="w-3.5 h-3.5 text-cb-t3" strokeWidth={1.5} />
            <span className="text-[12px]">
              <CountdownCell endTime={lot.endTime} />
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          className="btn-secondary w-full mt-4 text-[13px]"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetail();
          }}
        >
          Place Sealed Bid
        </button>

        {/* Privacy note */}
        <div className="flex items-center justify-center gap-1 mt-2">
          <Lock className="w-3 h-3 text-cb-t3" strokeWidth={1.5} />
          <span className="text-[11px] text-cb-t3">Bid value remains private</span>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export const AuctionListView: React.FC<Props> = ({
  lots,
  selectedLotId,
  onSelectLot,
  onViewDetail,
}) => {
  const [activeTab, setActiveTab] = useState<FilterTab>('All');

  const tabs: FilterTab[] = ['All', 'Live', 'Settled'];

  const filteredLots = lots.filter((lot) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Live') return lot.endTime > Date.now();
    if (activeTab === 'Settled') return lot.endTime <= Date.now();
    return true;
  });

  return (
    <div className="py-8 px-5 sm:px-8 max-w-content mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-cb-t1 tracking-tight">
          Active Auctions
        </h2>
        <span className="badge-live">Live on Midnight Preview</span>
      </div>

      {/* KPI strip */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-1.5 text-[13px] text-cb-t2">
          <LayoutGrid className="w-3.5 h-3.5 text-cb-t3" strokeWidth={1.5} />
          <span>3 Auctions</span>
        </div>
        <div className="flex items-center gap-1.5 text-[13px] text-cb-t2">
          <Lock className="w-3.5 h-3.5 text-cb-t3" strokeWidth={1.5} />
          <span>Sealed Bids Active</span>
        </div>
        <div className="flex items-center gap-1.5 text-[13px] text-cb-t2">
          <ShieldCheck className="w-3.5 h-3.5 text-cb-t3" strokeWidth={1.5} />
          <span>ZK Proofs Required</span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="tab-bar mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={activeTab === tab ? 'tab-active' : 'tab'}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredLots.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLots.map((lot) => (
            <AuctionCard
              key={lot.id}
              lot={lot}
              isSelected={lot.id === selectedLotId}
              onSelect={() => onSelectLot(lot.id)}
              onViewDetail={() => onViewDetail(lot.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Gavel className="w-8 h-8 text-cb-t3" strokeWidth={1.5} />
          <p className="text-[14px] text-cb-t3">No auctions in this category.</p>
        </div>
      )}
    </div>
  );
};
