import db from '@/db/client';              // Or your correct import style
import { Income, incomesSchema } from '@/db/schema';
import { and, desc, eq, gte, lt, lte, sql } from 'drizzle-orm';
import { subMonths, startOfMonth, endOfMonth, format, differenceInCalendarMonths } from 'date-fns';
import { InsightPeriod } from '@/lib/types';
import { getStartDate } from './lib/helpers';
import { getExpenseStatsByPeriod } from './ExpenseRepo';

export interface NewIncome {
  amount: number;
  dateTime: Date | string;      // Accept Date or ms-timestamp
  description?: string | null;
  recurring?: boolean;
  receipt?: string | null;
  currency?: string;            // e.g., 'INR', 'USD'
  source: string;               // Should match your list of sources
}


export const addIncome = async (income: NewIncome) => {
  // Drizzle expects a Date for timestamp columns
  const dt: Date = income.dateTime instanceof Date
    ? income.dateTime
    : new Date(income.dateTime);

  const res = await db
    .insert(incomesSchema)
    .values({
      amount: income.amount,
      dateTime: dt,
      description: income.description ?? null,
      source: income.source,
      recurring: income.recurring ?? false,
      receipt: income.receipt ?? null,
      currency: income.currency ?? 'INR', // Default to INR if not provided
    })
    .run();
  return res;
};


// Get paginated incomes
export const getIncomesByMonthPaginated = async ({
  offsetMonth = 0,
}: {
  offsetMonth: number;
}): Promise<{
  incomes: Income[];
  hasMore: boolean;
  offsetMonth: number;
  month: string;
}> => {
  const now = new Date();
  const requestedTarget = subMonths(now, offsetMonth);
  const requestedStart = startOfMonth(requestedTarget);
  const requestedEnd = endOfMonth(requestedTarget);

  // 1) Fetch only that month's incomes
  const incomes = await db
    .select()
    .from(incomesSchema)
    .where(
      and(
        eq(incomesSchema.isTrashed, false),
        gte(incomesSchema.dateTime, requestedStart),
        lte(incomesSchema.dateTime, requestedEnd),
      )
    )
    .orderBy(desc(incomesSchema.dateTime));

  // 2) Compute hasMore by seeing if any record is older than this month's start
  const olderAny = await db
    .select({ id: incomesSchema.id })
    .from(incomesSchema)
    .where(
      and(
        eq(incomesSchema.isTrashed, false),
        lt(incomesSchema.dateTime, requestedStart),
      )
    )
    .limit(1);

  return {
    incomes,
    hasMore: olderAny.length > 0,
    offsetMonth, // always return the requested offset
    month: format(requestedStart, 'MMMM yyyy'),
  };
};


// Get a single income by ID
export const getIncomeById = async (id: string | number): Promise<Income | undefined> => {
  const numericId = Number(id); // Convert string to number
  if (isNaN(numericId)) {
    throw new Error('Invalid ID format. ID must be a number.');
  }

  const result = await db
    .select()
    .from(incomesSchema)
    .where(eq(incomesSchema.id, numericId))
    .limit(1)
    .execute();

  if (!result || result.length === 0) {
    throw new Error(`Income with ID ${id} not found.`);
  }

  return result[0] as Income;
};


// Soft-delete an income by setting isTrashed: true
export const softDeleteIncomeById = async (id: string | number): Promise<void> => {
  const numericId = Number(id); // Convert string to number
  if (isNaN(numericId)) {
    throw new Error('Invalid ID format. ID must be a number.');
  }

  const result = await db
    .update(incomesSchema)
    .set({ isTrashed: true })
    .where(eq(incomesSchema.id, numericId))
    .run();

  if (result.changes === 0) {
    throw new Error(`Income with ID ${id} not found or already deleted.`);
  }
}


export const updateIncomeById = async (
  id: string | number,
  income: NewIncome
): Promise<void> => {
  const numericId = Number(id); // Convert string to number
  if (isNaN(numericId)) {
    throw new Error('Invalid ID format. ID must be a number.');
  }

  const dt: Date = income.dateTime instanceof Date
    ? income.dateTime
    : new Date(income.dateTime);

  const result = await db
    .update(incomesSchema)
    .set({
      amount: income.amount,
      dateTime: dt,
      description: income.description,
      recurring: income.recurring,
      receipt: income.receipt,
      currency: income.currency,
      source: income.source,
    })
    .where(eq(incomesSchema.id, numericId))
    .run();

  if (result.changes === 0) {
    throw new Error(`Income with ID ${id} not found or no changes made.`);
  }
};


// // repositories/IncomeRepo.ts (or add to existing file)
// import { and, desc, eq, gte, sql } from 'drizzle-orm';
// import { db } from '@/db/db';
// import { incomesSchema } from '@/db/schema';
// import { InsightPeriod } from '@/types/insights'; // assuming you have this type

export interface PeriodIncomeStats {
  period: InsightPeriod;
  total: number;
  count: number;
  avgPerDay: number;
  max: number;
  min: number;
  sources: {
    source: string;
    total: number;
    count: number;
  }[];
  topSource: string | null;
}

export const getIncomeStatsByPeriod = async (
  period: InsightPeriod
): Promise<PeriodIncomeStats> => {
  // 1. period start & days elapsed (inclusive)
  const startDate = getStartDate(period);
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const days =
    Math.floor((now.getTime() - startDate.getTime()) / msPerDay) + 1;

  // 2. fetch total, count, max, min in one query
  const [row] = await db
    .select({
      total: sql<number>`SUM(${incomesSchema.amount})`,
      count: sql<number>`COUNT(*)`,
      max: sql<number>`MAX(${incomesSchema.amount})`,
      min: sql<number>`MIN(${incomesSchema.amount})`,
    })
    .from(incomesSchema)
    .where(
      and(
        eq(incomesSchema.isTrashed, false),
        gte(incomesSchema.dateTime, startDate)
      )
    )
    .limit(1);

  const total = row?.total ?? 0;
  const count = row?.count ?? 0;
  const maxAmount = row?.max ?? 0;
  const minAmount = row?.min ?? 0;

  // 3. fetch source breakdown (sum + count)
  const sources = await db
    .select({
      source: incomesSchema.source,
      total: sql<number>`SUM(${incomesSchema.amount})`,
      count: sql<number>`COUNT(*)`
    })
    .from(incomesSchema)
    .where(
      and(
        eq(incomesSchema.isTrashed, false),
        gte(incomesSchema.dateTime, startDate)
      )
    )
    .groupBy(incomesSchema.source)
    .orderBy(desc(sql<number>`SUM(${incomesSchema.amount})`)); // sort by total descending

  // 4. compute avg/day and round
  const rawAvg = days > 0 ? total / days : 0;
  const avgPerDay = parseFloat(rawAvg.toFixed(2));

  // 5. get top source
  const topSource = sources.length > 0 ? sources[0].source : null;

  // console.log("total", total);
  return {
    period,
    total: parseFloat(total.toFixed(2)),
    count,
    avgPerDay,
    max: maxAmount,
    min: minAmount,
    sources,
    topSource,
  };
};