import React, { useState } from 'react';
import { ClassItem } from '../types';
import { AvailabilityGauge } from './AvailabilityGauge';
import { X, Save } from 'lucide-react';

interface EditClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classItem: ClassItem | null;
  thresholdPercent: number;
  onSave: (updatedItem: ClassItem) => void;
}

export const EditClassModal: React.FC<EditClassModalProps> = ({
  isOpen,
  onClose,
  classItem,
  thresholdPercent,
  onSave,
}) => {
  if (!isOpen || !classItem) return null;

  const [name, setName] = useState(classItem.name);
  const [code, setCode] = useState(classItem.code);
  const [category, setCategory] = useState(classItem.category);
  const [instructor, setInstructor] = useState(classItem.instructor);
  const [schedule, setSchedule] = useState(classItem.schedule);
  const [location, setLocation] = useState(classItem.location);
  const [capacity, setCapacity] = useState(classItem.capacity);
  const [availableSeats, setAvailableSeats] = useState(classItem.availableSeats);
  const [notes, setNotes] = useState(classItem.notes || '');

  const handleCapacityChange = (newCap: number) => {
    const val = Math.max(1, newCap);
    setCapacity(val);
    if (availableSeats > val) {
      setAvailableSeats(val);
    }
  };

  const handleAvailableChange = (newAvail: number) => {
    const val = Math.max(0, Math.min(capacity, newAvail));
    setAvailableSeats(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...classItem,
      name,
      code,
      category,
      instructor,
      schedule,
      location,
      capacity,
      availableSeats,
      enrolled: Math.max(0, capacity - availableSeats),
      notes,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#043323] text-white rounded-2xl max-w-xl w-full shadow-2xl border border-csus-gold/30 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-csus-gold/20 flex items-center justify-between bg-[#022419]">
          <div>
            <h3 className="text-base font-bold text-csus-gold">
              Edit Class & Seats (Admin)
            </h3>
            <p className="text-xs text-emerald-100/60">
              Modifications will be synced back to the Google Sheet
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Live Gauge Preview Card */}
          <div className="p-4 rounded-xl bg-[#022419] border border-csus-gold/25 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">
                Live Availability Gauge Preview
              </p>
              <p className="text-[11px] text-emerald-100/70 mt-0.5">
                {availableSeats / capacity < 0.25 ? (
                  <span className="text-orange-400 font-bold">
                    ⚡ Under 25% threshold: Gauge displays in ORANGE
                  </span>
                ) : (
                  <span className="text-csus-gold font-bold">
                    ✓ Above 25% threshold: Gauge displays in Sac State Green
                  </span>
                )}
              </p>
            </div>
            <AvailabilityGauge
              available={availableSeats}
              capacity={capacity}
              thresholdPercent={thresholdPercent}
              size="md"
              showDetails={false}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-emerald-100/90 mb-1">
                Class Code
              </label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#022419] text-white outline-hidden focus:ring-2 focus:ring-csus-gold"
              />
            </div>
            <div>
              <label className="block font-semibold text-emerald-100/90 mb-1">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#022419] text-white outline-hidden focus:ring-2 focus:ring-csus-gold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-emerald-100/90 mb-1">
              Class Name
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#022419] text-white outline-hidden focus:ring-2 focus:ring-csus-gold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-emerald-100/90 mb-1">
                Instructor
              </label>
              <input
                type="text"
                value={instructor}
                onChange={e => setInstructor(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#022419] text-white outline-hidden focus:ring-2 focus:ring-csus-gold"
              />
            </div>
            <div>
              <label className="block font-semibold text-emerald-100/90 mb-1">
                Location / Studio
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#022419] text-white outline-hidden focus:ring-2 focus:ring-csus-gold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-emerald-100/90 mb-1">
              Schedule / Time Slot
            </label>
            <input
              type="text"
              value={schedule}
              onChange={e => setSchedule(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#022419] text-white outline-hidden focus:ring-2 focus:ring-csus-gold"
            />
          </div>

          {/* Seat Adjusters */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-[#022419] rounded-xl border border-csus-gold/25">
            <div>
              <label className="block font-bold text-white mb-1">
                Total Capacity
              </label>
              <input
                type="number"
                min={1}
                max={200}
                value={capacity}
                onChange={e => handleCapacityChange(Number(e.target.value))}
                required
                className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#032e20] text-white font-bold text-sm outline-hidden focus:ring-2 focus:ring-csus-gold"
              />
            </div>

            <div>
              <label className="block font-bold text-white mb-1">
                Available Seats
              </label>
              <input
                type="number"
                min={0}
                max={capacity}
                value={availableSeats}
                onChange={e => handleAvailableChange(Number(e.target.value))}
                required
                className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#032e20] text-white font-bold text-sm outline-hidden focus:ring-2 focus:ring-csus-gold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-emerald-100/90 mb-1">
              Notes / Description (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#022419] text-white outline-hidden focus:ring-2 focus:ring-csus-gold"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-csus-gold/20 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-emerald-100/70 hover:bg-[#063e2c] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-bold text-csus-gold bg-csus-green hover:bg-csus-green-hover border border-csus-gold/50 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5 text-csus-gold" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
