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

export const getCategoryRows = (categories: Category[]) => {
  const rows = [];
  const numberOfRows = 2; // Number of categories per row
  const rowSize = Math.ceil(categories.length / numberOfRows);
  for (let i = 0; i < categories.length; i += rowSize) {
    rows.push(categories.slice(i, i + rowSize));
  }
  return rows;
}
