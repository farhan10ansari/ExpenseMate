import { useNavigation } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import { tryCatch } from "@/lib/try-catch";
import { addExpense, updateExpenseById } from "@/repositories/ExpenseRepo";
import { addIncome, updateIncomeById } from "@/repositories/IncomeRepo";
import { ExpenseData } from "@/features/Expense/ExpenseStoreProvider";
import { IncomeData } from "@/features/Income/IncomeStoreProvider";
import { useHaptics } from "@/contexts/HapticsProvider";
// import { sortExpenseCategoriesByUsage, sortIncomeSourcesByUsage } from "@/lib/helpers";
import { useSnackbar } from "@/contexts/GlobalSnackbarProvider";
import { validateExpenseData, validateIncomeData } from "@/lib/validations";
import { Expense, Income } from "@/db/schema";

export function useTransactionForm() {
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const { colors } = useAppTheme();
    const { hapticNotify } = useHaptics();
    const { keyboardHeight, setKeyboardHeight } = useKeyboardHeight();
    const { showSnackbar } = useSnackbar();

    const showErrorSnackbar = (message: string) => {
        showSnackbar({
            message,
            duration: 3000,
            type: 'error',
            position: 'bottom',
            offset: keyboardHeight,
        });
    };

    const showSuccessAndNavigate = (message: string, queryKeys: string[], delay = 300) => {
        hapticNotify('success');
        setKeyboardHeight(0);
        navigation.goBack();
        showSnackbar({
            message,
            duration: 2000,
            actionLabel: 'Dismiss',
            actionIcon: 'close',
            type: 'success',
            position: 'bottom',
            offset: 70,
        }, delay);

        // Invalidate related queries
        queryKeys.forEach(key => {
            queryClient.invalidateQueries({ queryKey: [key] });
        });
        queryClient.invalidateQueries({ queryKey: ['stats'] });
    };

    // Check if expense data has changed
    const hasExpenseChanged = (existing: Expense, updated: ExpenseData): boolean => {
        const actualAmount = parseFloat(updated.amount || '0');
        return (
            existing.amount !== actualAmount ||
            existing.category !== updated.category ||
            existing.description !== updated.description ||
            new Date(existing.dateTime).getTime() !== new Date(updated.datetime!).getTime() ||
            existing.paymentMethod !== updated.paymentMethod
        );
    };

    // Check if income data has changed
    const hasIncomeChanged = (existing: Income, updated: IncomeData): boolean => {
        const actualAmount = parseFloat(updated.amount || '0');
        return (
            existing.amount !== actualAmount ||
            existing.source !== updated.source ||
            existing.description !== updated.description ||
            new Date(existing.dateTime).getTime() !== new Date(updated.dateTime!).getTime() ||
            (existing.recurring ?? false) !== (updated.recurring ?? false) ||
            (existing.receipt ?? null) !== (updated.receipt ?? null) ||
            (existing.currency ?? "INR") !== (updated.currency ?? "INR")
        );
    };

    const handleAddExpense = async (expense: ExpenseData) => {
        const validation = validateExpenseData(expense);
        if (!validation.isValid) {
            hapticNotify('warning');
            showErrorSnackbar(validation.errorMessage!);
            return;
        }

        const { amount, category, description, datetime, paymentMethod } = expense;
        const actualAmount = parseFloat(amount!);

        const { data, error } = await tryCatch(addExpense({
            amount: actualAmount,
            dateTime: datetime!,
            description: description,
            paymentMethod: paymentMethod,
            category: category!,
        }));

        if (error) {
            hapticNotify('error');
            showErrorSnackbar('Failed to add expense. Please try again.');
            return;
        }

        showSuccessAndNavigate('Expense added', ['expenses']);
        // sortExpenseCategoriesByUsage();
    };

    const handleAddIncome = async (income: IncomeData) => {
        const validation = validateIncomeData(income);
        if (!validation.isValid) {
            hapticNotify('warning');
            showErrorSnackbar(validation.errorMessage!);
            return;
        }

        const { amount, source, description, dateTime, recurring, receipt, currency } = income;
        const actualAmount = parseFloat(amount!);

        const { data, error } = await tryCatch(addIncome({
            amount: actualAmount,
            dateTime: dateTime!,
            source: source!,
            description: description ?? "",
            recurring: !!recurring,
            receipt: receipt ?? null,
            currency: currency ?? 'INR',
        }));

        if (error) {
            hapticNotify('error');
            showErrorSnackbar('Failed to add income. Please try again.');
            return;
        }

        showSuccessAndNavigate('Income added', ['incomes']);
        // sortIncomeSourcesByUsage();
    };

    const handleUpdateExpense = async (id: string, existingExpense: Expense, updatedExpense: ExpenseData) => {
        const validation = validateExpenseData(updatedExpense);
        if (!validation.isValid) {
            hapticNotify('warning');
            showErrorSnackbar(validation.errorMessage!);
            return;
        }

        if (!hasExpenseChanged(existingExpense, updatedExpense)) {
            hapticNotify('warning');
            showErrorSnackbar('No changes detected.');
            return;
        }

        const { amount, category, description, datetime, paymentMethod } = updatedExpense;
        const actualAmount = parseFloat(amount!);

        const { error } = await tryCatch(updateExpenseById(id, {
            amount: actualAmount,
            dateTime: datetime!,
            description,
            paymentMethod,
            category: category!,
        }));

        if (error) {
            hapticNotify('error');
            showErrorSnackbar('Failed to update expense. Please try again.');
            return;
        }

        showSuccessAndNavigate('Expense updated', ['expenses', `expense-${id}`, 'stats']);
    };

    const handleUpdateIncome = async (id: string, existingIncome: Income, updatedIncome: IncomeData) => {
        const validation = validateIncomeData(updatedIncome);
        if (!validation.isValid) {
            hapticNotify('warning');
            showErrorSnackbar(validation.errorMessage!);
            return;
        }

        if (!hasIncomeChanged(existingIncome, updatedIncome)) {
            hapticNotify('warning');
            showErrorSnackbar('No changes detected.');
            return;
        }

        const { amount, source, description, dateTime, recurring, receipt, currency } = updatedIncome;
        const actualAmount = parseFloat(amount!);

        const { error } = await tryCatch(updateIncomeById(id, {
            amount: actualAmount,
            dateTime: dateTime!,
            source: source!,
            description: description ?? null,
            recurring: !!recurring,
            receipt: receipt ?? null,
            currency: currency ?? "INR",
        }));

        if (error) {
            hapticNotify('error');
            showErrorSnackbar('Failed to update income. Please try again.');
            return;
        }

        showSuccessAndNavigate('Income updated', ['incomes', `income-${id}`, 'stats']);
    };

    return {
        keyboardHeight,
        colors,
        handleAddExpense,
        handleAddIncome,
        handleUpdateExpense,
        handleUpdateIncome,
    };
}
