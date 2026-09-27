/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { User } from 'firebase/auth';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
  setAccessTokenInMemory,
} from './services/auth';
import {
  INITIAL_CLASSES,
  fetchSheetValues,
  parseSheetRows,
  updateSheetRow,
  appendSheetRow,
  getSpreadsheetDetails,
  DEFAULT_SHEET_RANGE,
  extractSpreadsheetId,
  formatRangeWithSheetName,
} from './services/googleSheets';
import { ClassItem, AccountRole, SheetConfig, UserBooking } from './types';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { ClassCard } from './components/ClassCard';
import { ClassTable } from './components/ClassTable';
import { EditClassModal } from './components/EditClassModal';
import { AddClassModal } from './components/AddClassModal';
import { BookingModal } from './components/BookingModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SheetSettingsModal } from './components/SheetSettingsModal';
import { MyBookingsModal } from './components/MyBookingsModal';
import { QuickImportBanner } from './components/QuickImportBanner';
import {
  Search,
  Filter,
  LayoutGrid,
  List,
  Plus,
  BookmarkCheck,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  FileSpreadsheet,
  ExternalLink,
  Flame,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  // Auth state
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Dual Account Role: 'admin' vs 'user'
  const [currentRole, setCurrentRole] = useState<AccountRole>('admin');

  // Sheet configuration
  const [sheetConfig, setSheetConfig] = useState<SheetConfig>({
    spreadsheetId: '',
    sheetName: 'Class Availability',
    range: DEFAULT_SHEET_RANGE,
    isCustomSheet: false,
    refreshIntervalSeconds: 30, // 30 seconds auto-refresh as requested
    lowThresholdPercent: 25, // 25% threshold for orange gauge as requested
    status: 'idle',
    lastSyncTime: new Date(),
  });

  // Class data
  const [classes, setClasses] = useState<ClassItem[]>(INITIAL_CLASSES);
  const [userBookings, setUserBookings] = useState<UserBooking[]>([]);

  // 30-Second Refresh Cycle State
  const [secondsLeft, setSecondsLeft] = useState<number>(30);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // UI View & Filter state
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedFilter, setSelectedFilter] = useState<string>('all'); // all, available, low, full

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);

  // Confirmation Modal state (Mandatory for Workspace Integration mutating actions)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    details?: string[];
    confirmLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirm',
    onConfirm: () => {},
  });

  // Initialize Firebase Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setAccessToken(token);
        setAccessTokenInMemory(token);
      },
      () => {
        setGoogleUser(null);
        setAccessToken(null);
        setAccessTokenInMemory(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        setAccessToken(res.accessToken);
        setAccessTokenInMemory(res.accessToken);
        setSyncNotice(`Signed in as ${res.user.displayName || res.user.email}`);
        setTimeout(() => setSyncNotice(null), 4000);
      }
    } catch (err: unknown) {
      const errorObj = err as { code?: string; message?: string };
      if (
        errorObj?.code !== 'auth/popup-closed-by-user' &&
        errorObj?.code !== 'auth/cancelled-popup-request' &&
        !errorObj?.message?.includes('popup-closed-by-user')
      ) {
        setSyncNotice('Sign-in could not be completed.');
        setTimeout(() => setSyncNotice(null), 3000);
      }
    } finally {
      setIsSigningIn(false);
    }
  };

  // Handle Logout
  const handleLogout = async () => {
    await logout();
    setGoogleUser(null);
    setAccessToken(null);
    setAccessTokenInMemory(null);
  };

  // Google Sheet Data Fetcher
  const refreshFromGoogleSheet = useCallback(async (showNotice = false) => {
    setIsRefreshing(true);
    try {
      const token = await getAccessToken();

      // If user provided a live custom spreadsheet and has Google Auth token
      if (sheetConfig.isCustomSheet && sheetConfig.spreadsheetId && token) {
        const fullRange = formatRangeWithSheetName(sheetConfig.sheetName, DEFAULT_SHEET_RANGE);
        const rawRows = await fetchSheetValues(sheetConfig.spreadsheetId, fullRange, token);
        const parsed = parseSheetRows(rawRows);
        if (parsed.length > 0) {
          setClasses(parsed);
          setSheetConfig(prev => ({
            ...prev,
            status: 'connected',
            lastSyncTime: new Date(),
            errorMessage: undefined,
          }));
          if (showNotice) {
            setSyncNotice(`Synced ${parsed.length} classes from Google Sheet`);
            setTimeout(() => setSyncNotice(null), 3000);
          }
        }
      } else {
        // In built-in demo mode, simulate 30s live freshness timestamp
        setClasses(prev =>
          prev.map(c => ({
            ...c,
            updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          }))
        );
        setSheetConfig(prev => ({
          ...prev,
          lastSyncTime: new Date(),
        }));
        if (showNotice) {
          setSyncNotice('Refreshed data (Demo Mode)');
          setTimeout(() => setSyncNotice(null), 3000);
        }
      }
    } catch (err: unknown) {
      const errMsg = (err as Error).message || 'Unable to sync with Google Sheet';
      setSheetConfig(prev => ({
        ...prev,
        status: 'error',
        errorMessage: errMsg,
      }));
    } finally {
      setIsRefreshing(false);
      setSecondsLeft(sheetConfig.refreshIntervalSeconds || 30);
    }
  }, [sheetConfig.isCustomSheet, sheetConfig.spreadsheetId, sheetConfig.sheetName, sheetConfig.refreshIntervalSeconds]);

  // 30-Second Refresh Countdown Timer
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          // Trigger 30-second refresh
          refreshFromGoogleSheet(false);
          return sheetConfig.refreshIntervalSeconds || 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, refreshFromGoogleSheet, sheetConfig.refreshIntervalSeconds]);

  // Manual Refresh Handler
  const handleManualRefresh = () => {
    setSecondsLeft(sheetConfig.refreshIntervalSeconds || 30);
    refreshFromGoogleSheet(true);
  };

  // Toggle Auto-sync Pause
  const handleTogglePause = () => {
    setIsPaused(prev => !prev);
  };

  // Save modified class (Admin operation) with workspace user confirmation
  const handleSaveClass = (updatedClass: ClassItem) => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirm Google Sheet Update',
      message: `Are you sure you want to update "${updatedClass.name}"? This will modify the available seats (${updatedClass.availableSeats}/${updatedClass.capacity}) in the Google Sheet.`,
      details: [
        `Class: ${updatedClass.name} (${updatedClass.code})`,
        `Capacity: ${updatedClass.capacity} seats`,
        `Available Seats: ${updatedClass.availableSeats} (${Math.round((updatedClass.availableSeats / updatedClass.capacity) * 100)}%)`,
        `Location: ${updatedClass.location}`,
      ],
      confirmLabel: 'Update Sheet',
      isDestructive: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        setIsEditModalOpen(false);

        // Update local state immediately
        setClasses(prev => prev.map(c => (c.id === updatedClass.id ? updatedClass : c)));

        // If connected to a real sheet with auth, update row
        if (sheetConfig.isCustomSheet && sheetConfig.spreadsheetId && accessToken && updatedClass.rowNumber) {
          try {
            await updateSheetRow(
              sheetConfig.spreadsheetId,
              sheetConfig.sheetName,
              updatedClass.rowNumber,
              updatedClass,
              accessToken
            );
            setSyncNotice(`Updated ${updatedClass.code} in Google Sheet!`);
            setTimeout(() => setSyncNotice(null), 3000);
          } catch (err: unknown) {
            console.error('Failed to update Google Sheet row:', err);
            setSyncNotice(`Saved locally (Sheet update error: ${(err as Error).message})`);
          }
        }
      },
    });
  };

  // Quick adjust seats (+1 or -1) for Admin with confirmation
  const handleQuickAdjustSeats = (item: ClassItem, delta: number) => {
    const newAvail = Math.max(0, Math.min(item.capacity, item.availableSeats + delta));
    const actionDesc = delta > 0 ? 'Increase available seats' : 'Decrease available seats';

    setConfirmModal({
      isOpen: true,
      title: `${actionDesc} for ${item.name}`,
      message: `Adjust available seats from ${item.availableSeats} to ${newAvail} of ${item.capacity}?`,
      details: [
        `Class: ${item.name} (${item.code})`,
        `Current Available: ${item.availableSeats}`,
        `New Available: ${newAvail} (${Math.round((newAvail / item.capacity) * 100)}%)`,
        newAvail / item.capacity < (sheetConfig.lowThresholdPercent || 25) / 100
          ? '⚠️ Notice: This class will display the ORANGE low-seat gauge.'
          : '✓ Gauge will show healthy green availability.',
      ],
      confirmLabel: 'Apply Seat Change',
      isDestructive: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        const updatedItem = {
          ...item,
          availableSeats: newAvail,
          enrolled: Math.max(0, item.capacity - newAvail),
          updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        };

        setClasses(prev => prev.map(c => (c.id === item.id ? updatedItem : c)));

        if (sheetConfig.isCustomSheet && sheetConfig.spreadsheetId && accessToken && updatedItem.rowNumber) {
          try {
            await updateSheetRow(
              sheetConfig.spreadsheetId,
              sheetConfig.sheetName,
              updatedItem.rowNumber,
              updatedItem,
              accessToken
            );
            setSyncNotice(`Updated seats in Google Sheet: ${newAvail} left`);
            setTimeout(() => setSyncNotice(null), 3000);
          } catch (err: unknown) {
            console.error('Failed to sync seat change:', err);
          }
        }
      },
    });
  };

  // Add new class (Admin operation)
  const handleAddClass = (newItem: Omit<ClassItem, 'id'>) => {
    setConfirmModal({
      isOpen: true,
      title: 'Confirm Add New Class',
      message: `Add "${newItem.name}" to the schedule and Google Sheet?`,
      details: [
        `Code: ${newItem.code}`,
        `Instructor: ${newItem.instructor}`,
        `Schedule: ${newItem.schedule}`,
        `Capacity: ${newItem.capacity} seats (${newItem.availableSeats} open)`,
      ],
      confirmLabel: 'Add & Sync Sheet',
      isDestructive: false,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        setIsAddModalOpen(false);

        const newRowNumber = classes.length + 2;
        const fullItem: ClassItem = {
          ...newItem,
          id: `row-${newRowNumber}-${Date.now()}`,
          rowNumber: newRowNumber,
        };

        setClasses(prev => [fullItem, ...prev]);

        if (sheetConfig.isCustomSheet && sheetConfig.spreadsheetId && accessToken) {
          try {
            await appendSheetRow(
              sheetConfig.spreadsheetId,
              sheetConfig.sheetName,
              fullItem,
              accessToken
            );
            setSyncNotice(`Added ${fullItem.name} to Google Sheet!`);
            setTimeout(() => setSyncNotice(null), 3000);
          } catch (err: unknown) {
            console.error('Failed to append to Google Sheet:', err);
          }
        }
      },
    });
  };

  // Delete class (Admin operation) with destructive confirmation dialog
  const handleDeleteClass = (item: ClassItem) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Class: ${item.name}`,
      message: `Are you sure you want to delete "${item.name}" (${item.code})? This will remove the class from the schedule.`,
      details: [
        `Class Code: ${item.code}`,
        `Instructor: ${item.instructor}`,
        `Enrolled Students: ${item.enrolled}`,
      ],
      confirmLabel: 'Delete Class',
      isDestructive: true,
      onConfirm: () => {
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
        setClasses(prev => prev.filter(c => c.id !== item.id));
        setSyncNotice(`Removed ${item.name} from schedule`);
        setTimeout(() => setSyncNotice(null), 3000);
      },
    });
  };

  // End User Booking confirmation
  const handleConfirmBooking = (classItem: ClassItem, studentName: string, studentEmail: string) => {
    if (classItem.availableSeats <= 0) return;

    const newAvail = Math.max(0, classItem.availableSeats - 1);
    const updatedClass = {
      ...classItem,
      availableSeats: newAvail,
      enrolled: classItem.enrolled + 1,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    // Update classes
    setClasses(prev => prev.map(c => (c.id === classItem.id ? updatedClass : c)));

    // Add to user bookings
    const newBooking: UserBooking = {
      id: `book-${Date.now()}`,
      classId: classItem.id,
      className: classItem.name,
      studentName,
      studentEmail,
      bookedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setUserBookings(prev => [newBooking, ...prev]);

    setSyncNotice(`Reserved 1 seat for ${classItem.name}! (${newAvail} seats left)`);
    setTimeout(() => setSyncNotice(null), 4000);

    // Write back to sheet if connected
    if (sheetConfig.isCustomSheet && sheetConfig.spreadsheetId && accessToken && updatedClass.rowNumber) {
      updateSheetRow(
        sheetConfig.spreadsheetId,
        sheetConfig.sheetName,
        updatedClass.rowNumber,
        updatedClass,
        accessToken
      ).catch(err => console.error('Failed to sync booking to Google Sheet:', err));
    }
  };

  // Cancel booking
  const handleCancelBooking = (bookingId: string, classId: string) => {
    setUserBookings(prev => prev.filter(b => b.id !== bookingId));
    // Release 1 seat back
    setClasses(prev =>
      prev.map(c => {
        if (c.id === classId) {
          const newAvail = Math.min(c.capacity, c.availableSeats + 1);
          return {
            ...c,
            availableSeats: newAvail,
            enrolled: Math.max(0, c.enrolled - 1),
          };
        }
        return c;
      })
    );
    setSyncNotice('Booking cancelled and seat released.');
    setTimeout(() => setSyncNotice(null), 3000);
  };

  // Apply imported classes from quick paste or sheet link
  const handleApplyImportedClasses = (newClasses: ClassItem[], sheetInfo?: { urlOrId?: string; isCustom?: boolean }) => {
    setClasses(newClasses);
    if (sheetInfo?.urlOrId) {
      const parsedId = extractSpreadsheetId(sheetInfo.urlOrId);
      if (parsedId) {
        setSheetConfig(prev => ({
          ...prev,
          spreadsheetId: parsedId,
          sheetUrl: sheetInfo.urlOrId!.startsWith('http') ? sheetInfo.urlOrId : `https://docs.google.com/spreadsheets/d/${parsedId}/edit`,
          isCustomSheet: true,
          status: 'connected',
          lastSyncTime: new Date(),
        }));
      }
    } else {
      setSheetConfig(prev => ({
        ...prev,
        isCustomSheet: true,
        lastSyncTime: new Date(),
      }));
    }
  };

  // Filtered and searched classes
  const categories = useMemo(() => {
    const set = new Set<string>();
    classes.forEach(c => set.add(c.category));
    return ['All', ...Array.from(set)];
  }, [classes]);

  const filteredClasses = useMemo(() => {
    return classes.filter(item => {
      // Search match
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.instructor.toLowerCase().includes(query) ||
        item.location.toLowerCase().includes(query);

      // Category match
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;

      // Stats filter card match
      const percentRemaining = (item.availableSeats / Math.max(1, item.capacity)) * 100;
      let matchesFilter = true;
      if (selectedFilter === 'available') {
        matchesFilter = item.availableSeats > 0;
      } else if (selectedFilter === 'low') {
        matchesFilter = percentRemaining < (sheetConfig.lowThresholdPercent || 25) && item.availableSeats > 0;
      } else if (selectedFilter === 'full') {
        matchesFilter = item.availableSeats === 0;
      }

      return matchesSearch && matchesCat && matchesFilter;
    });
  }, [classes, searchQuery, selectedCategory, selectedFilter, sheetConfig.lowThresholdPercent]);

  const userBookedClassIds = useMemo(() => {
    return new Set(userBookings.map(b => b.classId));
  }, [userBookings]);

  return (
    <div className="min-h-screen bg-[#022419] text-slate-100 flex flex-col font-sans transition-colors selection:bg-csus-gold selection:text-[#022419]">
      {/* Top Notification Toast */}
      {syncNotice && (
        <div className="fixed top-18 right-6 z-50 animate-bounce">
          <div className="bg-[#043323] text-csus-gold px-4 py-2.5 rounded-xl shadow-2xl border border-csus-gold/50 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-csus-gold" />
            <span>{syncNotice}</span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        googleUser={googleUser}
        onGoogleSignIn={handleGoogleSignIn}
        onLogout={handleLogout}
        isSigningIn={isSigningIn}
        sheetConfig={sheetConfig}
        secondsLeft={secondsLeft}
        isRefreshing={isRefreshing}
        isPaused={isPaused}
        lastSyncTime={sheetConfig.lastSyncTime}
        onManualRefresh={handleManualRefresh}
        onTogglePause={handleTogglePause}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
      />

      {/* Hero & Account Context Bar */}
      <section className="bg-[#032e20] border-b border-csus-gold/20 py-6 sm:py-8 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                    currentRole === 'admin'
                      ? 'bg-csus-green text-csus-gold border border-csus-gold/40 shadow-xs'
                      : 'bg-csus-gold/20 text-csus-gold border border-csus-gold/60'
                  }`}
                >
                  {currentRole === 'admin' ? (
                    <>
                      <ShieldCheck className="w-3.5 h-3.5 text-csus-gold" /> Admin Account Active
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-csus-gold" /> End User Account Active
                    </>
                  )}
                </span>

                {/* Orange Gauge Rule Explainer Pill */}
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-950/70 text-orange-300 border border-orange-700/80">
                  <Flame className="w-3.5 h-3.5 text-orange-400 fill-current" />
                  &lt; 25% Capacity = Orange Gauge
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentRole === 'admin' ? 'Class Capacity & Availability Management' : 'Live Class Availability & Enrollment'}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/70 mt-1 max-w-2xl">
                {currentRole === 'admin'
                  ? 'Manage seat quotas, edit availability, and monitor real-time fill rates synced every 30 seconds with Google Sheets.'
                  : 'Check live open seats, watch low-capacity alerts, and reserve your class spots in real time.'}
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {currentRole === 'admin' ? (
                <>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2.5 bg-csus-green hover:bg-csus-green-hover text-csus-gold border border-csus-gold/50 rounded-xl text-xs font-bold shadow-md shadow-csus-green/20 transition-all"
                  >
                    <Plus className="w-4 h-4 text-csus-gold" />
                    <span>Add New Class</span>
                  </button>
                  <button
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#063e2c] hover:bg-[#084f38] text-csus-gold rounded-xl text-xs font-bold border border-csus-gold/30 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-csus-gold" />
                    <span>Configure Sheet</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsMyBookingsOpen(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-csus-green hover:bg-csus-green-hover text-csus-gold border border-csus-gold/50 rounded-xl text-xs font-bold shadow-md shadow-csus-green/20 transition-all"
                >
                  <BookmarkCheck className="w-4 h-4 text-csus-gold" />
                  <span>My Bookings ({userBookings.length})</span>
                </button>
              )}
            </div>
          </div>

          {/* Connected Google Sheet Status Banner */}
          {sheetConfig.isCustomSheet && (
            <div className="mt-4 p-3 rounded-xl bg-[#043927] border border-csus-gold/30 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-csus-gold" />
                <span className="font-semibold text-white">
                  Google Sheet: {sheetConfig.sheetName} ({sheetConfig.spreadsheetId.slice(0, 12)}...)
                </span>
                <span className="text-[11px] text-emerald-100/60 hidden sm:inline">
                  • Polling every {sheetConfig.refreshIntervalSeconds}s
                </span>
              </div>
              {sheetConfig.sheetUrl && (
                <a
                  href={sheetConfig.sheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-semibold text-csus-gold hover:underline"
                >
                  <span>Open Sheet</span>
                  <ExternalLink className="w-3 h-3 text-csus-gold" />
                </a>
              )}
            </div>
          )}

          {/* Stats & Threshold Overview */}
          <StatsOverview
            classes={classes}
            thresholdPercent={sheetConfig.lowThresholdPercent || 25}
            selectedFilter={selectedFilter}
            onSelectFilter={setSelectedFilter}
          />
        </div>
      </section>

      {/* Main Catalog & Controls */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Quick Import / Paste Banner */}
        <QuickImportBanner
          onApplyClasses={handleApplyImportedClasses}
          accessToken={accessToken}
          onOpenFullSettings={() => setIsSettingsModalOpen(true)}
          thresholdPercent={sheetConfig.lowThresholdPercent || 25}
        />

        {/* Search, Category Filter, and View Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-csus-gold/70" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search classes, instructors, rooms..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-csus-gold/30 bg-[#043323] text-white placeholder-emerald-100/40 text-xs outline-hidden focus:ring-2 focus:ring-csus-gold shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-emerald-100/50 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
            {/* Category Select */}
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-csus-gold" />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-csus-gold/30 bg-[#043323] text-white text-xs outline-hidden focus:ring-2 focus:ring-csus-gold shadow-xs"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-[#043323] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Toggle for Orange Alert Only */}
            <button
              onClick={() => setSelectedFilter(selectedFilter === 'low' ? 'all' : 'low')}
              className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                selectedFilter === 'low'
                  ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                  : 'bg-[#043323] text-orange-300 border-orange-500/40 hover:bg-[#2b1705]'
              }`}
              title="Show only classes with available seats < 25% of capacity"
            >
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>&lt; 25% Only</span>
            </button>

            {/* View Mode Toggle (Grid vs Table) */}
            <div className="inline-flex p-1 bg-[#03291d] rounded-xl border border-csus-gold/25">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-csus-green text-csus-gold shadow-xs border border-csus-gold/40'
                    : 'text-emerald-100/60 hover:text-csus-gold'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'table'
                    ? 'bg-csus-green text-csus-gold shadow-xs border border-csus-gold/40'
                    : 'text-emerald-100/60 hover:text-csus-gold'
                }`}
                title="Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Classes Display */}
        {filteredClasses.length === 0 ? (
          <div className="bg-[#043323] rounded-2xl border border-csus-gold/25 p-12 text-center space-y-3 shadow-md">
            <AlertCircle className="w-12 h-12 text-csus-gold/70 mx-auto" />
            <h3 className="text-base font-bold text-white">
              No classes found matching your criteria
            </h3>
            <p className="text-xs text-emerald-100/70 max-w-sm mx-auto">
              Try adjusting your search terms, changing the category, or clearing the &lt; 25% filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedFilter('all');
              }}
              className="px-4 py-2 bg-csus-green hover:bg-csus-green-hover text-csus-gold border border-csus-gold/40 rounded-xl text-xs font-semibold transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredClasses.map(item => (
              <ClassCard
                key={item.id}
                classItem={item}
                role={currentRole}
                thresholdPercent={sheetConfig.lowThresholdPercent || 25}
                isBookedByUser={userBookedClassIds.has(item.id)}
                onEdit={cls => {
                  setSelectedClass(cls);
                  setIsEditModalOpen(true);
                }}
                onDelete={handleDeleteClass}
                onQuickAdjustSeats={handleQuickAdjustSeats}
                onOpenBooking={cls => {
                  setSelectedClass(cls);
                  setIsBookingModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          <ClassTable
            classes={filteredClasses}
            role={currentRole}
            thresholdPercent={sheetConfig.lowThresholdPercent || 25}
            userBookedClassIds={userBookedClassIds}
            onEdit={cls => {
              setSelectedClass(cls);
              setIsEditModalOpen(true);
            }}
            onDelete={handleDeleteClass}
            onQuickAdjustSeats={handleQuickAdjustSeats}
            onOpenBooking={cls => {
              setSelectedClass(cls);
              setIsBookingModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#022419] border-t border-csus-gold/25 py-6 mt-12 text-xs text-emerald-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-csus-gold">ClassPulse</span>
            <span>•</span>
            <span className="text-emerald-100/80">Real-time Google Sheet Synchronized Availability</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-csus-gold animate-pulse" />
              <span className="text-emerald-100/80">30s Refresh Active</span>
            </span>
            <span>•</span>
            <span className="text-orange-400 font-bold">
              Orange Gauge: Available &lt; 25% Capacity
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EditClassModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        classItem={selectedClass}
        thresholdPercent={sheetConfig.lowThresholdPercent || 25}
        onSave={handleSaveClass}
      />

      <AddClassModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        thresholdPercent={sheetConfig.lowThresholdPercent || 25}
        onAdd={handleAddClass}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        classItem={selectedClass}
        googleUser={googleUser}
        thresholdPercent={sheetConfig.lowThresholdPercent || 25}
        onConfirmBooking={handleConfirmBooking}
      />

      <MyBookingsModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        bookings={userBookings}
        classes={classes}
        onCancelBooking={handleCancelBooking}
      />

      <SheetSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        config={sheetConfig}
        accessToken={accessToken}
        onSaveConfig={newCfg => setSheetConfig(prev => ({ ...prev, ...newCfg }))}
        onResetToDemo={() => {
          setClasses(INITIAL_CLASSES);
          setSheetConfig({
            spreadsheetId: '',
            sheetName: 'Class Availability',
            isCustomSheet: false,
            refreshIntervalSeconds: 30,
            lowThresholdPercent: 25,
            status: 'idle',
            lastSyncTime: new Date(),
          });
        }}
        onTriggerSync={() => refreshFromGoogleSheet(true)}
      />

      {/* Confirmation Modal for Google Workspace Mutating Operations */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        details={confirmModal.details}
        confirmLabel={confirmModal.confirmLabel}
        isDestructive={confirmModal.isDestructive}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
