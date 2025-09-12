import db from '@/db/client';
import { ExpenseDB, ExpenseRes, expensesSchema } from '@/db/schema';
import { and, desc, eq, gte, sql, lte, lt, asc } from 'drizzle-orm';
import { getPeriodStartEnd } from './lib/helpers';
import { StatsPeriod, PeriodExpenseStats } from '@/lib/types';
import { startOfMonth, endOfMonth, subMonths, format, differenceInMonths } from 'date-fns';

type CreateExpenseData = Omit<ExpenseDB, 'id' | 'isTrashed'>;
type UpdateExpenseData = Omit<ExpenseDB, 'id' | 'isTrashed'>;

//Add a new expense to the database
export const addExpense = async (expense: CreateExpenseData) => {
  // Drizzle expects a Date for timestamp columns
  const dt: Date = expense.dateTime instanceof Date
    ? expense.dateTime
    : new Date(expense.dateTime);

  const res = await db
    .insert(expensesSchema)
    .values({
      amount: expense.amount,
      dateTime: dt,
      description: expense.description ?? null,
      paymentMethod: expense.paymentMethod,
      category: expense.category,
      recurring: expense.recurring ?? false,
      receipt: expense.receipt ?? null,
      currency: expense.currency || 'INR', // default to INR if not provided
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
  expenses: ExpenseRes[];
  hasMore: boolean;
  offsetMonth: number;
  month: string;
}> => {
  const now = new Date();
  // 1) Compute the requested month’s start/end
  const requestedTarget = subMonths(now, offsetMonth);
  const requestedStart = startOfMonth(requestedTarget);
  const requestedEnd = endOfMonth(requestedTarget);

  // 2) Fetch that month's expenses
  const expenses = await db
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

  // 3) Compute hasMore: do we have any records older than this month's start?
  const olderAny = await db
    .select({ id: expensesSchema.id })
    .from(expensesSchema)
    .where(
      and(
        eq(expensesSchema.isTrashed, false),
        lt(expensesSchema.dateTime, requestedStart),
      )
    )
    .limit(1);

  return {
    expenses,
    hasMore: olderAny.length > 0,
    offsetMonth, // unchanged
    month: format(requestedStart, 'MMMM yyyy'),
  };
};

// Get list of months having expenses
export const getAvailableExpenseMonths = async (): Promise<{
  offsetMonth: number;
  month: string;
  count: number;
}[]> => {
  const now = new Date();
  const availableMonths: { offsetMonth: number; month: string; count: number }[] = [];
  let currentOffset = 0;

  while (true) {
    // 1) Compute the current month's start/end
    const requestedTarget = subMonths(now, currentOffset);
    const requestedStart = startOfMonth(requestedTarget);
    const requestedEnd = endOfMonth(requestedTarget);

    // 2) Check if this month has expenses
    const monthExpenses = await db
      .select({ id: expensesSchema.id })
      .from(expensesSchema)
      .where(
        and(
          eq(expensesSchema.isTrashed, false),
          gte(expensesSchema.dateTime, requestedStart),
          lte(expensesSchema.dateTime, requestedEnd),
        )
      );

    // 3) If month has expenses, add it to available months
    if (monthExpenses.length > 0) {
      availableMonths.push({
        offsetMonth: currentOffset,
        month: format(requestedStart, 'MMMM yyyy'),
        count: monthExpenses.length,
      });
    }

    // 4) Check if there are more months with data
    const olderAny = await db
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

    // 5) If no more data, break
    if (olderAny.length === 0) {
      break;
    }

    // 6) Update offset to the month of the next older expense
    const nextOlderDate = olderAny[0].dt;
    currentOffset = differenceInMonths(now, startOfMonth(nextOlderDate));
  }

  // Sort by offset (newest first)
  return availableMonths.sort((a, b) => a.offsetMonth - b.offsetMonth);
};




// Get a single expense by ID
export const getExpenseById = async (id: string | number): Promise<ExpenseRes> => {
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

  return result[0] as ExpenseRes;
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

// Delete all expense for a given category
export const softDeleteExpensesByCategory = async (category: string): Promise<void> => {
  await db
    .update(expensesSchema)
    .set({ isTrashed: true })
    .where(eq(expensesSchema.category, category))
    .run();
}

export const updateExpenseById = async (id: string | number, expense: UpdateExpenseData): Promise<void> => {
  const numericId = Number(id); // Convert string to number
  if (isNaN(numericId)) {
    throw new Error('Invalid ID format. ID must be a number.');
  }

  const dt: Date = expense.dateTime instanceof Date
    ? expense.dateTime
    : new Date(expense.dateTime);

  try {
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
  } catch (err) {
    console.error("Error updating expense:", err);
  }


}

// Insights 
export const getExpenseStatsByPeriod = async (
  period: StatsPeriod
): Promise<PeriodExpenseStats> => {
  // 1. Get period start & end dates, calculate days in period
  const { start, end } = getPeriodStartEnd(period);
  const msPerDay = 1000 * 60 * 60 * 24;
  let startDate = start
  let endDate = end

  if (!startDate) {
    const [earliest] = await db
      .select({
        dateTime: expensesSchema.dateTime
      })
      .from(expensesSchema)
      .where(eq(expensesSchema.isTrashed, false))
      .orderBy(asc(expensesSchema.dateTime))
      .limit(1);

    //earliest can be undefined if no expense exist
    startDate = earliest?.dateTime
  }

  if (!endDate) {
    const [latest] = await db
      .select({
        dateTime: expensesSchema.dateTime
      })
      .from(expensesSchema)
      .where(eq(expensesSchema.isTrashed, false))
      .orderBy(desc(expensesSchema.dateTime))
      .limit(1);

    //latest can be undefined if no expense exist
    endDate = latest?.dateTime
  }


  // 2. Build the where condition conditionally
  const whereConditions = [eq(expensesSchema.isTrashed, false)];
  if (startDate) whereConditions.push(gte(expensesSchema.dateTime, startDate));
  if (endDate) whereConditions.push(lte(expensesSchema.dateTime, endDate));

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
      total: sql<number>`SUM(${expensesSchema.amount})`,
      count: sql<number>`COUNT(*)`,
      max: sql<number>`MAX(${expensesSchema.amount})`,
      min: sql<number>`MIN(${expensesSchema.amount})`,
    })
    .from(expensesSchema)
    .where(and(...whereConditions))
    .limit(1);

  const total = row.total ?? 0;
  const count = row.count ?? 0;
  const maxAmount = row.max ?? 0;
  const minAmount = row.min ?? 0;

  // 3. Fetch category breakdown (sum + count) for the specific period
  const categories = await db
    .select({
      category: expensesSchema.category,
      total: sql<number>`SUM(${expensesSchema.amount})`,
      count: sql<number>`COUNT(*)`
    })
    .from(expensesSchema)
    .where(and(...whereConditions))
    .groupBy(expensesSchema.category)
    .orderBy(desc(sql<number>`SUM(${expensesSchema.amount})`)) // sort by total descending

  // 4. Compute avg/day and round
  const rawAvg = days > 0 ? total / days : 0;
  const avgPerDay = parseFloat(rawAvg.toFixed(2));

  // 5. Get top category
  const topCategory = categories.length > 0 ? categories[0].category : null;

  return {
    period,
    total: parseFloat(total.toFixed(2)), // format total to 2 decimal places
    count,
    avgPerDay,
    max: maxAmount,
    min: minAmount,
    categories,
    topCategory,
  };
};

// Get all categories with their occurrence counts as a key-value object for sorting the categories based on usage
export const getCategoriesWithCountsKV = async (): Promise<Record<string, number>> => {
  const categories = await db
    .select({
      category: expensesSchema.category,
      count: sql<number>`COUNT(*)`
    })
    .from(expensesSchema)
    .where(eq(expensesSchema.isTrashed, false))
    .groupBy(expensesSchema.category)
    .orderBy(desc(sql<number>`COUNT(*)`)); // Most used categories first

  // Convert array to key-value object
  const result: Record<string, number> = {};
  categories.forEach(row => {
    result[row.category] = row.count;
  });

  return result;
};
