import db from '@/db/client';
import { Expense, expensesSchema } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

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