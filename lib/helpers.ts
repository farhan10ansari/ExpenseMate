import { Category, PeriodExpenseStats, PeriodIncomeStats } from "./types";

export interface FinancialSummary {
    netIncome: number;
    savingsRate: number; // percentage
    // incomeExpenseRatio: number;
}

export const getFinancialSummary = (
    expenseStats: PeriodExpenseStats,
    incomeStats: PeriodIncomeStats
): FinancialSummary => {
    const netIncome = parseFloat((incomeStats.total - expenseStats.total).toFixed(2));
    const savingsRate = incomeStats.total > expenseStats.total
        ? parseFloat(((netIncome / incomeStats.total) * 100).toFixed(2))
        : 0;
    // const incomeExpenseRatio = expenseStats.total > 0
    //     ? parseFloat((incomeStats.total / expenseStats.total).toFixed(2))
    //     : incomeStats.total > 0 ? Infinity : 1;

    return {
        netIncome,
        savingsRate,
        // incomeExpenseRatio,
    };
};

export const getCategoryRows = (categories: Category[]): { rows: Category[][], noOfRows: number } => {
    const rows: Category[][] = [[], []];

    if (categories.length < 5) {
        categories.forEach((category) => {
            rows[0].push(category);
        });
        return { rows, noOfRows: 1 }
    }

    categories.forEach((category, index) => {
        rows[index % 2].push(category);
    });

    return { rows, noOfRows: 2 }
};

