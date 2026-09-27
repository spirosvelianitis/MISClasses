import React from 'react';
import { ClassItem } from '../types';
import { Flame, Users, CheckCircle, AlertTriangle, GraduationCap } from 'lucide-react';

interface StatsOverviewProps {
  classes: ClassItem[];
  thresholdPercent: number;
  selectedFilter: string;
  onSelectFilter: (filter: string) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  classes,
  thresholdPercent,
  selectedFilter,
  onSelectFilter,
}) => {
  const totalClasses = classes.length;
  const totalCapacity = classes.reduce((sum, c) => sum + c.capacity, 0);
  const totalAvailable = classes.reduce((sum, c) => sum + c.availableSeats, 0);
  const totalEnrolled = Math.max(0, totalCapacity - totalAvailable);
  const fillRate = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;

  const lowAvailabilityClasses = classes.filter(
    c => (c.availableSeats / Math.max(1, c.capacity)) * 100 < thresholdPercent && c.availableSeats > 0
  );
  const soldOutClasses = classes.filter(c => c.availableSeats === 0);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
      {/* Total Classes */}
      <button
        onClick={() => onSelectFilter('all')}
        className={`p-4 rounded-2xl border text-left transition-all shadow-md ${
          selectedFilter === 'all'
            ? 'border-csus-gold bg-[#084934] ring-2 ring-csus-gold/50 shadow-csus-gold/10'
            : 'border-csus-gold/25 bg-[#053827] hover:border-csus-gold/50 hover:bg-[#07422f]'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="font-bold text-csus-gold">Total Classes</span>
          <GraduationCap className="w-4 h-4 text-csus-gold" />
        </div>
        <p className="text-2xl font-black text-white">
          {totalClasses}
        </p>
        <p className="text-[11px] text-emerald-100/70 mt-1">
          {totalCapacity} total seat capacity
        </p>
      </button>

      {/* Available Seats */}
      <button
        onClick={() => onSelectFilter('available')}
        className={`p-4 rounded-2xl border text-left transition-all shadow-md ${
          selectedFilter === 'available'
            ? 'border-csus-gold bg-[#084934] ring-2 ring-csus-gold/50 shadow-csus-gold/10'
            : 'border-csus-gold/25 bg-[#053827] hover:border-csus-gold/50 hover:bg-[#07422f]'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="font-bold text-csus-gold">Available Seats</span>
          <CheckCircle className="w-4 h-4 text-csus-gold" />
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-black text-white">
            {totalAvailable}
          </p>
          <span className="text-xs font-medium text-emerald-100/60">/ {totalCapacity}</span>
        </div>
        <p className="text-[11px] text-emerald-100/70 mt-1">
          {fillRate}% overall campus fill rate
        </p>
      </button>

      {/* Low Availability (<25%) Alert Card */}
      <button
        onClick={() => onSelectFilter('low')}
        className={`p-4 rounded-2xl border text-left transition-all shadow-md relative overflow-hidden ${
          selectedFilter === 'low'
            ? 'border-orange-500 bg-[#2b1705] ring-2 ring-orange-500/50 shadow-orange-500/20'
            : 'border-orange-500/50 bg-[#1c1106] hover:border-orange-400 hover:bg-[#251506]'
        }`}
      >
        <div className="flex items-center justify-between text-orange-400 text-xs font-bold mb-2">
          <span className="flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 fill-current" />
            &lt; 25% Seat Alert
          </span>
          <span className="text-[10px] bg-orange-500/30 text-orange-300 border border-orange-500/50 px-1.5 py-0.5 rounded-full font-extrabold uppercase">
            Orange Gauge
          </span>
        </div>
        <p className="text-2xl font-black text-orange-400">
          {lowAvailabilityClasses.length}
        </p>
        <p className="text-[11px] text-orange-300/80 font-medium mt-1">
          Classes nearing full capacity
        </p>
      </button>

      {/* Sold Out / Full */}
      <button
        onClick={() => onSelectFilter('full')}
        className={`p-4 rounded-2xl border text-left transition-all shadow-md ${
          selectedFilter === 'full'
            ? 'border-red-500 bg-[#2b0c0c] ring-2 ring-red-500/40 shadow-red-500/20'
            : 'border-red-900/60 bg-[#1f0909] hover:border-red-600 hover:bg-[#260c0c]'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-red-400 font-bold">Full / Sold Out</span>
          <AlertTriangle className="w-4 h-4 text-red-400" />
        </div>
        <p className="text-2xl font-black text-red-400">
          {soldOutClasses.length}
        </p>
        <p className="text-[11px] text-red-300/70 mt-1">
          {soldOutClasses.length > 0 ? 'Waitlist open' : 'All classes have seats'}
        </p>
      </button>
    </div>
  );
};
