import { ClassItem } from '../types';

export const DEFAULT_SHEET_RANGE = 'A1:Z100';

// Seed classes designed to showcase availability:
// Notice classes with < 25% seats (e.g. 2/20 = 10%, 4/25 = 16%, 1/12 = 8.3%),
// classes with >= 25% seats, and full classes (0/15 = 0%).
export const INITIAL_CLASSES: ClassItem[] = [
  {
    id: 'cls-1',
    rowNumber: 2,
    code: 'YOG-101',
    name: 'Vinyasa Morning Flow',
    category: 'Wellness & Fitness',
    instructor: 'Elena Rostova',
    schedule: 'Mon / Wed 07:30 AM - 08:30 AM',
    location: 'Studio A - Sunroom',
    capacity: 20,
    availableSeats: 3, // 15% -> ORANGE GAUGE
    enrolled: 17,
    notes: 'Bring your own mat and water bottle.',
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  },
  {
    id: 'cls-2',
    rowNumber: 3,
    code: 'DEV-204',
    name: 'Full-Stack React & Node',
    category: 'Technology',
    instructor: 'Marcus Chen',
    schedule: 'Tue / Thu 06:00 PM - 08:00 PM',
    location: 'Tech Lab 3B',
    capacity: 25,
    availableSeats: 4, // 16% -> ORANGE GAUGE
    enrolled: 21,
    notes: 'Laptop with Node.js LTS installed required.',
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  },
  {
    id: 'cls-3',
    rowNumber: 4,
    code: 'ART-150',
    name: 'Wheel Throwing & Ceramics',
    category: 'Arts & Crafts',
    instructor: 'Sarah Jenkins',
    schedule: 'Saturday 10:00 AM - 01:00 PM',
    location: 'Pottery Barn Workshop',
    capacity: 12,
    availableSeats: 2, // 16.6% -> ORANGE GAUGE
    enrolled: 10,
    notes: 'Clay & apron provided on first session.',
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  },
  {
    id: 'cls-4',
    rowNumber: 5,
    code: 'FIT-310',
    name: 'High Intensity HIIT Core',
    category: 'Wellness & Fitness',
    instructor: 'Derrick Vance',
    schedule: 'Mon / Wed / Fri 12:00 PM - 12:45 PM',
    location: 'Gymnasium Deck',
    capacity: 30,
    availableSeats: 18, // 60% -> GREEN GAUGE
    enrolled: 12,
    notes: 'High energy session, all levels welcome.',
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  },
  {
    id: 'cls-5',
    rowNumber: 6,
    code: 'DS-401',
    name: 'Intro to Data Science & ML',
    category: 'Technology',
    instructor: 'Dr. Priya Sharma',
    schedule: 'Wednesday 05:30 PM - 08:30 PM',
    location: 'Lecture Hall 102',
    capacity: 40,
    availableSeats: 26, // 65% -> GREEN GAUGE
    enrolled: 14,
    notes: 'Python knowledge recommended.',
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  },
  {
    id: 'cls-6',
    rowNumber: 7,
    code: 'PHO-120',
    name: 'Urban Street Photography',
    category: 'Arts & Crafts',
    instructor: 'Julian Morales',
    schedule: 'Sunday 02:00 PM - 05:00 PM',
    location: 'Downtown Arts Pavilion',
    capacity: 16,
    availableSeats: 3, // 18.75% -> ORANGE GAUGE
    enrolled: 13,
    notes: 'Mirrorless or DSLR with 35mm/50mm lens.',
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  },
  {
    id: 'cls-7',
    rowNumber: 8,
    code: 'CUL-205',
    name: 'Artisan Sourdough & Pastry',
    category: 'Culinary',
    instructor: 'Chef Antoine Laurent',
    schedule: 'Friday 06:00 PM - 09:00 PM',
    location: 'Culinary Kitchen 2',
    capacity: 14,
    availableSeats: 1, // 7.1% -> ORANGE GAUGE
    enrolled: 13,
    notes: 'Take home your starter and 2 baked loaves.',
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  },
  {
    id: 'cls-8',
    rowNumber: 9,
    code: 'PIL-102',
    name: 'Reformer Pilates Fundamentals',
    category: 'Wellness & Fitness',
    instructor: 'Chloe Bennett',
    schedule: 'Tuesday 09:00 AM - 10:00 AM',
    location: 'Studio C - Reformers',
    capacity: 10,
    availableSeats: 0, // 0% -> FULL / ORANGE WARNING
    enrolled: 10,
    notes: 'Grip socks mandatory.',
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  },
  {
    id: 'cls-9',
    rowNumber: 10,
    code: 'DES-315',
    name: 'UI/UX Design Systems in Figma',
    category: 'Design',
    instructor: 'Samantha Wu',
    schedule: 'Thursday 06:30 PM - 08:30 PM',
    location: 'Design Studio 4A',
    capacity: 22,
    availableSeats: 15, // 68% -> GREEN GAUGE
    enrolled: 7,
    notes: 'Figma free account setup needed.',
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  },
  {
    id: 'cls-10',
    rowNumber: 11,
    code: 'MUS-108',
    name: 'Acoustic Guitar for Beginners',
    category: 'Music',
    instructor: 'Liam Gallagher',
    schedule: 'Saturday 11:30 AM - 01:00 PM',
    location: 'Acoustic Hall B',
    capacity: 15,
    availableSeats: 2, // 13.3% -> ORANGE GAUGE
    enrolled: 13,
    notes: 'Rental instruments available upon request.',
    updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  },
];

/**
 * Extracts spreadsheet ID from standard Google Sheets URLs or returns the raw ID.
 */
export function extractSpreadsheetId(urlOrId: string): string | null {
  const trimmed = urlOrId.trim();
  if (!trimmed) return null;

  // Check URL pattern: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/...
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }

  // If alphanumeric with dashes/underscores and length > 15, assume raw ID
  if (/^[a-zA-Z0-9-_]{15,}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

/**
 * Formats a sheet range safely in A1 notation, ensuring sheet names (especially those with spaces)
 * are properly wrapped in single quotes:
 * e.g. "Class Availability" + "A1:Z100" -> "'Class Availability'!A1:Z100"
 */
export function formatRangeWithSheetName(sheetName?: string, cellRange = DEFAULT_SHEET_RANGE): string {
  if (!sheetName || sheetName.trim() === '') {
    return cellRange;
  }
  const clean = sheetName.trim();
  // Strip any existing outer single quotes first to normalize
  const unquoted = clean.replace(/^'+|'+$/g, '');
  if (!unquoted) return cellRange;
  return `'${unquoted.replace(/'/g, "''")}'!${cellRange}`;
}

/**
 * Normalizes any A1 range string so that any sheet prefix with spaces or special characters
 * is properly single-quoted before passing to Google Sheets API.
 */
export function normalizeA1Range(range: string): string {
  if (!range.includes('!')) {
    return range;
  }
  const exclamationIdx = range.lastIndexOf('!');
  const sheetPart = range.substring(0, exclamationIdx).trim();
  const cellPart = range.substring(exclamationIdx + 1).trim();

  if (!sheetPart) return cellPart || range;
  const unquoted = sheetPart.replace(/^'+|'+$/g, '');
  return `'${unquoted.replace(/'/g, "''")}'!${cellPart}`;
}

/**
 * Fetch spreadsheet metadata (tabs and title)
 */
export async function getSpreadsheetDetails(spreadsheetId: string, accessToken: string) {
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to fetch spreadsheet details: ${res.status} ${res.statusText}. ${errorText}`);
  }

  const data = await res.json();
  const title = data.properties?.title || 'Google Sheet';
  const sheets: string[] = (data.sheets || []).map((s: { properties?: { title?: string } }) => s.properties?.title || 'Sheet1');

  return { title, sheets };
}

/**
 * Fetch values from a range in Google Sheets
 */
export async function fetchSheetValues(spreadsheetId: string, range: string, accessToken: string): Promise<(string | number)[][]> {
  const normalizedRange = normalizeA1Range(range);
  const encodedRange = encodeURIComponent(normalizedRange);
  let res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    const message = errorJson.error?.message || `${res.status} ${res.statusText}`;

    // If the error is "Unable to parse range", try fallback to active sheet or first sheet title:
    if (message.toLowerCase().includes('unable to parse range') || res.status === 400) {
      try {
        const details = await getSpreadsheetDetails(spreadsheetId, accessToken);
        if (details.sheets && details.sheets.length > 0) {
          const firstSheetTitle = details.sheets[0];
          const cellPart = range.includes('!') ? range.substring(range.lastIndexOf('!') + 1) : DEFAULT_SHEET_RANGE;
          const fallbackRange = formatRangeWithSheetName(firstSheetTitle, cellPart);
          const fallbackRes = await fetch(
            `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(fallbackRange)}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            }
          );
          if (fallbackRes.ok) {
            const fallbackData = await fallbackRes.json();
            return (fallbackData.values || []) as (string | number)[][];
          }
        }
      } catch {
        // Fallback metadata call failed, fall through to throwing
      }
    }

    throw new Error(`Google Sheets API error: ${message}`);
  }

  const data = await res.json();
  return (data.values || []) as (string | number)[][];
}

/**
 * Parse rows into ClassItem array
 */
export function parseSheetRows(rows: (string | number)[][]): ClassItem[] {
  if (!rows || rows.length < 2) return [];

  const headers = rows[0].map(h => String(h || '').trim().toLowerCase());

  // Find column indices
  const findCol = (keywords: string[]) => {
    return headers.findIndex(h => keywords.some(k => h.includes(k)));
  };

  const codeIdx = findCol(['code', 'class code', 'course code', 'id', 'class id']);
  const nameIdx = findCol(['class name', 'course name', 'class', 'name', 'course', 'title', 'subject']);
  const catIdx = findCol(['category', 'type', 'dept', 'department']);
  const instIdx = findCol(['instructor', 'teacher', 'coach', 'trainer', 'speaker', 'faculty']);
  const schedIdx = findCol(['schedule', 'time', 'day', 'days', 'date', 'slot', 'timing']);
  const locIdx = findCol(['location', 'room', 'venue', 'studio', 'building']);
  const capIdx = findCol(['class capacity', 'capacity', 'total capacity', 'total seats', 'max', 'limit', 'max capacity']);
  const availIdx = findCol(['available sheets', 'available sheet', 'available seats', 'available seat', 'available', 'seats left', 'open seats', 'open', 'remaining']);
  const enrollIdx = findCol(['enrolled', 'booked', 'registered', 'current', 'taken']);
  const notesIdx = findCol(['notes', 'desc', 'description', 'info']);

  const classes: ClassItem[] = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0 || row.every(c => c === '' || c === undefined)) {
      continue;
    }

    const name = nameIdx !== -1 ? String(row[nameIdx] || '').trim() : `Class #${r}`;
    if (!name) continue;

    const rawCap = capIdx !== -1 ? parseInt(String(row[capIdx] || '0').replace(/\D/g, ''), 10) : 20;
    const capacity = isNaN(rawCap) || rawCap <= 0 ? 20 : rawCap;

    let available = 0;
    let enrolled = 0;

    if (availIdx !== -1 && row[availIdx] !== undefined && row[availIdx] !== '') {
      const parsedAvail = parseInt(String(row[availIdx]).replace(/\D/g, ''), 10);
      available = isNaN(parsedAvail) ? 0 : Math.min(capacity, Math.max(0, parsedAvail));
      enrolled = enrollIdx !== -1 ? parseInt(String(row[enrollIdx] || '0').replace(/\D/g, ''), 10) : capacity - available;
    } else if (enrollIdx !== -1 && row[enrollIdx] !== undefined) {
      const parsedEnroll = parseInt(String(row[enrollIdx]).replace(/\D/g, ''), 10);
      enrolled = isNaN(parsedEnroll) ? 0 : parsedEnroll;
      available = Math.max(0, capacity - enrolled);
    } else {
      // Default estimation
      available = Math.floor(capacity * 0.5);
      enrolled = capacity - available;
    }

    classes.push({
      id: `row-${r + 1}`,
      rowNumber: r + 1,
      code: codeIdx !== -1 ? String(row[codeIdx] || `C-${r}`) : `CLS-${100 + r}`,
      name,
      category: catIdx !== -1 ? String(row[catIdx] || 'General') : 'General',
      instructor: instIdx !== -1 ? String(row[instIdx] || 'Staff') : 'TBD',
      schedule: schedIdx !== -1 ? String(row[schedIdx] || 'Weekly') : 'TBD',
      location: locIdx !== -1 ? String(row[locIdx] || 'Main Campus') : 'Main Hall',
      capacity,
      availableSeats: available,
      enrolled,
      notes: notesIdx !== -1 ? String(row[notesIdx] || '') : undefined,
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });
  }

  return classes;
}

/**
 * Update an existing class row in Google Sheets
 */
export async function updateSheetRow(
  spreadsheetId: string,
  sheetName: string,
  rowNumber: number,
  classItem: ClassItem,
  accessToken: string
) {
  const range = formatRangeWithSheetName(sheetName, `A${rowNumber}:J${rowNumber}`);
  const values = [
    [
      classItem.code,
      classItem.name,
      classItem.category,
      classItem.instructor,
      classItem.schedule,
      classItem.location,
      classItem.capacity,
      classItem.availableSeats,
      classItem.enrolled,
      classItem.notes || '',
    ],
  ];

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    }
  );

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error?.message || `Failed to update sheet row ${rowNumber}: ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Append a new class row to Google Sheets
 */
export async function appendSheetRow(
  spreadsheetId: string,
  sheetName: string,
  classItem: ClassItem,
  accessToken: string
) {
  const range = formatRangeWithSheetName(sheetName, 'A:J');
  const values = [
    [
      classItem.code,
      classItem.name,
      classItem.category,
      classItem.instructor,
      classItem.schedule,
      classItem.location,
      classItem.capacity,
      classItem.availableSeats,
      classItem.enrolled,
      classItem.notes || '',
    ],
  ];

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    }
  );

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error?.message || `Failed to append class: ${res.statusText}`);
  }

  return await res.json();
}

/**
 * Create a new template spreadsheet directly in user's Google Drive via Sheets API
 */
export async function createTemplateSpreadsheet(accessToken: string) {
  const payload = {
    properties: {
      title: `Class Availability Tracker - ${new Date().toLocaleDateString()}`,
    },
    sheets: [
      {
        properties: {
          title: 'Class Availability',
          gridProperties: {
            frozenRowCount: 1,
          },
        },
        data: [
          {
            startRow: 0,
            startColumn: 0,
            rowData: [
              {
                values: [
                  { userEnteredValue: { stringValue: 'Class Code' } },
                  { userEnteredValue: { stringValue: 'Class Name' } },
                  { userEnteredValue: { stringValue: 'Category' } },
                  { userEnteredValue: { stringValue: 'Instructor' } },
                  { userEnteredValue: { stringValue: 'Schedule' } },
                  { userEnteredValue: { stringValue: 'Location' } },
                  { userEnteredValue: { stringValue: 'Capacity' } },
                  { userEnteredValue: { stringValue: 'Available Seats' } },
                  { userEnteredValue: { stringValue: 'Enrolled' } },
                  { userEnteredValue: { stringValue: 'Notes' } },
                ],
              },
              ...INITIAL_CLASSES.map(cls => ({
                values: [
                  { userEnteredValue: { stringValue: cls.code } },
                  { userEnteredValue: { stringValue: cls.name } },
                  { userEnteredValue: { stringValue: cls.category } },
                  { userEnteredValue: { stringValue: cls.instructor } },
                  { userEnteredValue: { stringValue: cls.schedule } },
                  { userEnteredValue: { stringValue: cls.location } },
                  { userEnteredValue: { numberValue: cls.capacity } },
                  { userEnteredValue: { numberValue: cls.availableSeats } },
                  { userEnteredValue: { numberValue: cls.enrolled } },
                  { userEnteredValue: { stringValue: cls.notes || '' } },
                ],
              })),
            ],
          },
        ],
      },
    ],
  };

  const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorJson = await res.json().catch(() => ({}));
    throw new Error(errorJson.error?.message || `Failed to create template spreadsheet: ${res.statusText}`);
  }

  const data = await res.json();
  return {
    spreadsheetId: data.spreadsheetId as string,
    spreadsheetUrl: data.spreadsheetUrl as string,
    sheetName: 'Class Availability',
  };
}

/**
 * Parses raw copied table text from Google Sheets (TSV or CSV)
 */
export function parseRawClipboardOrCsv(text: string): ClassItem[] {
  const lines = text
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length < 2) {
    throw new Error('Please provide at least a header row and one row of class data.');
  }

  // Detect delimiter: tab or comma or semicolon
  const firstLine = lines[0];
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;

  let delimiter = '\t';
  if (tabCount === 0 && commaCount > tabCount && commaCount >= semiCount) {
    delimiter = ',';
  } else if (tabCount === 0 && semiCount > 0) {
    delimiter = ';';
  }

  const rows = lines.map(line => {
    if (delimiter === ',') {
      // Basic CSV split respecting quotes
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"' && (i === 0 || line[i - 1] !== '\\')) {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      values.push(current.trim().replace(/^"|"$/g, ''));
      return values;
    }
    return line.split(delimiter).map(cell => cell.trim().replace(/^"|"$/g, ''));
  });

  return parseSheetRows(rows);
}

/**
 * Fetch public sheet CSV directly (works without API key/token if sheet is shared as Anyone with link)
 */
export async function fetchPublicSheetCsv(spreadsheetId: string, sheetName?: string): Promise<(string | number)[][]> {
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv${sheetName ? `&sheet=${encodeURIComponent(sheetName)}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load public sheet (${res.status} ${res.statusText}).`);
  }
  const csvText = await res.text();
  const lines = csvText.split(/\r?\n/).filter(l => l.trim().length > 0);
  return lines.map(line => {
    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    return parts.map(p => p.trim().replace(/^"|"$/g, ''));
  });
}

