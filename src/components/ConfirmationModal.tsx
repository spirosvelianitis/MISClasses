import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  details?: string[];
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  details,
  confirmLabel = 'Confirm & Update Sheet',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#043323] text-white rounded-2xl max-w-md w-full shadow-2xl border border-csus-gold/30 overflow-hidden transform transition-all scale-100">
        <div className="p-6">
          <div className="flex items-start gap-3">
            <div
              className={`p-3 rounded-full flex-shrink-0 ${
                isDestructive
                  ? 'bg-red-950/80 text-red-400 border border-red-500/40'
                  : 'bg-[#022419] text-csus-gold border border-csus-gold/40'
              }`}
            >
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm text-emerald-100/80 leading-relaxed">
                {message}
              </p>

              {details && details.length > 0 && (
                <div className="mt-3 p-3 bg-[#022419] rounded-lg border border-csus-gold/25 text-xs text-emerald-100/90 space-y-1">
                  {details.map((detail, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 font-mono">
                      <span className="text-csus-gold">•</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onCancel}
              disabled={isLoading}
              className="text-emerald-100/60 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#022419] border-t border-csus-gold/20 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-sm font-semibold text-emerald-100/70 hover:bg-[#063e2c] rounded-xl transition-colors disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 ${
              isDestructive
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-500/20'
                : 'bg-csus-green hover:bg-csus-green-hover text-csus-gold border border-csus-gold/50 shadow-csus-green/20'
            } disabled:opacity-50`}
          >
            {isLoading && (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
