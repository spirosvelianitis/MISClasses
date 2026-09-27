import React from 'react';
import { RefreshCw, Clock, Pause, Play, CheckCircle2 } from 'lucide-react';

interface RefreshCountdownProps {
  secondsLeft: number;
  totalInterval: number; // usually 30
  isRefreshing: boolean;
  isPaused: boolean;
  lastSyncTime?: Date;
  onManualRefresh: () => void;
  onTogglePause: () => void;
}

export const RefreshCountdown: React.FC<RefreshCountdownProps> = ({
  secondsLeft,
  totalInterval = 30,
  isRefreshing,
  isPaused,
  lastSyncTime,
  onManualRefresh,
  onTogglePause,
}) => {
  const progressPercent = ((totalInterval - secondsLeft) / totalInterval) * 100;
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="flex items-center gap-3 bg-[#022419]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-csus-gold/30 shadow-xs text-xs text-white">
      {/* Live radial timer */}
      <div className="relative flex items-center justify-center w-8 h-8 flex-shrink-0">
        <svg width="32" height="32" className="transform -rotate-90">
          <circle
            cx="16"
            cy="16"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="3"
            className="text-[#063e2c]"
          />
          <circle
            cx="16"
            cy="16"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={isPaused ? circumference : strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-300 ${
              isRefreshing
                ? 'text-csus-gold animate-spin origin-center'
                : secondsLeft <= 5
                ? 'text-orange-400'
                : 'text-csus-gold'
            }`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-mono font-bold text-[11px] text-csus-gold">
          {isRefreshing ? '…' : isPaused ? '⏸' : secondsLeft}
        </span>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-slate-100">
            {isRefreshing ? 'Syncing...' : isPaused ? 'Auto-sync Paused' : `Auto-sync: ${secondsLeft}s`}
          </span>
          <span className="inline-block w-2 h-2 rounded-full bg-csus-gold animate-pulse" title="Google Sheet Sync Connected" />
        </div>
        <div className="text-[10px] text-emerald-100/60 flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 inline text-csus-gold" />
          <span>
            Updated {lastSyncTime ? lastSyncTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : 'just now'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 ml-1 border-l border-csus-gold/25 pl-2">
        {/* Manual refresh button */}
        <button
          onClick={onManualRefresh}
          disabled={isRefreshing}
          className="p-1.5 rounded-md hover:bg-[#063e2c] text-csus-gold transition-colors disabled:opacity-50"
          title="Refresh from Google Sheet now"
          aria-label="Refresh from Google Sheet now"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-csus-gold' : ''}`} />
        </button>

        {/* Pause/Resume button */}
        <button
          onClick={onTogglePause}
          className="p-1.5 rounded-md hover:bg-[#063e2c] text-csus-gold transition-colors"
          title={isPaused ? 'Resume 30s auto-refresh' : 'Pause 30s auto-refresh'}
          aria-label={isPaused ? 'Resume 30s auto-refresh' : 'Pause 30s auto-refresh'}
        >
          {isPaused ? <Play className="w-3.5 h-3.5 text-csus-gold" /> : <Pause className="w-3.5 h-3.5 text-slate-400" />}
        </button>
      </div>
    </div>
  );
};
