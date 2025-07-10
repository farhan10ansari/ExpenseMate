import db from '@/db/client';
import { Expense, expensesSchema } from '@/db/schema';
import { and, desc, eq, gte, sql } from 'drizzle-orm';
import { getStartDate } from './lib/helpers';
import { InsightPeriod, PeriodExpenseStats } from '@/lib/types';

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
const PAGE_SIZE = 10;
export const getExpensesPaginated = async ({
  page = 0,
  pageSize = PAGE_SIZE
}: {
  page: number,
  pageSize: number
}): Promise<{ expenses: Expense[]; hasMore: boolean; page: number }> => {
  const offset = page * pageSize;

  // Fetch expenses that are not trashed
  const results = await db
    .select()
    .from(expensesSchema)
    .where(eq(expensesSchema.isTrashed, false))
    .orderBy(desc(expensesSchema.dateTime))
    .limit(pageSize)
    .offset(offset);

  // Check if more non-trashed items exist beyond the current page
  const checkMore = await db
    .select()
    .from(expensesSchema)
    .where(eq(expensesSchema.isTrashed, false))
    .orderBy(desc(expensesSchema.dateTime))
    .limit(1) // fetch 1 more to detect hasMore
    .offset(offset + pageSize); // check if there's more than the current page

  const hasMore = checkMore && checkMore.length > 0;

  return {
    expenses: results,
    hasMore,
    page: page
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
