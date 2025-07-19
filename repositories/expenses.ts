import db from '@/db/client';
import { Expense, expensesSchema } from '@/db/schema';
import { and, desc, eq, gte, sql, lte, lt } from 'drizzle-orm';
import { getStartDate } from './lib/helpers';
import { InsightPeriod, PeriodExpenseStats } from '@/lib/types';
import { startOfMonth, endOfMonth, subMonths, format, differenceInCalendarMonths } from 'date-fns';

export interface NewExpense {
  amount: number;
  dateTime: Date | string;      // accept Date or ms-timestamp
  description?: string | null;
  paymentMethod?: string | null;
  category: string;
  recurring?: boolean;
  receipt?: string | null;
  currency?: string;
}

//Add a new expense to the database
export const addExpense = async (expense: NewExpense) => {
  // Drizzle expects a Date for timestamp columns
  const dt: Date = expense.dateTime instanceof Date
    ? expense.dateTime
    : new Date(expense.dateTime);

  const res = await db
    .insert(expensesSchema)
    .values({
      amount: expense.amount,
      dateTime: dt,
      description: expense.description,
      paymentMethod: expense.paymentMethod,
      category: expense.category,
      recurring: expense.recurring,
      receipt: expense.receipt,
      currency: expense.currency,
    })
    .run();
  return res;
};

// Get paginated expenses
export const getExpensesByMonthPaginated = async ({
  offsetMonth = 0,
}: {
  offsetMonth: number;
}): Promise<{
  expenses: Expense[];
  hasMore: boolean;
  offsetMonth: number;
  month: string;
}> => {
  const now = new Date();
  // 1) Compute the requested month’s start/end
  const requestedTarget = subMonths(now, offsetMonth);
  const requestedStart = startOfMonth(requestedTarget);
  const requestedEnd   = endOfMonth(requestedTarget);

  // 2) Try fetching that month
  let expenses = await db
    .select()
    .from(expensesSchema)
    .where(
      and(
        eq(expensesSchema.isTrashed, false),
        gte(expensesSchema.dateTime, requestedStart),
        lte(expensesSchema.dateTime, requestedEnd),
      )
    )
    .orderBy(desc(expensesSchema.dateTime));

  let actualOffset = offsetMonth;
  let actualStart  = requestedStart;

  if (expenses.length === 0) {
    // ───────────────────────────────────────────────────────────────────────
    // Empty requested month → look for any older expense
    // ───────────────────────────────────────────────────────────────────────
    const olderRec = await db
      .select({ dt: expensesSchema.dateTime })
      .from(expensesSchema)
      .where(
        and(
          eq(expensesSchema.isTrashed, false),
          lt(expensesSchema.dateTime, requestedStart),
        )
      )
      .orderBy(desc(expensesSchema.dateTime))
      .limit(1);

    if (olderRec.length === 0) {
      // no data older than this month either → we’re done
      return {
        expenses: [],
        hasMore: false,
        offsetMonth,
        month: format(requestedStart, 'MMMM yyyy'),
      };
    }

    // ───────────────────────────────────────────────────────────────────────
    // Found an "older" expense → figure out its month
    // ───────────────────────────────────────────────────────────────────────
    const firstOlderDate: Date = olderRec[0].dt;
    // how many calendar months between now and that date?
    actualOffset = differenceInCalendarMonths(
      startOfMonth(now),
      startOfMonth(firstOlderDate)
    );
    // recompute the start/end for that month
    const actualTarget = subMonths(now, actualOffset);
    actualStart = startOfMonth(actualTarget);
    const actualEnd = endOfMonth(actualTarget);

    // fetch expenses for the *new* month
    expenses = await db
      .select()
      .from(expensesSchema)
      .where(
        and(
          eq(expensesSchema.isTrashed, false),
          gte(expensesSchema.dateTime, actualStart),
          lte(expensesSchema.dateTime, actualEnd),
        )
      )
      .orderBy(desc(expensesSchema.dateTime));
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Finally, compute hasMore by checking anything older than actualStart
  // ─────────────────────────────────────────────────────────────────────────
  const olderAny = await db
    .select()
    .from(expensesSchema)
    .where(
      and(
        eq(expensesSchema.isTrashed, false),
        lt(expensesSchema.dateTime, actualStart),
      )
    )
    .limit(1);

  return {
    expenses,
    hasMore: olderAny.length > 0,
    offsetMonth: actualOffset,
    month: format(actualStart, 'MMMM yyyy'),
  };
};


// Get a single expense by ID
export const getExpenseById = async (id: string | number): Promise<Expense | undefined> => {
  const numericId = Number(id); // Convert string to number
  if (isNaN(numericId)) {
    throw new Error('Invalid ID format. ID must be a number.');
  }

  const result = await db
    .select()
    .from(expensesSchema)
    .where(eq(expensesSchema.id, numericId))
    .limit(1)
    .execute();

  if (!result || result.length === 0) {
    throw new Error(`Expense with ID ${id} not found.`);
  }

  return result[0] as Expense;
}

// Delete an expense by ID
export const softDeleteExpenseById = async (id: string | number): Promise<void> => {
  const numericId = Number(id); // Convert string to number
  if (isNaN(numericId)) {
    throw new Error('Invalid ID format. ID must be a number.');
  }

  // mark as trashed instead of deleting
  const result = await db
    .update(expensesSchema)
    .set({ isTrashed: true })
    .where(eq(expensesSchema.id, numericId))
    .run();

  if (result.changes === 0) {
    throw new Error(`Expense with ID ${id} not found or already deleted.`);
  }
}

export const updateExpenseById = async (id: string | number, expense: NewExpense): Promise<void> => {
  const numericId = Number(id); // Convert string to number
  if (isNaN(numericId)) {
    throw new Error('Invalid ID format. ID must be a number.');
  }

  const dt: Date = expense.dateTime instanceof Date
    ? expense.dateTime
    : new Date(expense.dateTime);

  const result = await db
    .update(expensesSchema)
    .set({
      amount: expense.amount,
      dateTime: dt,
      description: expense.description,
      paymentMethod: expense.paymentMethod,
      category: expense.category,
      recurring: expense.recurring,
      receipt: expense.receipt,
      currency: expense.currency,
    })
    .where(eq(expensesSchema.id, numericId))
    .run();

  if (result.changes === 0) {
    throw new Error(`Expense with ID ${id} not found or no changes made.`);
  }
}

// Insights 
export const getExpenseStatsByPeriod = async (
  period: InsightPeriod
): Promise<PeriodExpenseStats> => {
  // 1. period start & days elapsed (inclusive)
  const startDate = getStartDate(period);
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const days =
    Math.floor((now.getTime() - startDate.getTime()) / msPerDay) + 1;

  // 2. fetch total, count, max, min in one query
  const [{
    total = 0,
    count = 0,
    max: maxAmount = 0,
    min: minAmount = 0
  }] = await db
    .select({
      total: sql<number>`SUM(${expensesSchema.amount})`,
      count: sql<number>`COUNT(*)`,
      max: sql<number>`MAX(${expensesSchema.amount})`,
      min: sql<number>`MIN(${expensesSchema.amount})`,
    })
    .from(expensesSchema)
    .where(
      and(
        eq(expensesSchema.isTrashed, false),
        gte(expensesSchema.dateTime, startDate)
      )
    )
    .limit(1);

  // 3. fetch category breakdown (sum + count)
  const categories = await db
    .select({
      category: expensesSchema.category,
      total: sql<number>`SUM(${expensesSchema.amount})`,
      count: sql<number>`COUNT(*)`
    })
    .from(expensesSchema)
    .where(
      and(
        eq(expensesSchema.isTrashed, false),
        gte(expensesSchema.dateTime, startDate)
      )
    )
    .groupBy(expensesSchema.category);

  // 4. compute avg/day and round
  const rawAvg = days > 0 ? total / days : 0;
  const avgPerDay = parseFloat(rawAvg.toFixed(2));

  return {
    period,
    total: parseFloat(total.toFixed(2)), // format total to 2 decimal places
    count,
    avgPerDay,
    max: maxAmount,
    min: minAmount,
    categories,
  };
};
