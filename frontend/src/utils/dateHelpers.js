/**
 * Extract time components (hours, minutes) from an AI suggested posting string
 * e.g., "08:30 AM", "2:15 PM", "02:00 PM (Peak focus)", "7:30 PM"
 * Default fallback: 09:00 AM
 */
export const extractTimeComponents = (suggestedPostingTime) => {
  if (!suggestedPostingTime || typeof suggestedPostingTime !== 'string') {
    return { hours: 9, minutes: 0 };
  }
  const timeMatch = suggestedPostingTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!timeMatch) {
    return { hours: 9, minutes: 0 };
  }
  let hours = parseInt(timeMatch[1], 10);
  const minutes = parseInt(timeMatch[2], 10);
  const period = timeMatch[3] ? timeMatch[3].toUpperCase() : null;
  if (period === 'PM' && hours < 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  return { hours, minutes };
};
/**
 * Helper to parse a time string and apply it to a target base date (defaults to tomorrow)
 */
export const parseSuggestedPostingTime = (suggestedPostingTime, baseDate = null) => {
  const target = baseDate ? new Date(baseDate) : new Date();
  if (!baseDate) {
    target.setDate(target.getDate() + 1);
  }
  const { hours, minutes } = extractTimeComponents(suggestedPostingTime);
  target.setHours(hours, minutes, 0, 0);
  return target;
};
/**
 * Format a Date object to YYYY-MM-DDTHH:mm for datetime-local input
 */
export const formatToDateTimeLocal = (dateObj) => {
  const pad = (num) => String(num).padStart(2, '0');
  const year = dateObj.getFullYear();
  const month = pad(dateObj.getMonth() + 1);
  const day = pad(dateObj.getDate());
  const hours = pad(dateObj.getHours());
  const minutes = pad(dateObj.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};