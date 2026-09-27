import React, { useState } from 'react';
import { SheetConfig } from '../types';
import { extractSpreadsheetId, createTemplateSpreadsheet } from '../services/googleSheets';
import { X, FileSpreadsheet, Check, ExternalLink, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface SheetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SheetConfig;
  onSaveConfig: (newConfig: Partial<SheetConfig>) => void;
  accessToken: string | null;
  onResetToDemo: () => void;
  onTriggerSync: () => void;
}

export const SheetSettingsModal: React.FC<SheetSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  accessToken,
  onResetToDemo,
  onTriggerSync,
}) => {
  const [urlInput, setUrlInput] = useState(config.sheetUrl || config.spreadsheetId || '');
  const [sheetName, setSheetName] = useState(config.sheetName || 'Class Availability');
  const [intervalSec, setIntervalSec] = useState(config.refreshIntervalSeconds || 30);
  const [threshold, setThreshold] = useState(config.lowThresholdPercent || 25);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    setErrorMsg(null);
    const trimmed = urlInput.trim();

    if (!trimmed) {
      // Revert to demo sheet
      onResetToDemo();
      onClose();
      return;
    }

    const parsedId = extractSpreadsheetId(trimmed);
    if (!parsedId) {
      setErrorMsg('Invalid Google Sheet URL or Spreadsheet ID. Please verify the link.');
      return;
    }

    onSaveConfig({
      spreadsheetId: parsedId,
      sheetUrl: trimmed.startsWith('http') ? trimmed : `https://docs.google.com/spreadsheets/d/${parsedId}/edit`,
      sheetName: sheetName.trim() || 'Sheet1',
      refreshIntervalSeconds: Number(intervalSec) || 30,
      lowThresholdPercent: Number(threshold) || 25,
      isCustomSheet: true,
    });

    onClose();
    setTimeout(() => onTriggerSync(), 200);
  };

  const handleCreateInDrive = async () => {
    if (!accessToken) {
      setErrorMsg('Please sign in with your Google account first to create a spreadsheet.');
      return;
    }

    setIsCreatingTemplate(true);
    setErrorMsg(null);
    try {
      const result = await createTemplateSpreadsheet(accessToken);
      setCreatedUrl(result.spreadsheetUrl);
      setUrlInput(result.spreadsheetUrl);
      setSheetName(result.sheetName);

      onSaveConfig({
        spreadsheetId: result.spreadsheetId,
        sheetUrl: result.spreadsheetUrl,
        sheetName: result.sheetName,
        isCustomSheet: true,
      });

      setTimeout(() => onTriggerSync(), 400);
    } catch (err: unknown) {
      setErrorMsg((err as Error).message || 'Failed to create template spreadsheet.');
    } finally {
      setIsCreatingTemplate(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#043323] text-white rounded-2xl max-w-xl w-full shadow-2xl border border-csus-gold/30 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-csus-gold/20 flex items-center justify-between bg-[#022419]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-csus-green text-csus-gold border border-csus-gold/40 shadow-xs">
              <FileSpreadsheet className="w-5 h-5 text-csus-gold" />
            </div>
            <div>
              <h3 className="text-base font-bold text-csus-gold">
                Google Sheet Connection & Settings
              </h3>
              <p className="text-xs text-emerald-100/60">
                Configure Google Sheets source, auto-refresh rate, and capacity threshold
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
        <div className="p-5 overflow-y-auto space-y-5 text-sm">
          {errorMsg && (
            <div className="p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {createdUrl && (
            <div className="p-3 bg-[#064e35] border border-emerald-500/50 rounded-xl text-emerald-100 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Spreadsheet created in your Google Drive!</span>
              </div>
              <a
                href={createdUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-semibold underline text-csus-gold hover:text-white"
              >
                Open in Sheets <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {/* Quick Setup Options */}
          <div className="p-4 rounded-xl bg-[#022419] border border-csus-gold/25 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-csus-gold">
              1-Click Google Sheet Setup
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleCreateInDrive}
                disabled={isCreatingTemplate || !accessToken}
                className="flex items-center gap-2 px-3 py-2 bg-csus-green hover:bg-csus-green-hover text-csus-gold border border-csus-gold/50 rounded-xl text-xs font-bold shadow-xs disabled:opacity-50 transition-colors"
                title={!accessToken ? 'Sign in with Google first' : 'Creates a ready-to-use Class Sheet in your Google account'}
              >
                <Sparkles className="w-3.5 h-3.5 text-csus-gold" />
                {isCreatingTemplate ? 'Generating in Drive...' : 'Create Live Sheet in My Drive'}
              </button>

              <button
                type="button"
                onClick={() => {
                  onResetToDemo();
                  setUrlInput('');
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#063e2c] border border-csus-gold/30 text-emerald-100 rounded-xl text-xs font-semibold hover:bg-[#084f38] transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5 text-csus-gold" />
                Use Built-in Demo Sheet
              </button>
            </div>
            {!accessToken && (
              <p className="text-[11px] text-emerald-100/60">
                Tip: Sign in with Google using the top button to create or edit spreadsheets directly.
              </p>
            )}
          </div>

          {/* Google Sheet URL or ID */}
          <div>
            <label className="block text-xs font-bold text-emerald-100/90 mb-1.5">
              Google Sheet URL or Spreadsheet ID
            </label>
            <input
              type="text"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
              className="w-full px-3.5 py-2.5 rounded-xl border border-csus-gold/30 bg-[#022419] text-white placeholder-emerald-100/40 text-xs focus:ring-2 focus:ring-csus-gold outline-hidden"
            />
            <p className="mt-1 text-[11px] text-emerald-100/60">
              Paste any Google Sheets link. The sheet should have headers like: Class Name, Capacity, Available Seats, Schedule, Instructor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Sheet Tab Name */}
            <div>
              <label className="block text-xs font-bold text-emerald-100/90 mb-1.5">
                Tab Name
              </label>
              <input
                type="text"
                value={sheetName}
                onChange={e => setSheetName(e.target.value)}
                placeholder="Class Availability"
                className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#022419] text-white text-xs outline-hidden focus:ring-2 focus:ring-csus-gold"
              />
            </div>

            {/* Refresh Interval */}
            <div>
              <label className="block text-xs font-bold text-emerald-100/90 mb-1.5">
                Auto-Refresh Rate
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={5}
                  max={300}
                  value={intervalSec}
                  onChange={e => setIntervalSec(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#022419] text-white text-xs outline-hidden focus:ring-2 focus:ring-csus-gold"
                />
                <span className="text-xs text-emerald-100/60">sec</span>
              </div>
              <p className="text-[10px] text-emerald-100/50 mt-0.5">Required: 30s</p>
            </div>

            {/* Orange Gauge Threshold */}
            <div>
              <label className="block text-xs font-bold text-emerald-100/90 mb-1.5">
                Orange Gauge Alert
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={5}
                  max={90}
                  value={threshold}
                  onChange={e => setThreshold(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#022419] text-white text-xs outline-hidden focus:ring-2 focus:ring-csus-gold"
                />
                <span className="text-xs text-emerald-100/60">%</span>
              </div>
              <p className="text-[10px] text-orange-400 mt-0.5 font-bold">
                Required: &lt; 25%
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-csus-gold/20 bg-[#022419] flex items-center justify-between">
          <div className="text-[11px] text-emerald-100/70">
            {config.isCustomSheet ? '🟢 Custom Sheet Active' : '⚪ Built-in Demo Sheet Active'}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-emerald-100/70 hover:bg-[#063e2c] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 text-xs font-bold text-csus-gold bg-csus-green hover:bg-csus-green-hover border border-csus-gold/50 rounded-xl shadow-xs transition-colors"
            >
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
