export type AccountRole = 'admin' | 'user';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: AccountRole;
  avatar?: string;
}

export interface ClassItem {
  id: string;
  rowNumber?: number; // row index in Google Sheet
  code: string;
  name: string;
  category: string;
  instructor: string;
  schedule: string;
  location: string;
  capacity: number;
  availableSeats: number;
  enrolled: number;
  notes?: string;
  updatedAt?: string;
}

export interface UserBooking {
  id: string;
  classId: string;
  className: string;
  studentName: string;
  studentEmail: string;
  bookedAt: string;
}

export interface SheetConfig {
  spreadsheetId: string;
  sheetName: string;
  sheetUrl?: string;
  range?: string;
  isCustomSheet: boolean;
  refreshIntervalSeconds: number; // default 30
  lowThresholdPercent: number; // default 25
  lastSyncTime?: Date;
  status: 'connected' | 'syncing' | 'error' | 'idle';
  errorMessage?: string;
}
