import React from 'react';
import { AccountRole, SheetConfig } from '../types';
import { RefreshCountdown } from './RefreshCountdown';
import { AccountSwitcher } from './AccountSwitcher';
import { Layers, FileSpreadsheet, Settings, ShieldAlert, Sparkles } from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  currentRole: AccountRole;
  onChangeRole: (role: AccountRole) => void;
  googleUser: User | null;
  onGoogleSignIn: () => void;
  onLogout: () => void;
  isSigningIn: boolean;
  sheetConfig: SheetConfig;
  secondsLeft: number;
  isRefreshing: boolean;
  isPaused: boolean;
  lastSyncTime?: Date;
  onManualRefresh: () => void;
  onTogglePause: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onChangeRole,
  googleUser,
  onGoogleSignIn,
  onLogout,
  isSigningIn,
  sheetConfig,
  secondsLeft,
  isRefreshing,
  isPaused,
  lastSyncTime,
  onManualRefresh,
  onTogglePause,
  onOpenSettings,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#03291d]/95 backdrop-blur-md border-b-2 border-csus-gold/25 text-white transition-colors shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-csus-green p-0.5 shadow-md flex items-center justify-center border-2 border-csus-gold">
              <div className="w-full h-full bg-csus-green rounded-[8px] flex items-center justify-center text-csus-gold">
                <Layers className="w-5 h-5 text-csus-gold" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-csus-gold text-base tracking-tight flex items-center gap-1.5">
                  <span className="text-xs uppercase tracking-wider font-mono font-bold px-1.5 py-0.5 rounded bg-csus-green text-csus-gold border border-csus-gold/40">
                    CSUS
                  </span>
                  <span>ClassPulse</span>
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-csus-gold/20 text-csus-gold border border-csus-gold/50">
                  30s Sync
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/70 truncate max-w-[200px] sm:max-w-xs">
                Sacramento State Class Availability
              </p>
            </div>
          </div>

          {/* Middle: 30-Second Refresh Countdown */}
          <div className="hidden md:flex items-center">
            <RefreshCountdown
              secondsLeft={secondsLeft}
              totalInterval={sheetConfig.refreshIntervalSeconds || 30}
              isRefreshing={isRefreshing}
              isPaused={isPaused}
              lastSyncTime={lastSyncTime}
              onManualRefresh={onManualRefresh}
              onTogglePause={onTogglePause}
            />
          </div>

          {/* Right: Actions, Sheet Settings, Account Switcher */}
          <div className="flex items-center gap-2">
            {/* Sheet Link / Setup Button */}
            <button
              onClick={onOpenSettings}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-csus-gold/30 bg-[#063e2c] hover:bg-[#084f38] text-csus-gold text-xs font-semibold shadow-xs transition-colors"
              title="Google Sheet configuration and auto-refresh settings"
            >
              <FileSpreadsheet className="w-4 h-4 text-csus-gold" />
              <span className="hidden lg:inline">Sheet Settings</span>
              <Settings className="w-3.5 h-3.5 text-csus-gold/70" />
            </button>

            {/* Account Switcher with Google Auth */}
            <AccountSwitcher
              currentRole={currentRole}
              onChangeRole={onChangeRole}
              googleUser={googleUser}
              onGoogleSignIn={onGoogleSignIn}
              onLogout={onLogout}
              isSigningIn={isSigningIn}
            />
          </div>
        </div>

        {/* Mobile countdown bar */}
        <div className="md:hidden py-2 border-t border-csus-gold/20 flex items-center justify-between">
          <RefreshCountdown
            secondsLeft={secondsLeft}
            totalInterval={sheetConfig.refreshIntervalSeconds || 30}
            isRefreshing={isRefreshing}
            isPaused={isPaused}
            lastSyncTime={lastSyncTime}
            onManualRefresh={onManualRefresh}
            onTogglePause={onTogglePause}
          />
        </div>
      </div>
    </header>
  );
};
