import db from '@/db/client';
import { expensesSchema } from '@/db/schema';
import { DefaultCategories, paymentMethods } from '@/lib/constants';

/**
 * Seeds the `expenses` table with random dummy data for testing.
 * @param count - Number of dummy expense records to insert
 */
export const seedDummyExpenses = async (count: number): Promise<void> => {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  // Extract exactly the `name` values (lowercase, no spaces) from your constants
  const categoryNames = DefaultCategories.map(({ name }) => name);
  const paymentMethodNames = paymentMethods.map(({ name }) => name);
  console.log("categoryNames", categoryNames);
  console.log("paymentMethodNames", paymentMethodNames);
  const currencies = ['INR', 'USD', 'EUR'];


  const msSpan = now.getTime() - startOfYear.getTime();
  const expenses = Array.from({ length: count }).map(() => {
    // Random date between start of year and now
    const randomTs = startOfYear.getTime() + Math.random() * msSpan;
    const date = new Date(randomTs);

    return {
      amount: parseFloat((Math.random() * 99 + 1).toFixed(2)),
      dateTime: date,
      description: `Test expense ${Math.random().toString(36).substring(2, 8)}`,
      // Use the exact `name` string for category and paymentMethod
      category: categoryNames[Math.floor(Math.random() * categoryNames.length)],
      paymentMethod: paymentMethodNames[Math.floor(Math.random() * paymentMethodNames.length)],
      recurring: Math.random() < 0.2, // ~20% recurring
      receipt: null,
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      isTrashed: false,
    };
  });

  // Bulk insert all generated expenses
  await db.insert(expensesSchema).values(expenses).run();
};
