import db from '@/db/client';
import { expensesSchema } from '@/db/schema';

export interface NewExpense {
    amount: number;
    dateTime: Date | string;      // accept Date or ms-timestamp
    description?: string | null;
    paymentMethod: string;
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
            currency: expense.currency || 'INR',
        })
        .run();
    return res;
};

export const getExpenses = async (limit: number = 10): Promise<NewExpense[]> => {
    const expenses = await db
        .select()
        .from(expensesSchema)
        .orderBy(expensesSchema.dateTime)
        .limit(limit)
        .all();

    return expenses.map(expense => ({
        ...expense,
        dateTime: new Date(expense.dateTime),
    }));
};