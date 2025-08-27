import { expenseCategoriesSchema, ExpenseCategory, IncomeSource, incomeSourcesSchema } from '@/db/schema';
import { DefaultExpenseCategories, DefaultIncomeSources } from '@/lib/constants';
import db from '@/db/client';
import { eq } from 'drizzle-orm';

export const seedDefaultExpenseCategoriesData = async (): Promise<void> => {
    try {
        // Insert expense categories
        await db
            .insert(expenseCategoriesSchema)
            .values(
                DefaultExpenseCategories.map(category => ({
                    ...category,
                    enabled: true,
                    deletable: false,
                }))
            )
            .onConflictDoNothing();

        console.log('Default categories seeded successfully');
    } catch (error) {
        console.error('Error seeding default category data:', error);
        throw error;
    }
};

export const seedDefaultIncomeSourcesData = async (): Promise<void> => {
    try {
        // Insert income sources
        await db
            .insert(incomeSourcesSchema)
            .values(
                DefaultIncomeSources.map(source => ({
                    ...source,
                    enabled: true,
                    deletable: false,
                }))
            )
            .onConflictDoNothing();
        console.log('Default income sources seeded successfully');
    } catch (error) {
        console.error('Error seeding default income sources:', error);
        throw error;
    }
};



export const getAllExpenseCategories = async (
    includeDisabled: boolean = false
): Promise<ExpenseCategory[]> => {
    try {
        if (includeDisabled) {
            return await db.select().from(expenseCategoriesSchema);
        }

        return await db
            .select()
            .from(expenseCategoriesSchema)
            .where(eq(expenseCategoriesSchema.enabled, true));
    } catch (error) {
        console.error('Error fetching expense categories:', error);
        throw error;
    }
};

export const getAllIncomeSources = async (
    includeDisabled: boolean = false
): Promise<IncomeSource[]> => {
    try {
        if (includeDisabled) {
            return await db.select().from(incomeSourcesSchema);
        }

        return await db
            .select()
            .from(incomeSourcesSchema)
            .where(eq(incomeSourcesSchema.enabled, true));
    } catch (error) {
        console.error('Error fetching income sources:', error);
        throw error;
    }
};
