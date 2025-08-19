import { StatsPeriod } from "@/lib/types";
import { 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear,
  subWeeks,
  subMonths,
  subYears
} from 'date-fns';

/**
 * Get the starting and ending dates for a given period with offset support.
 * Returns both start and end dates for the specified period.
 */
export function getPeriodStartEnd(period: StatsPeriod): { start: Date; end: Date } {
    const now = new Date();
    const offset = period.offset || 0;
    
    switch (period.type) {
        case "today": {
            // Today ignores offset - always current day
            const start = startOfDay(now);
            const end = endOfDay(now);
            return { start, end };
        }
        
        case "week": {
            // Calculate the target week by subtracting offset weeks
            const targetDate = subWeeks(now, offset);
            const start = startOfWeek(targetDate, { weekStartsOn: 1 }); // Monday start
            const end = endOfWeek(targetDate, { weekStartsOn: 1 });
            return { start, end };
        }
        
        case "month": {
            // Calculate the target month by subtracting offset months
            const targetDate = subMonths(now, offset);
            const start = startOfMonth(targetDate);
            const end = endOfMonth(targetDate);
            return { start, end };
        }
        
        case "year": {
            // Calculate the target year by subtracting offset years
            const targetDate = subYears(now, offset);
            const start = startOfYear(targetDate);
            const end = endOfYear(targetDate);
            return { start, end };
        }
        
        default:
            throw new Error(`Unsupported period type: ${period.type}`);
    }
}
