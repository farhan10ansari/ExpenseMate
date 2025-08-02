import FormSheetHeader from "@/components/main/FormSheetHeader";
import CustomSnackbar from "@/components/ui/CustomSnackbar";
import SheetGrabber from "@/components/ui/SheetGrabber";
import IncomeForm from "@/features/Income/IncomeForm";
import { IncomeData, IncomeStoreProvider } from "@/features/Income/IncomeStoreProvider";
import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import { tryCatch } from "@/lib/try-catch";
import { Screens } from "@/lib/types";
import { addIncome } from "@/repositories/IncomeRepo";
import useAppStore from "@/stores/useAppStore";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { useQueryClient } from "@tanstack/react-query";
import { router, useNavigation } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";

export default function NewIncomeScreen() {
    const navigation = useNavigation();
    const queryClient = useQueryClient();
    const { colors } = useAppTheme();
    const { keyboardHeight, setKeyboardHeight } = useKeyboardHeight();

    // Snackbar
    const [isSnackbarVisible, setSnackbarVisibility] = useState(false);
    const onDismissSnackBar = () => setSnackbarVisibility(false);
    const [errorText, setErrorText] = useState('');

    // Global Snackbar
    const setGlobalSnackbar = useAppStore((state) => state.setGlobalSnackbar);

    const handleAddIncome = async (income: IncomeData) => {
        const { amount, source, description, dateTime, recurring, receipt, currency } = income;

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
            setErrorText(`Please fill the missing fields i.e. ${missingFields.join(', ')}`);
            setSnackbarVisibility(true);
            return;
        }

        const { data, error } = await tryCatch(
            addIncome({
                amount: actualAmount,
                dateTime: dateTime,
                source: source,
                description: description ?? "",
                recurring: !!recurring,
                receipt: receipt ?? null,
                currency: currency ?? 'INR',
            })
        );

        if (error) {
            setErrorText('Failed to add income. Please try again.');
            setSnackbarVisibility(true);
            return;
        }

        // Show snackbar
        setGlobalSnackbar({
            message: 'Income added successfully',
            duration: 2000,
            actionLabel: 'Dismiss',
            actionIcon: 'close',
            type: 'success',
            position: 'bottom',
            offset: 80,
            screens: [Screens.Home, Screens.AllExpenses, Screens.Income, Screens.Settings],
        });

        setKeyboardHeight(0);
        navigation.goBack();
        // Invalidate related queries
        queryClient.invalidateQueries({ queryKey: ['incomes'] });
        queryClient.invalidateQueries({ queryKey: ['insights'] });
    };

    const styles = StyleSheet.create({
        snackbar: {
            backgroundColor: colors.error,
        },
    });

    return (
        <IncomeStoreProvider>
            {/* <SheetGrabber /> */}
            <FormSheetHeader
                title="New Income"
                onClose={() => {router.back()}}
            />
            <IncomeForm
                showSubmitButton={!isSnackbarVisible}
                onSubmit={handleAddIncome}
            />
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
