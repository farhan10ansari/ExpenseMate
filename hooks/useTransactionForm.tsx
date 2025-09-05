import { useState } from "react";
import { useNavigation } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import { tryCatch } from "@/lib/try-catch";
import { addExpense } from "@/repositories/ExpenseRepo";
import { addIncome } from "@/repositories/IncomeRepo";
import { ExpenseData } from "@/features/Expense/ExpenseStoreProvider";
import { IncomeData } from "@/features/Income/IncomeStoreProvider";
import { useHaptics } from "@/contexts/HapticsProvider";
import { sortExpenseCategoriesByUsage, sortIncomeSourcesByUsage } from "@/lib/helpers";
import { useSnackbar } from "@/contexts/GlobalSnackbarProvider";

export function useTransactionForm() {
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const { colors } = useAppTheme();
    const { hapticNotify } = useHaptics();
    const { keyboardHeight, setKeyboardHeight } = useKeyboardHeight();

    // Snackbar state
    const [isSnackbarVisible, setSnackbarVisibility] = useState(false);
    const [errorText, setErrorText] = useState('');

    // Global Snackbar
    const { showSnackbar } = useSnackbar()

    const onDismissSnackBar = () => setSnackbarVisibility(false);

    const handleAddExpense = async (expense: ExpenseData) => {
        const { amount, category, description, datetime, paymentMethod } = expense;
        const missingFields = [];

        if (!amount) missingFields.push('amount');
        const actualAmount = parseFloat(amount ? amount : '0');
        if (actualAmount < 1) {
            hapticNotify('warning');
            setErrorText('Minimum amount should be ₹1');
            setSnackbarVisibility(true);
            return;
        }

        if (!category) missingFields.push('category');
        if (!datetime) missingFields.push('datetime');
        if (!amount || !category || !datetime) {
            hapticNotify('warning');
            setErrorText(`Please fill the missing fields i.e. ${missingFields.join(', ')}`);
            setSnackbarVisibility(true);
            return;
        }

        const { data, error } = await tryCatch(addExpense({
            amount: actualAmount,
            dateTime: datetime,
            description: description,
            paymentMethod: paymentMethod,
            category: category,
        }));

        if (error) {
            hapticNotify('error');
            setErrorText('Failed to add expense. Please try again.');
            setSnackbarVisibility(true);
            return;
        }
        hapticNotify('success');
        showSuccessAndNavigate('Expense added successfully', ['expenses']);
        sortExpenseCategoriesByUsage()
    };

    const handleAddIncome = async (income: IncomeData) => {
        const { amount, source, description, dateTime, recurring, receipt, currency } = income;
        const missingFields = [];

        if (!amount) missingFields.push('amount');
        const actualAmount = parseFloat(amount ? amount : '0');
        if (actualAmount < 1) {
            hapticNotify('warning');
            setErrorText('Minimum amount should be ₹1');
            setSnackbarVisibility(true);
            return;
        }

        if (!source) missingFields.push('source');
        if (!dateTime) missingFields.push('date');
        if (!amount || !source || !dateTime) {
            hapticNotify('warning');
            setErrorText(`Please fill the missing fields i.e. ${missingFields.join(', ')}`);
            setSnackbarVisibility(true);
            return;
        }

        const { data, error } = await tryCatch(addIncome({
            amount: actualAmount,
            dateTime: dateTime,
            source: source,
            description: description ?? "",
            recurring: !!recurring,
            receipt: receipt ?? null,
            currency: currency ?? 'INR',
        }));

        if (error) {
            hapticNotify('error');
            setErrorText('Failed to add income. Please try again.');
            setSnackbarVisibility(true);
            return;
        }
        hapticNotify('success');
        showSuccessAndNavigate('Income added successfully', ['incomes']);
        sortIncomeSourcesByUsage()
    };

    const showSuccessAndNavigate = (message: string, queryKeys: string[]) => {
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
        }, 300);



        // Invalidate related queries
        queryKeys.forEach(key => {
            queryClient.invalidateQueries({ queryKey: [key] });
        });
        queryClient.invalidateQueries({ queryKey: ['stats'] });
    };

    return {
        isSnackbarVisible,
        errorText,
        keyboardHeight,
        colors,
        onDismissSnackBar,
        handleAddExpense,
        handleAddIncome,
    };
}
