import React from 'react';
import { ClassItem, AccountRole } from '../types';
import { AvailabilityGauge } from './AvailabilityGauge';
import { Plus, Minus, Edit3, Trash2, ArrowUpDown } from 'lucide-react';

interface ClassTableProps {
  classes: ClassItem[];
  role: AccountRole;
  thresholdPercent: number;
  userBookedClassIds: Set<string>;
  onEdit: (item: ClassItem) => void;
  onDelete: (item: ClassItem) => void;
  onQuickAdjustSeats: (item: ClassItem, delta: number) => void;
  onOpenBooking: (item: ClassItem) => void;
}

export const ClassTable: React.FC<ClassTableProps> = ({
  classes,
  role,
  thresholdPercent,
  userBookedClassIds,
  onEdit,
  onDelete,
  onQuickAdjustSeats,
  onOpenBooking,
}) => {
  return (
    <div className="overflow-x-auto rounded-2xl border border-csus-gold/25 bg-[#053827] shadow-xl">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-csus-gold/25 bg-[#03291d] text-csus-gold font-bold uppercase tracking-wider text-[11px]">
            <th className="py-3.5 px-4">Class & Code</th>
            <th className="py-3.5 px-4">Instructor</th>
            <th className="py-3.5 px-4">Schedule & Venue</th>
            <th className="py-3.5 px-4 text-center">Availability Gauge (&lt;25% Orange)</th>
            <th className="py-3.5 px-4 text-center">Seats (Avail/Cap)</th>
            <th className="py-3.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-csus-gold/15">
          {classes.map(item => {
            const percentRemaining = (item.availableSeats / Math.max(1, item.capacity)) * 100;
            const isLow = percentRemaining < thresholdPercent;
            const isSoldOut = item.availableSeats <= 0;
            const isBooked = userBookedClassIds.has(item.id);

            return (
              <tr
                key={item.id}
                className={`transition-colors hover:bg-[#074631] ${
                  isLow ? 'bg-[#2b1705]/40' : ''
                }`}
              >
                {/* Class & Code */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#022419] text-csus-gold border border-csus-gold/30">
                      {item.code}
                    </span>
                    <span className="font-bold text-white line-clamp-1">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-emerald-200 font-semibold">
                      {item.category}
                    </span>
                    {isBooked && (
                      <span className="text-[10px] bg-csus-gold/20 text-csus-gold border border-csus-gold/60 px-1.5 rounded-sm font-bold">
                        Enrolled
                      </span>
                    )}
                  </div>
                </td>

                {/* Instructor */}
                <td className="py-3 px-4 text-emerald-100/80">
                  <p className="font-medium text-white">{item.instructor}</p>
                </td>

                {/* Schedule & Venue */}
                <td className="py-3 px-4 text-emerald-100/70">
                  <p className="font-medium text-white">{item.schedule}</p>
                  <p className="text-[11px] text-emerald-100/50">{item.location}</p>
                </td>

                {/* Gauge: shows orange when < 25% */}
                <td className="py-3 px-4 text-center">
                  <div className="flex justify-center">
                    <AvailabilityGauge
                      available={item.availableSeats}
                      capacity={item.capacity}
                      thresholdPercent={thresholdPercent}
                      size="sm"
                      showDetails={true}
                    />
                  </div>
                </td>

                {/* Numeric seats */}
                <td className="py-3 px-4 text-center font-mono">
                  <div className="inline-flex flex-col items-center">
                    <span
                      className={`font-bold text-sm ${
                        isLow ? 'text-orange-400 font-black' : 'text-white'
                      }`}
                    >
                      {item.availableSeats}{' '}
                      <span className="text-emerald-100/60 font-normal text-xs">/ {item.capacity}</span>
                    </span>
                    <span className="text-[10px] text-emerald-100/50">
                      {Math.round(percentRemaining)}% left
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right">
                  {role === 'admin' ? (
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Seat adjusters */}
                      <button
                        onClick={() => onQuickAdjustSeats(item, -1)}
                        disabled={item.availableSeats <= 0}
                        className="w-6 h-6 rounded bg-[#063e2c] border border-csus-gold/30 flex items-center justify-center hover:bg-[#084f38] disabled:opacity-40"
                        title="Minus 1 seat"
                      >
                        <Minus className="w-3 h-3 text-csus-gold" />
                      </button>
                      <button
                        onClick={() => onQuickAdjustSeats(item, 1)}
                        disabled={item.availableSeats >= item.capacity}
                        className="w-6 h-6 rounded bg-[#063e2c] border border-csus-gold/30 flex items-center justify-center hover:bg-[#084f38] disabled:opacity-40"
                        title="Add 1 seat"
                      >
                        <Plus className="w-3 h-3 text-csus-gold" />
                      </button>

                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 hover:bg-[#063e2c] text-csus-gold rounded-md"
                        title="Edit Class"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-csus-gold" />
                      </button>
                      <button
                        onClick={() => onDelete(item)}
                        className="p-1.5 hover:bg-red-950/40 text-emerald-100/40 hover:text-red-400 rounded-md"
                        title="Delete Class"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => onOpenBooking(item)}
                      disabled={isSoldOut}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors ${
                        isSoldOut
                          ? 'bg-[#022419] text-emerald-100/40 cursor-not-allowed border border-csus-gold/20'
                          : isLow
                          ? 'bg-orange-500 hover:bg-orange-600 text-white font-bold'
                          : 'bg-csus-green hover:bg-[#065439] text-csus-gold border border-csus-gold/50 font-bold'
                      }`}
                    >
                      {isSoldOut ? 'Sold Out' : isBooked ? 'Enrolled' : 'Book Seat'}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
