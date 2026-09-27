import React, { useState } from 'react';
import { ClassItem } from '../types';
import { X, Plus, Sparkles } from 'lucide-react';
import { AvailabilityGauge } from './AvailabilityGauge';

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  thresholdPercent: number;
  onAdd: (newItem: Omit<ClassItem, 'id'>) => void;
}

export const AddClassModal: React.FC<AddClassModalProps> = ({
  isOpen,
  onClose,
  thresholdPercent,
  onAdd,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [code, setCode] = useState(`CLS-${Math.floor(100 + Math.random() * 900)}`);
  const [category, setCategory] = useState('General');
  const [instructor, setInstructor] = useState('');
  const [schedule, setSchedule] = useState('');
  const [location, setLocation] = useState('Studio A');
  const [capacity, setCapacity] = useState(20);
  const [availableSeats, setAvailableSeats] = useState(5);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      code,
      name,
      category,
      instructor: instructor || 'Staff',
      schedule: schedule || 'Mon / Wed 10:00 AM',
      location: location || 'Main Hall',
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
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-csus-green text-csus-gold border border-csus-gold/40 shadow-xs">
              <Plus className="w-5 h-5 text-csus-gold" />
            </div>
            <div>
              <h3 className="text-base font-bold text-csus-gold">
                Add New Class (Admin)
              </h3>
              <p className="text-xs text-emerald-100/60">
                Adds a new class row and syncs with your Google Sheet
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Gauge Preview */}
          <div className="p-4 rounded-xl bg-[#022419] border border-csus-gold/25 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-white">
                Initial Availability Preview
              </p>
              <p className="text-[11px] text-emerald-100/70 mt-0.5">
                {availableSeats / capacity < 0.25 ? (
                  <span className="text-orange-400 font-semibold">
                    ⚡ Under 25%: Orange Gauge Alert
                  </span>
                ) : (
                  <span className="text-emerald-300 font-semibold">
                    ✓ Above 25%: Healthy Green Gauge
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
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#022419] text-white outline-hidden focus:ring-2 focus:ring-csus-gold"
              >
                <option value="Wellness & Fitness" className="bg-[#022419]">Wellness & Fitness</option>
                <option value="Technology" className="bg-[#022419]">Technology</option>
                <option value="Arts & Crafts" className="bg-[#022419]">Arts & Crafts</option>
                <option value="Culinary" className="bg-[#022419]">Culinary</option>
                <option value="Design" className="bg-[#022419]">Design</option>
                <option value="Music" className="bg-[#022419]">Music</option>
                <option value="Languages" className="bg-[#022419]">Languages</option>
                <option value="General" className="bg-[#022419]">General</option>
              </select>
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
              placeholder="e.g. Advanced Landscape Painting"
              required
              className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#022419] text-white placeholder-emerald-100/40 outline-hidden focus:ring-2 focus:ring-csus-gold"
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
                placeholder="e.g. Dr. Jordan Rivera"
                required
                className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#022419] text-white placeholder-emerald-100/40 outline-hidden focus:ring-2 focus:ring-csus-gold"
              />
            </div>
            <div>
              <label className="block font-semibold text-emerald-100/90 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Studio 3, North Wing"
                required
                className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#022419] text-white placeholder-emerald-100/40 outline-hidden focus:ring-2 focus:ring-csus-gold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-emerald-100/90 mb-1">
              Schedule & Times
            </label>
            <input
              type="text"
              value={schedule}
              onChange={e => setSchedule(e.target.value)}
              placeholder="e.g. Tue / Thu 05:00 PM - 06:30 PM"
              required
              className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#022419] text-white placeholder-emerald-100/40 outline-hidden focus:ring-2 focus:ring-csus-gold"
            />
          </div>

          {/* Capacities */}
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
                onChange={e => {
                  const val = Math.max(1, Number(e.target.value));
                  setCapacity(val);
                  if (availableSeats > val) setAvailableSeats(val);
                }}
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
                onChange={e => {
                  const val = Math.max(0, Math.min(capacity, Number(e.target.value)));
                  setAvailableSeats(val);
                }}
                required
                className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#032e20] text-white font-bold text-sm outline-hidden focus:ring-2 focus:ring-csus-gold"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-emerald-100/90 mb-1">
              Notes / Prerequisites (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Materials provided, suitable for beginners."
              className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#022419] text-white placeholder-emerald-100/40 outline-hidden focus:ring-2 focus:ring-csus-gold"
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
              <Sparkles className="w-3.5 h-3.5 text-csus-gold" />
              Add Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
