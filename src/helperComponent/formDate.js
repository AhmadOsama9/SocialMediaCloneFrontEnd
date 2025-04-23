import { format, parseISO, differenceInMinutes, differenceInHours, differenceInDays, isToday, isYesterday } from "date-fns";

/**
 * Formats a date string into a human-readable, social-style format.
 * @param {string} dateString - The date string to format.
 * @returns {string} - The formatted date.
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";

  try {
    const date = typeof dateString === "string" ? parseISO(dateString) : new Date(dateString);
    const now = new Date();

    const minutesDiff = differenceInMinutes(now, date);
    const hoursDiff = differenceInHours(now, date);
    const daysDiff = differenceInDays(now, date);

    if (minutesDiff < 1) return "Just now";
    if (minutesDiff < 60) return `${minutesDiff} minute${minutesDiff > 1 ? "s" : ""} ago`;
    if (hoursDiff < 24 && isToday(date)) return `${hoursDiff} hour${hoursDiff > 1 ? "s" : ""} ago`;
    if (isYesterday(date)) return `Yesterday at ${format(date, "h:mm a")}`;
    if (isToday(date)) return `Today at ${format(date, "h:mm a")}`;
    if (date.getFullYear() === now.getFullYear()) {
      return format(date, "MMMM d 'at' h:mm a");
    }
    return format(date, "MMMM d, yyyy 'at' h:mm a");
  } catch (error) {
    return dateString;
  }
};
