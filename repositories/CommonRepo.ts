import { startOfMonth, endOfMonth, subMonths, format, startOfYear, endOfYear } from 'date-fns';
import { and, eq, gte, lte, lt } from 'drizzle-orm';
import { expensesSchema, incomesSchema } from '@/db/schema';
import db from '@/db/client';

export const getAvailablePeriodsWithData = async (): Promise<{
  months: { primaryLabel: string; secondaryLabel?: string; offset: number; type: 'month' }[];
  years: { primaryLabel: string; secondaryLabel?: string; offset: number; type: 'year' }[];
}> => {
  const now = new Date();
  const availableMonths: { primaryLabel: string; secondaryLabel?: string; offset: number; type: 'month' }[] = [];
  const availableYears: { primaryLabel: string; secondaryLabel?: string; offset: number; type: 'year' }[] = [];

  const hasDataInPeriod = async (start: Date, end: Date) => {
    const [hasExpenses, hasIncomes] = await Promise.all([
      db.select({ id: expensesSchema.id }).from(expensesSchema)
        .where(and(eq(expensesSchema.isTrashed, false), gte(expensesSchema.dateTime, start), lte(expensesSchema.dateTime, end)))
        .limit(1),
      db.select({ id: incomesSchema.id }).from(incomesSchema)
        .where(and(eq(incomesSchema.isTrashed, false), gte(incomesSchema.dateTime, start), lte(incomesSchema.dateTime, end)))
        .limit(1)
    ]);
    return hasExpenses.length > 0 || hasIncomes.length > 0;
  };

  const hasOlderData = async (beforeDate: Date) => {
    const [hasOlderExpenses, hasOlderIncomes] = await Promise.all([
      db.select({ id: expensesSchema.id }).from(expensesSchema)
        .where(and(eq(expensesSchema.isTrashed, false), lt(expensesSchema.dateTime, beforeDate)))
        .limit(1),
      db.select({ id: incomesSchema.id }).from(incomesSchema)
        .where(and(eq(incomesSchema.isTrashed, false), lt(incomesSchema.dateTime, beforeDate)))
        .limit(1)
    ]);
    return hasOlderExpenses.length > 0 || hasOlderIncomes.length > 0;
  };

  // Get available months
  let monthOffset = 0;
  while (true) {
    const targetDate = subMonths(now, monthOffset);
    const monthStart = startOfMonth(targetDate);
    const monthEnd = endOfMonth(targetDate);
    
    const hasData = monthOffset === 0 || await hasDataInPeriod(monthStart, monthEnd);
    
    if (hasData) {
      if (monthOffset === 0) {
        availableMonths.push({
          primaryLabel: "This",
          secondaryLabel: "Month",
          offset: monthOffset,
          type: "month"
        });
      } else {
        availableMonths.push({
          primaryLabel: format(monthStart, 'MMMM'),
          secondaryLabel: format(monthStart, 'yyyy'),
          offset: monthOffset,
          type: "month"
        });
      }
    }

    if (monthOffset > 0 && !await hasOlderData(monthStart)) break;
    monthOffset++;
  }

  // Get available years
  let yearOffset = 0;
  while (true) {
    const targetYear = now.getFullYear() - yearOffset;
    const yearStart = startOfYear(new Date(targetYear, 0, 1));
    const yearEnd = endOfYear(new Date(targetYear, 0, 1));
    
    const hasData = yearOffset === 0 || await hasDataInPeriod(yearStart, yearEnd);
    
    if (hasData) {
      if (yearOffset === 0) {
        availableYears.push({
          primaryLabel: "This",
          secondaryLabel: "Year",
          offset: yearOffset,
          type: "year"
        });
      } else {
        availableYears.push({
          primaryLabel: targetYear.toString(),
          offset: yearOffset,
          type: "year"
        });
      }
    }

    if (yearOffset > 0 && !await hasOlderData(yearStart)) break;
    yearOffset++;
  }

  return { months: availableMonths, years: availableYears };
};
