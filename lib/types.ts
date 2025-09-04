import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

export type Category = {
  name: string;
  label: string;
  icon: IconSource;
  color: string;
  enabled: boolean;
  type: "default" | "custom"
};

export type CategoryFormData = {
  title: string;
  icon?: IconSource | null;
  color?: string | null;
  type: Category["type"]
}

export type CreateCategoryData = Omit<Category, "enabled" | "type">;
export type UpdateCategoryData = Partial<Omit<Category, "name" | "type">>;


export type IconWithColor = {
  icon: IconSource;
  color: string;
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
 * Supported period keys for filtering stats.
 */
export type PeriodType = "today" | "week" | "month" | "year";

export type StatsPeriod = {
  type: PeriodType;
  offset?: number; // offset from current period, 0 = current, 1 = previous, etc.
};

export type StatsPeriodOption = {
  primaryLabel: string;
  secondaryLabel?: string;
  type: PeriodType;
  offset?: number;
};

export interface ExpenseCategoryStat {
  category: string;
  total: number;
  count: number;
}

export interface PeriodExpenseStats {
  period: StatsPeriod;
  total: number;        // total spend in the period
  avgPerDay: number;    // average spend per calendar day (2 d.p.)
  count: number;        // total number of transactions in the period
  max: number;          // largest single transaction
  min: number;          // smallest single transaction
  categories: ExpenseCategoryStat[]; // breakdown by category (sum + count)
  topCategory: string | null; // category with the highest total spend
}

export interface IncomeSourceStat {
  source: string;
  total: number;
  count: number;
}

export interface PeriodIncomeStats {
  period: StatsPeriod;
  total: number;
  count: number;
  avgPerDay: number;
  max: number;
  min: number;
  sources: IncomeSourceStat[];
  topSource: string | null;
}


export enum Screens {
  Home = "Home",
  AllExpenses = "AllExpenses",
  AllIncomes = "AllIncomes",
  ExpenseInfo = "ExpenseInfo",
  IncomeInfo = "IncomeInfo",
  EditExpense = "EditExpense",
  EditIncome = "EditIncome",
  NewTransaction = "NewTransaction",
  Menu = "Menu",
  Settings = "Settings",
  Themes = "Themes",
  DevOptions = "DevOptions",
  About = "About",
}

export type ColorType = "primary" | "secondary" | "tertiary";