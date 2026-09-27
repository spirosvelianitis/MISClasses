import React from 'react';
import { UserBooking, ClassItem } from '../types';
import { X, Calendar, User, Trash2, BookmarkCheck, ArrowRight } from 'lucide-react';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: UserBooking[];
  classes: ClassItem[];
  onCancelBooking: (bookingId: string, classId: string) => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  classes,
  onCancelBooking,
}) => {
  if (!isOpen) return null;

  const classMap = new Map(classes.map(c => [c.id, c]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#043323] text-white rounded-2xl max-w-lg w-full shadow-2xl border border-csus-gold/30 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-csus-gold/20 flex items-center justify-between bg-[#022419]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-csus-green text-csus-gold border border-csus-gold/40 shadow-xs">
              <BookmarkCheck className="w-5 h-5 text-csus-gold" />
            </div>
            <div>
              <h3 className="text-base font-bold text-csus-gold">
                My Reserved Classes
              </h3>
              <p className="text-xs text-emerald-100/60">
                End User Bookings & Attendance
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
        <div className="p-5 overflow-y-auto space-y-3 text-xs">
          {bookings.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <Calendar className="w-10 h-10 text-emerald-100/30 mx-auto" />
              <p className="font-bold text-white">
                No classes booked yet
              </p>
              <p className="text-emerald-100/60 max-w-xs mx-auto">
                Explore the class schedule and reserve your spot before seats run out!
              </p>
            </div>
          ) : (
            bookings.map(booking => {
              const classItem = classMap.get(booking.classId);
              return (
                <div
                  key={booking.id}
                  className="p-3.5 rounded-xl border border-csus-gold/25 bg-[#022419] flex items-center justify-between gap-3 shadow-sm"
                >
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#063e2c] text-csus-gold border border-csus-gold/40">
                      {classItem?.code || 'CLASS'}
                    </span>
                    <h4 className="font-bold text-white text-sm">
                      {booking.className}
                    </h4>
                    <p className="text-[11px] text-emerald-100/70">
                      {classItem?.schedule || 'Weekly'} • {classItem?.location || 'Campus'}
                    </p>
                    <p className="text-[10px] text-emerald-100/50">
                      Booked for {booking.studentName} ({booking.studentEmail}) on {booking.bookedAt}
                    </p>
                  </div>

                  <button
                    onClick={() => onCancelBooking(booking.id, booking.classId)}
                    className="p-2 rounded-lg text-red-400 hover:bg-red-950/50 transition-colors flex-shrink-0"
                    title="Cancel seat reservation"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-csus-gold/20 bg-[#022419] flex items-center justify-between">
          <span className="text-[11px] text-emerald-100/60">
            {bookings.length} {bookings.length === 1 ? 'class' : 'classes'} enrolled
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#063e2c] hover:bg-[#084f38] rounded-xl text-xs font-semibold text-csus-gold border border-csus-gold/30 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
