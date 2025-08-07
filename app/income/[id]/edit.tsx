import FormSheetHeader from "@/components/main/FormSheetHeader";
import CustomSnackbar from "@/components/ui/CustomSnackbar";
import IncomeForm from "@/features/Income/IncomeForm";
import { IncomeData, IncomeStoreProvider } from "@/features/Income/IncomeStoreProvider";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import { tryCatch } from "@/lib/try-catch";
import { Screens } from "@/lib/types";
import { getIncomeById, updateIncomeById } from "@/repositories/IncomeRepo";
import useAppStore from "@/stores/useAppStore";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditIncomeScreen() {
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const { colors } = useAppTheme();
    const { keyboardHeight, setKeyboardHeight } = useKeyboardHeight();
    const { id } = useLocalSearchParams<{ id: string }>();
    const insets = useSafeAreaInsets();

    const { data: income, isLoading, isError, error } = useQuery({
        queryKey: ['income', id],
        queryFn: async () => getIncomeById(id),
        enabled: !!id,
        staleTime: Infinity,
    });

    // Snackbar
    const [isSnackbarVisible, setSnackbarVisibility] = useState(false);
    const onDismissSnackBar = () => setSnackbarVisibility(false);
    const [errorText, setErrorText] = useState('');

    // Global Snackbar
    const setGlobalSnackbar = useAppStore((state) => state.setGlobalSnackbar);

    const handleUpdateIncome = async (updated: IncomeData) => {
        if (!income) return;

        const { amount, source, description, dateTime, recurring, receipt, currency } = updated;
        const missingFields = [];
        if (!amount) missingFields.push('amount');
        const actualAmount = parseFloat(amount ? amount : '0');
        if (actualAmount < 1) {
            setErrorText('Minimum amount should be ₹1');
            setSnackbarVisibility(true);
            return;
        }

        if (!source) missingFields.push('source');
        if (!dateTime) missingFields.push('date');
        if (!amount || !source || !dateTime) {
            setErrorText(`Please fill the missing fields: ${missingFields.join(', ')}`);
            setSnackbarVisibility(true);
            return;
        }

        // Check if anything has changed
        const hasChanged =
            income.amount !== actualAmount ||
            income.source !== source ||
            income.description !== description ||
            new Date(income.dateTime).getTime() !== new Date(dateTime).getTime() ||
            (income.recurring ?? false) !== (recurring ?? false) ||
            (income.receipt ?? null) !== (receipt ?? null) ||
            (income.currency ?? "INR") !== (currency ?? "INR");

        if (!hasChanged) {
            setErrorText("No changes detected.");
            setSnackbarVisibility(true);
            return;
        }

        const { error } = await tryCatch(
            updateIncomeById(id, {
                amount: actualAmount,
                dateTime: dateTime,
                source: source,
                description: description ?? null,
                recurring: !!recurring,
                receipt: receipt ?? null,
                currency: currency ?? "INR",
            })
        );

        if (error) {
            setErrorText('Failed to update income. Please try again.');
            setSnackbarVisibility(true);
            return;
        }

        setGlobalSnackbar({
            message: 'Income updated successfully',
            duration: 2000,
            actionLabel: 'Dismiss',
            actionIcon: 'close',
            type: 'success',
            position: 'top',
            offset: insets.top + 10,
            screens: [Screens.Income, Screens.IncomeInfo],
        });

        setKeyboardHeight(0);
        navigation.goBack();
        queryClient.invalidateQueries({
            queryKey: ['incomes'],
        });
        queryClient.invalidateQueries({
            queryKey: ['income', id],
        });
        queryClient.invalidateQueries({
            queryKey: ['insights'],
        });
    };

    const styles = StyleSheet.create({
        snackbar: {
            backgroundColor: colors.error,
        },
    });

    return (
        <IncomeStoreProvider initialIncome={income}>
            <FormSheetHeader
                title="Edit Income"
                onClose={() => navigation.goBack()}
            />
            <IncomeForm
                showSubmitButton={!isSnackbarVisible}
                onSubmit={handleUpdateIncome}
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
        </IncomeStoreProvider>
    );
}
