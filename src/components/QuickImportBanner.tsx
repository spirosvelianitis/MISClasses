import React, { useState } from 'react';
import { extractSpreadsheetId, parseRawClipboardOrCsv, fetchSheetValues, fetchPublicSheetCsv, parseSheetRows } from '../services/googleSheets';
import { ClassItem, SheetConfig } from '../types';
import { FileSpreadsheet, ClipboardCopy, CheckCircle, AlertCircle, ArrowRight, Sparkles, X } from 'lucide-react';

interface QuickImportBannerProps {
  onApplyClasses: (classes: ClassItem[], sheetInfo?: { urlOrId?: string; isCustom?: boolean }) => void;
  accessToken: string | null;
  onOpenFullSettings: () => void;
  thresholdPercent: number;
}

export const QuickImportBanner: React.FC<QuickImportBannerProps> = ({
  onApplyClasses,
  accessToken,
  onOpenFullSettings,
  thresholdPercent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'paste-text' | 'paste-link'>('paste-text');
  const [sheetUrl, setSheetUrl] = useState('');
  const [rawText, setRawText] = useState('');
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedPreview, setParsedPreview] = useState<ClassItem[] | null>(null);

  const handlePreviewText = (text: string) => {
    setRawText(text);
    setStatusMessage(null);
    if (!text.trim()) {
      setParsedPreview(null);
      return;
    }
    try {
      const items = parseRawClipboardOrCsv(text);
      setParsedPreview(items);
      const lowCount = items.filter(i => (i.availableSeats / Math.max(1, i.capacity)) * 100 < thresholdPercent).length;
      setStatusMessage({
        text: `Detected ${items.length} classes (${lowCount} have < 25% seats and will show orange gauges).`,
        type: 'info',
      });
    } catch (err: unknown) {
      setParsedPreview(null);
      setStatusMessage({
        text: (err as Error).message || 'Unable to parse. Ensure first row has column headers (e.g. Class Name, Capacity, Available Sheets).',
        type: 'error',
      });
    }
  };

  const handleApplyText = () => {
    if (!parsedPreview || parsedPreview.length === 0) return;
    onApplyClasses(parsedPreview, { isCustom: true });
    setStatusMessage({
      text: `Successfully imported ${parsedPreview.length} classes from your pasted data!`,
      type: 'success',
    });
    setTimeout(() => {
      setIsOpen(false);
      setStatusMessage(null);
    }, 1500);
  };

  const handleLoadSheetLink = async () => {
    const trimmed = sheetUrl.trim();
    if (!trimmed) {
      setStatusMessage({ text: 'Please enter a Google Sheet URL or ID.', type: 'error' });
      return;
    }
    const id = extractSpreadsheetId(trimmed);
    if (!id) {
      setStatusMessage({ text: 'Could not extract valid Google Spreadsheet ID from link.', type: 'error' });
      return;
    }

    setIsLoading(true);
    setStatusMessage({ text: 'Connecting to Google Sheet...', type: 'info' });

    try {
      let rows: (string | number)[][] = [];

      // Try authenticated Google Sheets API first if token is available
      if (accessToken) {
        try {
          rows = await fetchSheetValues(id, 'A1:Z100', accessToken);
        } catch {
          // If token fails or sheet tab has specific name, fallback to public CSV
          rows = await fetchPublicSheetCsv(id);
        }
      } else {
        // Fallback to public CSV
        rows = await fetchPublicSheetCsv(id);
      }

      const items = parseSheetRows(rows);
      if (items.length === 0) {
        throw new Error('No class rows found. Please check column headers (Class Name, Capacity, Available Seats/Sheets).');
      }

      onApplyClasses(items, { urlOrId: trimmed, isCustom: true });
      setStatusMessage({
        text: `Connected! Loaded ${items.length} classes from your Google Sheet.`,
        type: 'success',
      });
      setTimeout(() => {
        setIsOpen(false);
        setStatusMessage(null);
      }, 1500);
    } catch (err: unknown) {
      setStatusMessage({
        text: (err as Error).message || 'Failed to fetch spreadsheet. If private, please connect your Google account or share as "Anyone with link".',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Quick preset template for user to test pasting
  const insertSampleData = () => {
    const sample = `Class Name\tInstructor\tSchedule\tLocation\tClass Capacity\tAvailable Sheets\tNotes
Morning Vinyasa Yoga\tElena Rostova\tMon/Wed 8:00 AM\tStudio A\t20\t3\t< 25% remaining (Orange Gauge)
Full Stack Engineering\tMarcus Chen\tTue/Thu 6:00 PM\tLab 3\t25\t4\t< 25% remaining (Orange Gauge)
Intro to Machine Learning\tDr. Priya Sharma\tWed 5:30 PM\tHall 102\t30\t22\tPlenty of seats
Ceramics & Pottery\tSarah Jenkins\tSat 10:00 AM\tBarn B\t12\t1\t< 25% remaining (Orange Gauge)
Pilates Fundamentals\tChloe Bennett\tTue 9:00 AM\tStudio C\t10\t0\tFull capacity
HIIT Cardio Burn\tDerrick Vance\tFri 12:00 PM\tGym Deck\t24\t18\tOpen availability`;
    handlePreviewText(sample);
  };

  return (
    <div className="mb-6">
      {!isOpen ? (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#032e20] via-[#053b29] to-[#032e20] border-2 border-csus-gold/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-csus-green text-csus-gold border border-csus-gold/50 shadow-xs">
              <FileSpreadsheet className="w-5 h-5 text-csus-gold" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-csus-gold">
                Import Your Google Sheet Data
              </h4>
              <p className="text-xs text-emerald-100/70">
                Paste your Google Sheet link or copy-paste spreadsheet cells directly to replace the schedule with your exact data.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setIsOpen(true);
                setActiveTab('paste-text');
              }}
              className="px-3.5 py-2 bg-csus-green hover:bg-csus-green-hover text-csus-gold text-xs font-bold rounded-xl shadow-xs border border-csus-gold/50 transition-colors flex items-center gap-1.5"
            >
              <ClipboardCopy className="w-3.5 h-3.5" />
              <span>Paste Sheet Data</span>
            </button>
            <button
              onClick={() => {
                setIsOpen(true);
                setActiveTab('paste-link');
              }}
              className="px-3.5 py-2 bg-[#063e2c] hover:bg-[#084f38] text-csus-gold text-xs font-bold rounded-xl border border-csus-gold/35 transition-colors"
            >
              Enter Sheet Link
            </button>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-[#043323] border-2 border-csus-gold/35 shadow-2xl text-white animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-csus-gold/20">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-csus-gold" />
              <h4 className="text-sm font-bold text-csus-gold">
                Load Your Exact Google Sheet Data
              </h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-emerald-100/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 my-3">
            <button
              onClick={() => setActiveTab('paste-text')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'paste-text'
                  ? 'bg-csus-green text-csus-gold border border-csus-gold/40 font-bold'
                  : 'text-emerald-100/70 hover:text-csus-gold'
              }`}
            >
              Copy & Paste Cells (Direct from Google Sheets)
            </button>
            <button
              onClick={() => setActiveTab('paste-link')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'paste-link'
                  ? 'bg-csus-green text-csus-gold border border-csus-gold/40 font-bold'
                  : 'text-emerald-100/70 hover:text-csus-gold'
              }`}
            >
              Connect via Google Sheet Link / ID
            </button>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`mb-3 p-3 rounded-xl text-xs flex items-start gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-[#064e35] text-emerald-100 border border-emerald-500/50'
                  : statusMessage.type === 'error'
                  ? 'bg-[#2b0c0c] text-red-200 border border-red-500/50'
                  : 'bg-[#063e2c] text-csus-gold border border-csus-gold/40'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-400" />
              ) : statusMessage.type === 'error' ? (
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-400" />
              ) : (
                <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-csus-gold" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {activeTab === 'paste-text' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-emerald-100/90">
                  Select and copy cells in your Google Sheet (including headers), then paste here:
                </label>
                <button
                  type="button"
                  onClick={insertSampleData}
                  className="text-csus-gold hover:underline text-[11px] font-semibold"
                >
                  Insert Sample Data Format
                </button>
              </div>

              <textarea
                rows={6}
                value={rawText}
                onChange={e => handlePreviewText(e.target.value)}
                placeholder="Class Name	Instructor	Schedule	Class Capacity	Available Sheets&#10;Yoga Flow	Elena	Mon 8am	20	3&#10;Coding Bootcamp	Marcus	Tue 6pm	25	4"
                className="w-full p-3 font-mono text-xs rounded-xl border border-csus-gold/30 bg-[#022419] text-white placeholder-emerald-100/40 outline-hidden focus:ring-2 focus:ring-csus-gold"
              />

              {parsedPreview && parsedPreview.length > 0 && (
                <div className="p-3 bg-[#022419] rounded-xl border border-csus-gold/30 text-xs">
                  <div className="flex items-center justify-between font-semibold mb-2">
                    <span className="text-white">Preview: {parsedPreview.length} classes parsed</span>
                    <span className="text-orange-400 font-bold">
                      {parsedPreview.filter(p => (p.availableSeats / Math.max(1, p.capacity)) * 100 < thresholdPercent).length} classes with &lt; 25% seats
                    </span>
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {parsedPreview.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] py-0.5 border-b border-csus-gold/15">
                        <span className="font-medium truncate max-w-[200px] text-white">{item.name}</span>
                        <span className="text-emerald-100/60">{item.instructor}</span>
                        <span className={item.availableSeats / item.capacity < 0.25 ? 'text-orange-400 font-bold' : 'text-csus-gold'}>
                          {item.availableSeats} / {item.capacity} seats left
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-emerald-100/70 hover:bg-[#063e2c] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyText}
                  disabled={!parsedPreview || parsedPreview.length === 0}
                  className="px-5 py-2 bg-csus-green hover:bg-csus-green-hover text-csus-gold border border-csus-gold/50 text-xs font-bold rounded-xl shadow-xs disabled:opacity-50 flex items-center gap-1.5 transition-colors"
                >
                  <span>Apply This Data to App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-emerald-100/90 mb-1">
                  Google Sheet URL or Spreadsheet ID:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sheetUrl}
                    onChange={e => setSheetUrl(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-csus-gold/30 bg-[#022419] text-white placeholder-emerald-100/40 text-xs outline-hidden focus:ring-2 focus:ring-csus-gold"
                  />
                  <button
                    type="button"
                    onClick={handleLoadSheetLink}
                    disabled={isLoading || !sheetUrl.trim()}
                    className="px-4 py-2 bg-csus-green hover:bg-csus-green-hover text-csus-gold border border-csus-gold/50 text-xs font-bold rounded-xl shadow-xs disabled:opacity-50 flex items-center gap-1.5 transition-colors flex-shrink-0"
                  >
                    {isLoading ? 'Connecting...' : 'Fetch Sheet'}
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] text-emerald-100/60">
                  Tip: If your Google Sheet is shared with &quot;Anyone with the link can view&quot;, the app can pull live updates every 30 seconds immediately!
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
