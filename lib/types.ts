import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

export type Category = {
    name: string;
    label: string;
    icon?: IconSource;
    color?: string; // Optional color for the category
}

export type PaymentMethod = {
    name: "upi" | "cash" | "bank-transfer" | "credit-card" | "other";
    label: string;
    icon: IconSource;
}

export type RootStackParamList = {
    ExpenseInfoScreen: { id: string };
}

/**
 * Supported period keys for filtering total expenses.
 */
export type InsightPeriod = "today" | "this-week" | "this-month" | "this-year";

export interface CategoryStat {
  category: string;
  total: number;
  count: number;
}

export interface PeriodExpenseStats {
  period: InsightPeriod;
  total: number;        // total spend in the period
  avgPerDay: number;    // average spend per calendar day (2 d.p.)
  count: number;        // total number of transactions in the period
  max: number;          // largest single transaction
  min: number;          // smallest single transaction
  categories: CategoryStat[]; // breakdown by category (sum + count)
}

export enum Screens {
    Home = "Home",
    AllExpenses = "AllExpenses",
    NewExpense = "NewExpense",
    Income = "Income", // Example for income screen
    ExpenseInfo = "ExpenseInfo",
    Settings = "Settings",
    EditExpense = "EditExpense",
}