/**
 * Formats Date to YYYY-MM-DD for record indexing
 */
export const getTodayDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Returns a human-friendly formatted date string (e.g., Saturday, 24 Oct 2026)
 */
export const formatDisplayDate = (dateStr: string): string => {
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

/**
 * Formats current time or given Date into readable 12-hour format: 09:30:15 AM
 */
export const getCurrentTimeString = (d: Date = new Date()): string => {
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

/**
 * Short time format (e.g. 09:30 AM)
 */
export const formatShortTime = (timeStr: string | null): string => {
  if (!timeStr) return '--:--';
  // If it's already HH:MM AM/PM or HH:MM:SS AM/PM
  return timeStr;
};

/**
 * Calculate working hours between check-in and check-out
 */
export const calculateWorkDuration = (
  checkIn: string | null,
  checkOut: string | null
): string => {
  if (!checkIn || !checkOut) return '--';
  try {
    const today = getTodayDateString();
    const inDate = new Date(`${today} ${checkIn}`);
    const outDate = new Date(`${today} ${checkOut}`);
    const diffMs = outDate.getTime() - inDate.getTime();
    if (isNaN(diffMs) || diffMs < 0) return '--';
    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  } catch {
    return '--';
  }
};

/**
 * Generates an array of past N dates in YYYY-MM-DD format
 */
export const getRecentDateStrings = (days: number = 7): string[] => {
  const dates: string[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(getTodayDateString(d));
  }
  return dates;
};

/**
 * Returns contextual time-of-day greeting with appropriate emoji and optional name
 */
export const getTimeGreeting = (name?: string): { greeting: string; phrase: string; emoji: string } => {
  const hour = new Date().getHours();
  let phrase = 'Good day';
  let emoji = '👋';

  if (hour >= 5 && hour < 12) {
    phrase = 'Good morning';
    emoji = '☀️';
  } else if (hour >= 12 && hour < 17) {
    phrase = 'Good afternoon';
    emoji = '🌤️';
  } else if (hour >= 17 && hour < 22) {
    phrase = 'Good evening';
    emoji = '🌆';
  } else {
    phrase = 'Good evening';
    emoji = '🌙';
  }

  const firstName = name ? name.split(' ')[0] : '';
  const greeting = firstName ? `${phrase}, ${firstName}` : phrase;

  return { greeting, phrase, emoji };
};
