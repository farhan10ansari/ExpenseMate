import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';


/**
 * Drizzle ORM schema for the "expenses" table in SQLite.
 * Tracks user expenses with details like amount, timestamp, description, etc.
 */
export const expensesSchema = sqliteTable('expenses', {
  // Primary key
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }).notNull(),

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

  // Trash flag to mark expenses as deleted without removing them
  isTrashed: integer('is_trashed', { mode: 'boolean' }).notNull().default(false),
});

export type Expense = InferInsertModel<typeof expensesSchema>;


/**
* Drizzle ORM schema for the "incomes" table in SQLite.
* Tracks user incomes with details like amount, timestamp, description, etc.
*/
export const incomesSchema = sqliteTable('incomes', {
  // Primary key
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }).notNull(),
  // Income amount
  amount: real('amount').notNull(),
  // Date and time of the transaction
  dateTime: integer('date_time', { mode: 'timestamp' }).notNull(),
  // Optional description or notes
  description: text('description').$type<string | null>(),
  // Source of income (e.g., Salary, Business, etc.)
  source: text('source').notNull(),
  // Payment method (e.g., Cash, Bank Transfer, etc.)
  recurring: integer('recurring', { mode: 'boolean' }).notNull().default(false),
  // Receipt or invoice path/URL
  receipt: text('receipt').$type<string | null>(),
  // Currency code (e.g., INR, USD)
  currency: text('currency').notNull().default('INR'),
  // Trash flag to mark incomes as deleted without removing them
  isTrashed: integer('is_trashed', { mode: 'boolean' }).notNull().default(false),
});

export type Income = InferInsertModel<typeof incomesSchema>;



/**
 * Schema for all categories
 */
export const categoriesSchema = sqliteTable('categories', {
  name: text('name').notNull(),
  label: text('label').notNull(),
  icon: text('icon').notNull(),
  color: text('color').notNull(),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  isCustom: integer('isCustom', { mode: 'boolean' }).notNull().default(true),
  type: text('type').$type<'expense-category' | 'income-source'>().notNull(),
}, (table) => ([
  primaryKey({ columns: [table.name, table.type] })
]))

export type CategoryDB = InferInsertModel<typeof categoriesSchema>;
export type CategoryRes = InferSelectModel<typeof categoriesSchema>;
