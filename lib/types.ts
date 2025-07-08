import { IconSource } from "react-native-paper/lib/typescript/components/Icon";

export type Category = {
    name: string;
    label: string;
    icon?: IconSource;
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