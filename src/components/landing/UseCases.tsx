import React from 'react';
import { Building2, Briefcase, Layers, TrendingUp, Award } from 'lucide-react';

interface UseCase {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  category: string;
  title: string;
  body: string;
  tag: string;
}

const USE_CASES: UseCase[] = [
  {
    icon: Building2,
    category: 'REAL ESTATE',
    title: 'Real Estate Acquisitions',
    body: 'Private property bidding for residential and commercial acquisitions, where disclosed valuations can affect negotiating positions and future transactions.',
    tag: 'High-value transactions',
  },
  {
    icon: Briefcase,
    category: 'PROCUREMENT',
    title: 'Enterprise Procurement',
    body: 'Confidential supplier and vendor bidding for corporate procurement processes, protecting pricing intelligence and sourcing strategies.',
    tag: 'Institutional use',
  },
  {
    icon: Layers,
    category: 'DIGITAL ASSETS',
    title: 'Digital Asset Auctions',
    body: 'Private competitive auctions for digital assets, IP, and on-chain items where valuation transparency could undermine the bidding process.',
    tag: 'Web3 native',
  },
  {
    icon: TrendingUp,
    category: 'CORPORATE M&A',
    title: 'Corporate Asset Sales',
    body: 'Sensitive asset disposition and M&A-related processes where disclosed bid ranges could influence counterparty strategy.',
    tag: 'Confidential finance',
  },
  {
    icon: Award,
    category: 'COLLECTIBLES',
    title: 'High-Value Collectibles',
    body: 'Competitive auctions for rare items where buyer valuation intelligence would create material disadvantage in future transactions.',
    tag: 'Premium markets',
  },
];

export const UseCases: React.FC = () => {
  return (
    <section className="py-24" style={{ backgroundColor: '#08090C' }}>
      <div className="max-w-content mx-auto px-6">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="eyebrow">USE CASES</p>
          <h2 className="text-4xl font-bold tracking-tight text-cb-t1 mt-3">
            Built for high-stakes decisions that demand privacy.
          </h2>
          <p className="text-cb-t2 mt-4 max-w-xl leading-relaxed">
            Any auction where bid values represent sensitive business or personal information can
            benefit from CloakBid's sealed-bid architecture.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-14">
          {USE_CASES.map((useCase, index) => {
            const Icon = useCase.icon;
            // Last card spans 2 cols on lg when total is 5 (makes it fill the last row)
            const isLastCard = index === USE_CASES.length - 1;

            return (
              <div
                key={useCase.category}
                className={`card p-6 flex flex-col${isLastCard ? ' lg:col-span-1' : ''}`}
              >
                {/* Icon */}
                <div className="bg-cb-elevated rounded-lg p-2 w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <Icon className="text-cb-t2 w-5 h-5" />
                </div>

                {/* Content */}
                <p className="label mt-4 text-[11px]">{useCase.category}</p>
                <h3 className="font-semibold text-cb-t1 mt-1 text-[15px]">{useCase.title}</h3>
                <p className="text-cb-t2 text-[13px] leading-relaxed mt-2 flex-1">
                  {useCase.body}
                </p>

                {/* Tag */}
                <span className="badge-accent mt-4 text-[11px] self-start inline-block">
                  {useCase.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
