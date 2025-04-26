import { sqliteTable, integer, real, text } from 'drizzle-orm/sqlite-core';
/**
 * Drizzle ORM schema for the "expenses" table in SQLite.
 * Tracks user expenses with details like amount, timestamp, notes, etc.
 */
export const expensesSchema = sqliteTable('expenses', {
  // Primary key
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  // Expense amount
  amount: real('amount').notNull(),
});
