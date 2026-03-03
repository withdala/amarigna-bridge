export interface EthiopianDate {
  year: number;
  month: number;
  day: number;
}

const ethiopianMonths = [
  { en: "Meskerem", am: "መስከረም" },
  { en: "Tikimt", am: "ጥቅምት" },
  { en: "Hidar", am: "ህዳር" },
  { en: "Tahsas", am: "ታህሳስ" },
  { en: "Tir", am: "ጥር" },
  { en: "Yekatit", am: "የካቲት" },
  { en: "Megabit", am: "መጋቢት" },
  { en: "Miyazya", am: "ሚያዝያ" },
  { en: "Ginbot", am: "ግንቦት" },
  { en: "Sene", am: "ሰኔ" },
  { en: "Hamle", am: "ሐምሌ" },
  { en: "Nehasse", am: "ነሐሴ" },
  { en: "Pagume", am: "ጳጉሜ" },
];

const ethiopianDays = [
  { en: "Ehud", am: "እሁድ" },
  { en: "Segno", am: "ሰኞ" },
  { en: "Maksegno", am: "ማክሰኞ" },
  { en: "Irob", am: "ረቡዕ" },
  { en: "Hamus", am: "ሐሙስ" },
  { en: "Arb", am: "አርብ" },
  { en: "Kidame", am: "ቅዳሜ" },
];

/**
 * Converts a Gregorian Date to Ethiopian Date
 */
export function toEthiopian(date: Date): EthiopianDate {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Offset logic
  // Ethiopian New Year usually falls on Sept 11 (or 12)
  // Let's use the formula:
  // JDN (Julian Day Number) calculation
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // JDN to Ethiopian
  const r = (jdn - 1724221) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  
  const ethYear = 4 * Math.floor((jdn - 1724221) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  const ethMonth = Math.floor(n / 30) + 1;
  const ethDay = (n % 30) + 1;

  return {
    year: ethYear,
    month: ethMonth,
    day: ethDay
  };
}

export function getMonthName(month: number, language: 'en' | 'am' = 'en'): string {
  return ethiopianMonths[month - 1]?.[language] || "";
}

export function getDayName(date: Date, language: 'en' | 'am' = 'en'): string {
  const dayIndex = date.getDay(); // 0 is Sunday
  return ethiopianDays[dayIndex]?.[language] || "";
}

export function formatEthiopianDate(eth: EthiopianDate, language: 'en' | 'am' = 'en'): string {
  const monthName = getMonthName(eth.month, language);
  if (language === 'am') {
    return `${monthName} ${eth.day} ቀን ${eth.year} ዓ.ም`;
  }
  return `${monthName} ${eth.day}, ${eth.year}`;
}