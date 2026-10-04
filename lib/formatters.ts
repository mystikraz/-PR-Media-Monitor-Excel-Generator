import { ReportRow } from './types';

// Convert string to Title Case
export function toTitleCase(str: string): string {
  if (!str) return '';
  const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v[.]?|via)$/i;

  return str
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index !== 0 && smallWords.test(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

// Convert string to Sentence case
export function toSentenceCase(str: string): string {
  if (!str) return '';
  const trimmed = str.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

// Clean multiple spaces and trim
export function cleanWhitespace(str: string): string {
  if (!str) return '';
  return str.replace(/\s+/g, ' ').trim();
}

// Standardize quotation marks and apostrophes (e.g. replace backticks ` with ')
export function cleanQuotes(str: string): string {
  if (!str) return '';
  return str
    .replace(/[`]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'");
}

// Convert integer to Roman numeral (for page numbers like ii, iv, ix)
export function toRomanNumeral(num: number): string {
  if (isNaN(num) || num < 1 || num > 3999) return String(num);
  const lookup: { [key: string]: number } = {
    M: 1000,
    CM: 900,
    D: 500,
    CD: 400,
    C: 100,
    XC: 90,
    L: 50,
    XL: 40,
    X: 10,
    IX: 9,
    V: 5,
    IV: 4,
    I: 1,
  };
  let roman = '';
  for (const i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman.toLowerCase();
}

// Convert Roman numeral to number (e.g. 'ii' -> 2)
export function fromRomanNumeral(romanStr: string): number | null {
  const str = romanStr.trim().toUpperCase();
  const romanMap: { [char: string]: number } = {
    I: 1,
    V: 5,
    X: 10,
    L: 50,
    C: 100,
    D: 500,
    M: 1000,
  };
  let total = 0;
  let prevValue = 0;

  for (let i = str.length - 1; i >= 0; i--) {
    const currentValue = romanMap[str[i]];
    if (!currentValue) return null; // not a roman numeral
    if (currentValue < prevValue) {
      total -= currentValue;
    } else {
      total += currentValue;
    }
    prevValue = currentValue;
  }
  return total > 0 ? total : null;
}

// Normalize known publications
const PUBLICATION_MAP: Record<string, string> = {
  'e-dailyft.lk': 'E-DailyFT.lk',
  'dailyft.lk': 'E-DailyFT.lk',
  'daily ft': 'Daily FT',
  'ft': 'Daily FT',
  'the morning': 'The Morning',
  'morning': 'The Morning',
  'the island': 'The Island',
  'island': 'The Island',
  'daily news': 'Daily News',
  'dailynews': 'Daily News',
  'daily mirror': 'Daily Mirror',
  'dailymirror': 'Daily Mirror',
  'sunday times': 'The Sunday Times',
  'sunday observer': 'Sunday Observer',
  'ceylon today': 'Ceylon Today',
};

export function normalizePublication(pub: string): string {
  if (!pub) return '';
  const key = pub.trim().toLowerCase();
  return PUBLICATION_MAP[key] || toTitleCase(pub);
}

// Normalize known sections
const SECTION_MAP: Record<string, string> = {
  business: 'Business',
  news: 'News',
  entertainment: 'Entertainment',
  'it/telecom': 'IT/Telecom',
  'it': 'IT/Telecom',
  telecom: 'IT/Telecom',
  tech: 'IT/Telecom',
  'issues/opinion': 'Issues/Opinion',
  issues: 'Issues/Opinion',
  opinion: 'Issues/Opinion',
  editorial: 'Editorial',
  'financial review': 'Financial Review',
  finance: 'Financial Review',
  sports: 'Sports',
  features: 'Features',
};

export function normalizeSection(sec: string): string {
  if (!sec) return '';
  const key = sec.trim().toLowerCase();
  return SECTION_MAP[key] || toTitleCase(sec);
}

// Auto-fill down empty subjects from previous non-empty row
export function fillDownSubjects(rows: ReportRow[]): ReportRow[] {
  let currentSubject = '';
  return rows.map((row) => {
    if (row.subject && row.subject.trim()) {
      currentSubject = row.subject.trim();
      return row;
    }
    return {
      ...row,
      subject: currentSubject,
    };
  });
}

// Clear duplicate consecutive subjects (creates the clean PR table continuation look)
export function clearDuplicateSubjects(rows: ReportRow[]): ReportRow[] {
  let lastSubject = '';
  return rows.map((row) => {
    const trimmed = (row.subject || '').trim();
    if (!trimmed) {
      return row;
    }
    if (trimmed === lastSubject) {
      return {
        ...row,
        subject: '',
      };
    }
    lastSubject = trimmed;
    return row;
  });
}

// Re-sequence 'No' from 1 to N
export function renumberRows(rows: ReportRow[]): ReportRow[] {
  return rows.map((row, idx) => ({
    ...row,
    no: idx + 1,
  }));
}

// Smart Parse Raw Clipboard Text (TSV, CSV, or Copied Word/Email Text)
export function parseRawTextToRows(rawText: string): ReportRow[] {
  const lines = rawText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return [];

  const parsed: ReportRow[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if line contains tab delimiter
    let parts: string[] = [];
    if (line.includes('\t')) {
      parts = line.split('\t').map((p) => p.trim());
    } else if (line.includes('|')) {
      parts = line.split('|').map((p) => p.trim()).filter((p, idx, arr) => {
        // filter out markdown boundary pipes
        if ((idx === 0 || idx === arr.length - 1) && p === '') return false;
        return true;
      });
    } else if (line.includes(',')) {
      // simple comma split
      parts = line.split(',').map((p) => p.trim());
    } else {
      // Single line heading
      parts = ['', '', '', '', '', line];
    }

    // Skip header line if it looks like "No, Subject, Publication..."
    if (
      parts.some((p) => /^(no|subject|publication|page|section|heading)/i.test(p)) &&
      parsed.length === 0
    ) {
      continue;
    }

    // If first element is a number
    const firstNum = parseInt(parts[0], 10);
    const hasNum = !isNaN(firstNum) && String(firstNum) === parts[0];

    const no = hasNum ? firstNum : parsed.length + 1;
    const startIndex = hasNum ? 1 : 0;

    const subject = parts[startIndex] || '';
    const publication = parts[startIndex + 1] || '';
    const pageNo = parts[startIndex + 2] || '';
    const section = parts[startIndex + 3] || '';
    const heading = parts.slice(startIndex + 4).join(' ') || parts[parts.length - 1] || '';

    // Check if heading has image file extension
    const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(heading.trim());

    parsed.push({
      id: `imported-${Date.now()}-${i}`,
      no,
      subject: cleanQuotes(subject),
      publication: normalizePublication(publication),
      pageNo,
      section: normalizeSection(section),
      heading: cleanQuotes(heading),
      imageName: isImage ? heading.trim() : undefined,
    });
  }

  return parsed;
}
