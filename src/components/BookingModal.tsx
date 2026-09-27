import React, { useState } from 'react';
import { ClassItem } from '../types';
import { AvailabilityGauge } from './AvailabilityGauge';
import { X, CheckCircle, MapPin, Calendar, User as UserIcon, BookOpen } from 'lucide-react';
import { User } from 'firebase/auth';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  classItem: ClassItem | null;
  googleUser: User | null;
  thresholdPercent: number;
  onConfirmBooking: (classItem: ClassItem, studentName: string, studentEmail: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  classItem,
  googleUser,
  thresholdPercent,
  onConfirmBooking,
}) => {
  if (!isOpen || !classItem) return null;

  const [name, setName] = useState(googleUser?.displayName || '');
  const [email, setEmail] = useState(googleUser?.email || '');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setIsSubmitted(true);
    setTimeout(() => {
      onConfirmBooking(classItem, name, email);
      setIsSubmitted(false);
      onClose();
    }, 400);
  };

  const isSoldOut = classItem.availableSeats <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#043323] text-white rounded-2xl max-w-md w-full shadow-2xl border border-csus-gold/35 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-csus-gold/25 flex items-center justify-between bg-[#022419]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-csus-green text-csus-gold border border-csus-gold/40 shadow-xs">
              <BookOpen className="w-5 h-5 text-csus-gold" />
            </div>
            <div>
              <h3 className="text-base font-bold text-csus-gold">
                Reserve Your Seat
              </h3>
              <p className="text-xs text-emerald-100/60">
                End User Class Enrollment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Class Summary with Gauge */}
          <div className="p-4 rounded-xl bg-[#022419] border border-csus-gold/25 flex items-center justify-between">
            <div className="space-y-1 pr-2">
              <span className="px-2 py-0.5 rounded-full font-semibold text-[10px] bg-[#064e35] text-emerald-200 border border-emerald-600/40">
                {classItem.code} • {classItem.category}
              </span>
              <h4 className="text-sm font-bold text-white leading-snug">
                {classItem.name}
              </h4>
              <div className="text-[11px] text-emerald-100/70 space-y-0.5">
                <p className="flex items-center gap-1">
                  <UserIcon className="w-3 h-3 text-csus-gold" /> {classItem.instructor}
                </p>
                <p className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-csus-gold" /> {classItem.schedule}
                </p>
                <p className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-csus-gold" /> {classItem.location}
                </p>
              </div>
            </div>

            <AvailabilityGauge
              available={classItem.availableSeats}
              capacity={classItem.capacity}
              thresholdPercent={thresholdPercent}
              size="md"
              showDetails={true}
            />
          </div>

          {isSoldOut ? (
            <div className="p-4 rounded-xl bg-[#2b0c0c] border border-red-500/50 text-center space-y-1">
              <p className="font-bold text-red-300">
                Class is currently full
              </p>
              <p className="text-[11px] text-red-400">
                All {classItem.capacity} seats are booked. Check back every 30 seconds for cancellations!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-emerald-100/90 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#022419] text-white placeholder-emerald-100/40 text-xs outline-hidden focus:ring-2 focus:ring-csus-gold"
                />
              </div>

              <div>
                <label className="block font-semibold text-emerald-100/90 mb-1">
                  Your Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. alex@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#022419] text-white placeholder-emerald-100/40 text-xs outline-hidden focus:ring-2 focus:ring-csus-gold"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitted}
                  className="w-full py-2.5 px-4 bg-csus-green hover:bg-csus-green-hover text-csus-gold border border-csus-gold/50 font-bold rounded-xl text-xs shadow-md shadow-csus-green/20 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4 text-csus-gold" />
                  {isSubmitted ? 'Reserving...' : `Confirm Reservation (1 Seat of ${classItem.availableSeats} left)`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
