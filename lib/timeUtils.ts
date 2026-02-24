import { format } from "date-fns";

export function formatMessageTime(timestamp: number): string {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isThisYear = date.getFullYear() === now.getFullYear();

    if (isToday) return format(date, "h:mm a");               // "2:34 PM"
    if (isThisYear) return format(date, "MMM d, h:mm a");     // "Feb 15, 2:34 PM"
    return format(date, "MMM d yyyy, h:mm a");                // "Feb 15 2023, 2:34 PM"
}
