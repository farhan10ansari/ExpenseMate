import FormSheetHeader from "@/components/main/FormSheetHeader";
import CustomSnackbar from "@/components/ui/CustomSnackbar";
import { useHaptics } from "@/contexts/HapticsProvider";
import ExpenseForm from "@/features/Expense/ExpenseForm";
import { ExpenseData, ExpenseStoreProvider } from "@/features/Expense/ExpenseStoreProvider";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import { tryCatch } from "@/lib/try-catch";
import { Screens } from "@/lib/types";
import { getExpenseById, updateExpenseById } from "@/repositories/ExpenseRepo";
import useAppStore from "@/stores/useAppStore";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditExpenseScreen() {
    const navigation = useNavigation();
    const queryCLient = useQueryClient();
    const { colors } = useAppTheme();
    const { keyboardHeight, setKeyboardHeight } = useKeyboardHeight();
    const { id } = useLocalSearchParams<{ id: string }>();
    const insets = useSafeAreaInsets()
    const { hapticNotify } = useHaptics()

    const { data: expense, isLoading, isError, error } = useQuery({
        queryKey: ['expense', id],
        queryFn: async () => getExpenseById(id),
        enabled: !!id,
        staleTime: Infinity,
    });

    // Snackbar
    const [isSnackbarVisible, setSnackbarVisibility] = useState(false);
    const onDismissSnackBar = () => setSnackbarVisibility(false);
    const [errorText, setErrorText] = useState('');

    // Global Snackbar
    const setGlobalSnackbar = useAppStore((state) => state.setGlobalSnackbar);

    const handleUpdateExpense = async (updated: ExpenseData) => {
        if (!expense) return;

        const { amount, category, description, datetime, paymentMethod } = updated;
        const missingFields = [];
        if (!amount) missingFields.push('amount');
        const actualAmount = parseFloat(amount ? amount : '0');
        if (actualAmount < 1) {
            hapticNotify("warning");
            setErrorText('Minimum amount should be ₹1');
            setSnackbarVisibility(true);
            return;
        }

        if (!category) missingFields.push('category');
        if (!datetime) missingFields.push('datetime');
        if (!amount || !category || !datetime) {
            hapticNotify("warning");
            setErrorText(`Please fill the missing fields: ${missingFields.join(', ')}`);
            setSnackbarVisibility(true);
            return;
        }

        // Check if anything has changed
        const hasChanged =
            expense.amount !== actualAmount ||
            expense.category !== category ||
            expense.description !== description ||
            new Date(expense.dateTime).getTime() !== new Date(datetime).getTime() ||
            expense.paymentMethod !== paymentMethod;

        if (!hasChanged) {
            hapticNotify("warning");
            setErrorText("No changes detected.");
            setSnackbarVisibility(true);
            return;
        }

        const { error } = await tryCatch(
            updateExpenseById(id, {
                amount: actualAmount,
                dateTime: datetime,
                description,
                paymentMethod,
                category,
            })
        );

        if (error) {
            hapticNotify("error");
            setErrorText('Failed to update expense. Please try again.');
            setSnackbarVisibility(true);
            return;
        }
        hapticNotify("success");
        setGlobalSnackbar({
            message: 'Expense updated successfully',
            duration: 2000,
            actionLabel: 'Dismiss',
            actionIcon: 'close',
            type: 'success',
            position: 'top',
            offset: insets.top + 10,
            screens: [Screens.AllExpenses, Screens.ExpenseInfo]
        });

        setKeyboardHeight(0);
        navigation.goBack();
        queryCLient.invalidateQueries({
            queryKey: ['expenses'],
        });
        queryCLient.invalidateQueries({
            queryKey: ['expense', id],
        });
        queryCLient.invalidateQueries({
            queryKey: ['stats', 'expense'],
        });
    };

    const styles = StyleSheet.create({
        snackbar: {
            backgroundColor: colors.error,
        },
    });


    return (
        <ExpenseStoreProvider initialExpense={expense}>
            <FormSheetHeader
                title="Edit Expense"
                onClose={() => navigation.goBack()}
            />
            <ExpenseForm
                showSubmitButton={!isSnackbarVisible}
                onSubmit={handleUpdateExpense}
                type="edit"
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