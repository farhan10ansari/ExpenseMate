import db from '@/db/client';
import { IncomeDB, IncomeRes, incomesSchema } from '@/db/schema';
import { and, asc, desc, eq, gte, lt, lte, sql } from 'drizzle-orm';
import { subMonths, startOfMonth, endOfMonth, format } from 'date-fns';
import { StatsPeriod, PeriodIncomeStats } from '@/lib/types';
import { getPeriodStartEnd } from './lib/helpers';

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
  incomes: IncomeRes[];
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
export const getIncomeById = async (id: string | number): Promise<IncomeRes | undefined> => {
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

  return result[0];
};


// Delete an income by setting isTrashed: true
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

// Delete all expense for a given source
export const softDeleteIncomesBySource = async (source: string): Promise<void> => {
  await db
    .update(incomesSchema)
    .set({ isTrashed: true })
    .where(eq(incomesSchema.source, source))
    .run();
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



export const getIncomeStatsByPeriod = async (
  period: StatsPeriod
): Promise<PeriodIncomeStats> => {
  // 1. Get period start & end dates, calculate days in period
  const { start, end } = getPeriodStartEnd(period);
  const msPerDay = 1000 * 60 * 60 * 24;

  let startDate = start
  let endDate = end

  if (!startDate) {
    const [earliest] = await db
      .select({
        dateTime: incomesSchema.dateTime
      })
      .from(incomesSchema)
      .where(eq(incomesSchema.isTrashed, false))
      .orderBy(asc(incomesSchema.dateTime))
      .limit(1);

    //earliest can be undefined if no income exist
    startDate = earliest?.dateTime
  }

  if (!endDate) {
    const [latest] = await db
      .select({
        dateTime: incomesSchema.dateTime
      })
      .from(incomesSchema)
      .where(eq(incomesSchema.isTrashed, false))
      .orderBy(desc(incomesSchema.dateTime))
      .limit(1);

    //latest can be undefined if no income exist
    endDate = latest?.dateTime
  }

  // 2. Build the where condition conditionally
  const whereConditions = [eq(incomesSchema.isTrashed, false)];
  if (startDate) whereConditions.push(gte(incomesSchema.dateTime, startDate));
  if (endDate) whereConditions.push(lte(incomesSchema.dateTime, endDate));

  // Calculate the total days in the period (inclusive)
  let days: number;
  if (startDate && endDate) {
    days = Math.floor((endDate.getTime() - startDate.getTime()) / msPerDay) + 1;
  } else {
    days = 0
  }

  // 2. Fetch total, count, max, min in one query using both start and end dates
  const [row] = await db
    .select({
      total: sql<number>`SUM(${incomesSchema.amount})`,
      count: sql<number>`COUNT(*)`,
      max: sql<number>`MAX(${incomesSchema.amount})`,
      min: sql<number>`MIN(${incomesSchema.amount})`,
    })
    .from(incomesSchema)
    .where(and(...whereConditions))
    .limit(1);

  const total = row?.total ?? 0;
  const count = row?.count ?? 0;
  const maxAmount = row?.max ?? 0;
  const minAmount = row?.min ?? 0;

  // 3. Fetch source breakdown (sum + count) for the specific period
  const sources = await db
    .select({
      source: incomesSchema.source,
      total: sql<number>`SUM(${incomesSchema.amount})`,
      count: sql<number>`COUNT(*)`
    })
    .from(incomesSchema)
    .where(and(...whereConditions))
    .groupBy(incomesSchema.source)
    .orderBy(desc(sql<number>`SUM(${incomesSchema.amount})`)); // sort by total descending

  // 4. Compute avg/day and round
  const rawAvg = days > 0 ? total / days : 0;
  const avgPerDay = parseFloat(rawAvg.toFixed(2));

  // 5. Get top source
  const topSource = sources.length > 0 ? sources[0].source : null;

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


// Get all income sources with their occurrence counts as key-value object for sorting the sources based on usage
export const getIncomeSourcesWithCountsKV = async (): Promise<Record<string, number>> => {
  const sources = await db
    .select({
      source: incomesSchema.source,
      count: sql<number>`COUNT(*)`
    })
    .from(incomesSchema)
    .where(eq(incomesSchema.isTrashed, false))
    .groupBy(incomesSchema.source)
    .orderBy(desc(sql<number>`COUNT(*)`)); // Most used sources first

  // Convert array to key-value object
  const result: Record<string, number> = {};
  sources.forEach(row => {
    result[row.source] = row.count;
  });

  return result;
};