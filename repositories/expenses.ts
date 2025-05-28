import db from '@/db/client';
import { Expense, expensesSchema } from '@/db/schema';
import { desc } from 'drizzle-orm';

export interface NewExpense {
  amount: number;
  dateTime: Date | string;      // accept Date or ms-timestamp
  description?: string | null;
  paymentMethod?: string;
  category: string;
  recurring?: boolean;
  receipt?: string | null;
  currency?: string;
}

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

export const getExpenses = async (limit: number = 10): Promise<Expense[]> => {
  const expenses = await db
    .select()
    .from(expensesSchema)
    .orderBy(expensesSchema.dateTime)
    .limit(limit)
    .all();

  return expenses
};

// repositories/expenses.ts



const PAGE_SIZE = 10;

export const getExpensesPaginated = async ({
  page = 0,
  pageSize = PAGE_SIZE
}: {
  page: number,
  pageSize: number
}

): Promise<{ expenses: Expense[]; hasMore: boolean; page: number }> => {
  const offset = page * pageSize;
  // Fetch one extra item to determine if more data exists
  const results = await db
    .select()
    .from(expensesSchema)
    .orderBy(desc(expensesSchema.dateTime))
    .limit(pageSize) // fetch 1 more to detect hasMore
    .offset(offset);

  const checkMore = await db
    .select()
    .from(expensesSchema)
    .orderBy(desc(expensesSchema.dateTime))
    .limit(1) // fetch 1 more to detect hasMore
    .offset(offset + pageSize); // check if there's more than the current page


  const total = await db
    .select()
    .from(expensesSchema)

  console.log("Total expenses:", total);


  const hasMore = checkMore && checkMore?.length > 0;
  console.log("Check more results:", checkMore);

  //delay(1000); // Simulate network delay for testing

  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve({
  //       expenses: results,
  //       hasMore,
  //       page: page
  //     }); 
  //   }
  //   , 5000); // Simulate network delay for testing
  // });

  return {
    expenses: results,
    hasMore,
    page: page
  };
};