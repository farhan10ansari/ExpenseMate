import db from '@/db/client';              // Or your correct import style
import { incomesSchema } from '@/db/schema';

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
