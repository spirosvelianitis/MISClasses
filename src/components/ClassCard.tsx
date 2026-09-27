import React from 'react';
import { ClassItem, AccountRole } from '../types';
import { AvailabilityGauge } from './AvailabilityGauge';
import { MapPin, Clock, User, Plus, Minus, Edit3, Trash2, BookmarkCheck, Flame } from 'lucide-react';

interface ClassCardProps {
  classItem: ClassItem;
  role: AccountRole;
  thresholdPercent: number;
  isBookedByUser: boolean;
  onEdit: (item: ClassItem) => void;
  onDelete: (item: ClassItem) => void;
  onQuickAdjustSeats: (item: ClassItem, delta: number) => void;
  onOpenBooking: (item: ClassItem) => void;
}

export const ClassCard: React.FC<ClassCardProps> = ({
  classItem,
  role,
  thresholdPercent,
  isBookedByUser,
  onEdit,
  onDelete,
  onQuickAdjustSeats,
  onOpenBooking,
}) => {
  const percentRemaining = (classItem.availableSeats / Math.max(1, classItem.capacity)) * 100;
  const isLow = percentRemaining < thresholdPercent;
  const isSoldOut = classItem.availableSeats <= 0;

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-2xl ${
        isLow
          ? 'border-orange-500/80 bg-gradient-to-b from-[#2b1705] to-[#053827]'
          : 'border-csus-gold/25 bg-[#053827] hover:border-csus-gold/50'
      }`}
    >
      {/* Top Banner if Low Availability */}
      {isLow && !isSoldOut && (
        <div className="bg-orange-500 text-white text-[11px] font-bold px-3 py-1 flex items-center justify-between tracking-wide shadow-xs">
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
            <span>High Demand — Only {classItem.availableSeats} Seats Left!</span>
          </div>
          <span className="text-[10px] bg-orange-600 px-1.5 py-0.5 rounded-sm uppercase">
            &lt; 25% Left
          </span>
        </div>
      )}

      {isSoldOut && (
        <div className="bg-red-600 text-white text-[11px] font-bold px-3 py-1 flex items-center justify-between tracking-wide">
          <span>Class Full — Waitlist Only</span>
          <span className="text-[10px] bg-red-700 px-1.5 py-0.5 rounded-sm uppercase">0 Seats</span>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        {/* Category & Code Header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-tight bg-[#022419] text-csus-gold border border-csus-gold/30 font-mono">
              {classItem.code}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#064e35] text-emerald-200 border border-emerald-600/40">
              {classItem.category}
            </span>
          </div>

          {/* User Booking Badge */}
          {isBookedByUser && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-csus-gold/20 text-csus-gold border border-csus-gold/60">
              <BookmarkCheck className="w-3 h-3 text-csus-gold" /> Booked
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white leading-snug line-clamp-1 mb-2">
          {classItem.name}
        </h3>

        {/* Content & Gauge Layout */}
        <div className="flex items-center justify-between gap-4 my-2">
          {/* Metadata */}
          <div className="space-y-1.5 text-xs text-emerald-100/75 flex-1">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-csus-gold/80 flex-shrink-0" />
              <span className="truncate">{classItem.instructor}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-csus-gold/80 flex-shrink-0" />
              <span className="truncate">{classItem.schedule}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-csus-gold/80 flex-shrink-0" />
              <span className="truncate">{classItem.location}</span>
            </div>
          </div>

          {/* Central Availability Gauge: Turns ORANGE when < 25% */}
          <div className="flex-shrink-0">
            <AvailabilityGauge
              available={classItem.availableSeats}
              capacity={classItem.capacity}
              thresholdPercent={thresholdPercent}
              size="md"
              showDetails={true}
            />
          </div>
        </div>

        {/* Notes */}
        {classItem.notes && (
          <p className="mt-2 text-[11px] text-emerald-100/60 italic line-clamp-2 border-t border-csus-gold/15 pt-2">
            {classItem.notes}
          </p>
        )}
      </div>

      {/* Card Footer / Action Bar */}
      <div className="p-3 bg-[#03291d] border-t border-csus-gold/20 flex items-center justify-between gap-2">
        {role === 'admin' ? (
          /* Admin View Controls */
          <>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-semibold text-emerald-100/60 mr-1 uppercase">Seats:</span>
              <button
                onClick={() => onQuickAdjustSeats(classItem, -1)}
                disabled={classItem.availableSeats <= 0}
                className="w-7 h-7 rounded-lg bg-[#063e2c] border border-csus-gold/30 flex items-center justify-center text-csus-gold hover:bg-[#084f38] disabled:opacity-40 transition-colors shadow-xs"
                title="Decrease available seats (-1) in sheet"
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                onClick={() => onQuickAdjustSeats(classItem, 1)}
                disabled={classItem.availableSeats >= classItem.capacity}
                className="w-7 h-7 rounded-lg bg-[#063e2c] border border-csus-gold/30 flex items-center justify-center text-csus-gold hover:bg-[#084f38] disabled:opacity-40 transition-colors shadow-xs"
                title="Increase available seats (+1) in sheet"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onEdit(classItem)}
                className="px-2.5 py-1.5 bg-[#063e2c] hover:bg-[#084f38] border border-csus-gold/35 rounded-lg text-xs font-semibold text-csus-gold flex items-center gap-1 shadow-xs transition-colors"
                title="Edit class parameters in Google Sheet"
              >
                <Edit3 className="w-3.5 h-3.5 text-csus-gold" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => onDelete(classItem)}
                className="p-1.5 hover:bg-red-950/40 text-emerald-100/50 hover:text-red-400 rounded-lg transition-colors"
                title="Remove class"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        ) : (
          /* End User View Controls */
          <div className="w-full flex items-center justify-between">
            <div className="text-xs">
              {isSoldOut ? (
                <span className="text-red-400 font-semibold">Sold out</span>
              ) : isLow ? (
                <span className="text-orange-400 font-bold">Fast-filling!</span>
              ) : (
                <span className="text-csus-gold font-bold">Spots available</span>
              )}
            </div>

            <button
              onClick={() => onOpenBooking(classItem)}
              disabled={isSoldOut}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all ${
                isSoldOut
                  ? 'bg-[#022419] text-emerald-100/40 cursor-not-allowed border border-csus-gold/20'
                  : isLow
                  ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/25 ring-2 ring-orange-300 font-bold'
                  : 'bg-csus-green hover:bg-[#065439] text-csus-gold border border-csus-gold/50 shadow-md font-bold'
              }`}
            >
              {isBookedByUser ? 'Book Another Seat' : isSoldOut ? 'Full' : 'Reserve Seat'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
