import React from 'react';
import { AlertTriangle, Clock, Eye } from 'lucide-react';

interface ProblemCard {
  icon: React.ReactNode;
  title: string;
  body: string;
  footnote: string;
}

const problems: ProblemCard[] = [
  {
    icon: <AlertTriangle size={20} className="text-cb-warning" />,
    title: 'Front-Running',
    body: 'Visible transactions allow sophisticated participants to observe and react to bidding activity before it settles.',
    footnote: 'Structural market disadvantage',
  },
  {
    icon: <Clock size={20} className="text-cb-warning" />,
    title: 'Bid Sniping',
    body: 'Public bid information lets late participants react to competitors, shifting outcomes based on timing rather than genuine valuation.',
    footnote: 'Last-second behavioral pressure',
  },
  {
    icon: <Eye size={20} className="text-cb-warning" />,
    title: 'Competitive Intelligence',
    body: 'Exposed bid values can reveal sensitive pricing and valuation information, permanently disadvantaging future negotiations.',
    footnote: 'Permanent information leakage',
  },
];

export const ProblemSection: React.FC = () => {
  return (
    <section id="problem" className="bg-cb-base py-24">
      <div className="max-w-content mx-auto px-6">
        {/* Label */}
        <p className="eyebrow mb-4">THE PROBLEM</p>

        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl font-bold text-cb-t1 tracking-tight max-w-xl">
          When bids are visible, information becomes a liability.
        </h2>

        {/* Supporting text */}
        <p className="text-cb-t2 text-lg mt-4 max-w-xl leading-relaxed">
          Traditional auctions expose bid values to participants, validators, and observers — creating
          structural disadvantages for honest bidders.
        </p>

        {/* Problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
          {problems.map((problem) => (
            <div key={problem.title} className="card p-6 flex flex-col">
              {/* Icon */}
              <div>{problem.icon}</div>

              {/* Title */}
              <h3 className="font-semibold text-cb-t1 mt-4 mb-2">{problem.title}</h3>

              {/* Body */}
              <p className="text-cb-t2 text-sm leading-relaxed flex-1">{problem.body}</p>

              {/* Footnote */}
              <p className="text-[13px] text-cb-t3 mt-5 pl-3 border-l border-cb-accent">
                {problem.footnote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
