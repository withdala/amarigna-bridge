export interface EthiopianDate {
  year: number;
  month: number;
  day: number;
}

const ethiopianMonths = [
  { en: "Meskerem", am: "\u1218\u1235\u12a8\u1228\u121d" },
  { en: "Tikimt", am: "\u1325\u1245\u121d\u1275" },
  { en: "Hidar", am: "\u1205\u12f3\u122d" },
  { en: "Tahsas", am: "\u1273\u1205\u1233\u1235" },
  { en: "Tir", am: "\u1325\u122d" },
  { en: "Yekatit", am: "\u12e8\u12ab\u1272\u1275" },
  { en: "Megabit", am: "\u1218\u130b\u1262\u1275" },
  { en: "Miyazya", am: "\u121a\u12eb\u12dd\u12eb" },
  { en: "Ginbot", am: "\u130d\u1295\u1266\u1275" },
  { en: "Sene", am: "\u1230\u1294" },
  { en: "Hamle", am: "\u1210\u121d\u120c" },
  { en: "Nehasse", am: "\u1290\u1210\u1234" },
  { en: "Pagume", am: "\u1333\u1309\u121c" },
];

const ethiopianDays = [
  { en: "Ehud", am: "\u12a5\u1201\u12f5" },
  { en: "Segno", am: "\u1230\u129e" },
  { en: "Maksegno", am: "\u121b\u12ad\u1230\u129e" },
  { en: "Irob", am: "\u1228\u1261\u12d5" },
  { en: "Hamus", am: "\u1210\u1219\u1235" },
  { en: "Arb", am: "\u12a0\u122d\u1265" },
  { en: "Kidame", am: "\u1245\u12f3\u121c" },
];

/**
 * Helper to get GMT+3 date components (East Africa Time)
 */
function getGMT3Components(date: Date) {
  // Offset for GMT+3 in milliseconds
  const GMT3_OFFSET = 3 * 60 * 60 * 1000;
  // Create a new date object representing the time in GMT+3
  const gmt3Date = new Date(date.getTime() + GMT3_OFFSET);
  
  return {
    year: gmt3Date.getUTCFullYear(),
    month: gmt3Date.getUTCMonth() + 1,
    day: gmt3Date.getUTCDate(),
    weekday: gmt3Date.getUTCDay()
  };
}

/**
 * Calculates the Julian Day Number for a Gregorian date.
 */
function gregorianToJdn(year: number, month: number, day: number): number {
  let y = year;
  let m = month;
  if (m <= 2) {
    y--;
    m += 12;
  }
  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524;
}

/**
 * Converts a Gregorian Date to Ethiopian Date
 * Uses the algorithm based on the Ethiopic Epoch (August 29, 8 AD Julian / JDN 1724221)
 * Now adjusted for GMT+3 timezone.
 */
export function toEthiopian(date: Date): EthiopianDate {
  const components = getGMT3Components(date);
  const jdn = gregorianToJdn(components.year, components.month, components.day);
  
  const offset = jdn - 1724221;
  const ethYear = Math.floor((4 * offset + 1463) / 1461);
  const dayOfYear = offset - ((ethYear - 1) * 365 + Math.floor((ethYear - 1) / 4));
  
  const ethMonth = Math.floor(dayOfYear / 30) + 1;
  const ethDay = (dayOfYear % 30) + 1;

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
  const components = getGMT3Components(date);
  const dayIndex = components.weekday; // 0 is Sunday in UTC (and locally after offset)
  return ethiopianDays[dayIndex]?.[language] || "";
}

export function formatEthiopianDate(eth: EthiopianDate, language: 'en' | 'am' = 'en'): string {
  const monthName = getMonthName(eth.month, language);
  if (language === 'am') {
    return `${monthName} ${eth.day} \u1240\u1295 ${eth.year} \u12d3.\u121d`;
  }
  return `${monthName} ${eth.day}, ${eth.year}`;
}