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

export function getName(inputString: string) {
    // Trim the string to remove leading and trailing spaces
    const trimmedString = inputString.trim();

    // Replace multiple spaces with a single space
    const singleSpacedString = trimmedString.replace(/\s+/g, ' ');

    // Convert to lowercase and replace spaces with hyphens
    const name = singleSpacedString.toLowerCase().replace(/\s/g, '-');

    return name;
}

export function getLabel(inputString: string) {
    // Trim the string to remove leading and trailing spaces
    const trimmedString = inputString.trim();

    // Replace multiple spaces with a single space
    const singleSpacedString = trimmedString.replace(/\s+/g, ' ');

    // Capitalize the first letter
    const label = singleSpacedString.length > 0
        ? singleSpacedString.charAt(0).toUpperCase() + singleSpacedString.slice(1)
        : '';

    return label;
}