import CustomSnackbar from "@/components/ui/CustomSnackbar";
import SheetGrabber from "@/components/ui/SheetGrabber";
import ExpenseForm from "@/features/Expense/ExpenseForm";
import { ExpenseData, ExpenseStoreProvider } from "@/features/Expense/ExpenseStoreProvider";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import { tryCatch } from "@/lib/try-catch";
import { Screens } from "@/lib/types";
import { addExpense } from "@/repositories/expenses";
import useAppStore from "@/stores/useAppStore";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";

export default function NewExpenseScreen() {
    const navigation = useNavigation();
    const queryCLient = useQueryClient();
    const { colors } = useAppTheme();
    const { keyboardHeight, setKeyboardHeight } = useKeyboardHeight();

    // Snackbar
    const [isSnackbarVisible, setSnackbarVisibility] = useState(false);
    const onDismissSnackBar = () => setSnackbarVisibility(false);
    const [errorText, setErrorText] = useState('');

    // Global Snackbar
    const setGlobalSnackbar = useAppStore((state) => state.setGlobalSnackbar);

    const handleAddExpense = async (expense: ExpenseData) => {
        const { amount, category, description, datetime, paymentMethod } = expense;
        const missingFields = [];
        if (!amount) missingFields.push('amount');
        const actualAmount = parseFloat(amount ? amount : '0');
        if (actualAmount < 1) {
            setErrorText('Minimum amount should be ₹1');
            setSnackbarVisibility(true);
            return;
        }

        if (!category) missingFields.push('category');
        if (!datetime) missingFields.push('datetime');
        if (!amount || !category || !datetime) {
            setErrorText(`Please fill the missing fields i.e. ${missingFields.join(', ')}`);
            setSnackbarVisibility(true)
            return;
        }

        const { data, error } = await tryCatch(addExpense({
            amount: actualAmount,
            dateTime: datetime,
            description: description,
            paymentMethod: paymentMethod,
            category: category,
        }))

        if (error) {
            setErrorText('Failed to add expense. Please try again.');
            setSnackbarVisibility(true)
            return;
        }

        // Show snackbar
        setGlobalSnackbar({
            message: 'Expense added successfully',
            duration: 2000,
            actionLabel: 'Dismiss',
            actionIcon: 'close',
            type: 'success',
            position: 'bottom',
            offset: 80,
            screens: [Screens.Home, Screens.AllExpenses, Screens.Income, Screens.Settings],
        });

        setKeyboardHeight(0);
        // Navigate back to the previous screen
        navigation.goBack();
        // Invalidate the query to refetch expenses
        queryCLient.invalidateQueries({
            queryKey: ['expenses'],
        });
        queryCLient.invalidateQueries({
            queryKey: ['insights'],
        });
    }

    const styles = StyleSheet.create({
        snackbar: {
            backgroundColor: colors.error,
        },
    });


    return (
        <ExpenseStoreProvider>
            <SheetGrabber />
            <ExpenseForm
                showSubmitButton={!isSnackbarVisible}
                onSubmit={handleAddExpense}
            />
            {/* Error Snackbar */}
            <CustomSnackbar
                usePortal
                visible={isSnackbarVisible}
                onDismiss={onDismissSnackBar}
                duration={2000}
                style={styles.snackbar}
                action={{
                    label: 'Dismiss',
                    icon: 'close',
                }}
                type='error'
                position='bottom'
                offset={keyboardHeight}
            >
                {errorText}
            </CustomSnackbar>
        </ExpenseStoreProvider>
    );
}