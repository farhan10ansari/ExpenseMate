//Get a label for the date: "Today", "Yesterday", or a formatted date string
export function extractDateLabel(date: Date): string {
    const now = new Date();

    // Strip time from date (set hours, minutes, etc. to 0)
    const stripTime = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

    const today = stripTime(now);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const inputDate = stripTime(date);

    if (inputDate.getTime() === today.getTime()) {
        return "Today";
    } else if (inputDate.getTime() === yesterday.getTime()) {
        return "Yesterday";
    } else {
        // Format like "Apr 5, 2024"
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    }
}


export function extractTimeString(date: Date, is24HourClock: boolean): string {
    return new Intl.DateTimeFormat(undefined, {
        hour: 'numeric',
        minute: '2-digit',
        hour12: !is24HourClock // force 12h if false, otherwise 24h
    }).format(date);
}