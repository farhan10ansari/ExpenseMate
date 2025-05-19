import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
/**
 * Drizzle ORM schema for the "expenses" table in SQLite.
 * Tracks user expenses with details like amount, timestamp, notes, etc.
 */

export const expensesSchema  = sqliteTable('expenses', {
  // Primary key
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),

  // Expense amount
  amount: real('amount').notNull(),

  // Date and time of the transaction
  dateTime: integer('date_time', { mode: 'timestamp' }).notNull(),

  // Optional description or notes
  description: text('description').$type<string | null>(),

  // Payment method (e.g., Cash, Credit Card, UPI, etc.)
  paymentMethod: text('payment_method').$type<string | null>(),

  // Category of the expense (e.g., Food, Travel, etc.)
  category: text('category').notNull(),

  // Recurring expense flag
  recurring: integer('recurring', { mode: 'boolean' }).notNull().default(false),

  // Optional receipt or invoice path/URL
  receipt: text('receipt').$type<string | null>(),

  // Currency code (e.g., INR, USD)
  currency: text('currency').notNull().default('INR'),
});
