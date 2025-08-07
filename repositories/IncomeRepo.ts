import db from '@/db/client';              // Or your correct import style
import { Income, incomesSchema } from '@/db/schema';
import { and, desc, eq, gte, lt, lte } from 'drizzle-orm';
import { subMonths, startOfMonth, endOfMonth, format, differenceInCalendarMonths } from 'date-fns';

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
