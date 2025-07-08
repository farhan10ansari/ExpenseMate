import { InsightPeriod } from "@/lib/types";

/**
 * Get the starting date for a given period.
 */
export function getStartDate(period: InsightPeriod): Date {
    const now = new Date();
    switch (period) {
        case "today": {
            return new Date(now.getFullYear(), now.getMonth(), now.getDate());
        }
        case "this-week": {
            const day = now.getDay(); // Sunday: 0
            const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday start
            return new Date(now.getFullYear(), now.getMonth(), diff);
        }
        case "this-month": {
            return new Date(now.getFullYear(), now.getMonth(), 1);
        }
        case "this-year": {
            return new Date(now.getFullYear(), 0, 1);
        }
        default:
            throw new Error(`Unsupported period type: ${period}`);
    }
}