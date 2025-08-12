// app/(modal)/transaction/new.tsx
import { useState } from "react";
import { StyleSheet } from "react-native";
import { router } from "expo-router";

import FormSheetHeader from "@/components/main/FormSheetHeader";
import FormSheetTabs from "@/components/main/FormSheetTabs";
import CustomSnackbar from "@/components/ui/CustomSnackbar";

import ExpenseForm from "@/features/Expense/ExpenseForm";
import { ExpenseStoreProvider } from "@/features/Expense/ExpenseStoreProvider";

import IncomeForm from "@/features/Income/IncomeForm";
import { IncomeStoreProvider } from "@/features/Income/IncomeStoreProvider";

import { useTransactionForm } from "@/hooks/useTransactionForm";

type TransactionType = 'expense' | 'income';

const TABS = [
    { key: 'expense', label: 'Expense' },
    { key: 'income', label: 'Income' },
];

export default function NewTransactionScreen() {
    const [activeTab, setActiveTab] = useState<TransactionType>('expense');

    const {
        isSnackbarVisible,
        errorText,
        keyboardHeight,
        colors,
        onDismissSnackBar,
        handleAddExpense,
        handleAddIncome,
    } = useTransactionForm();

    const styles = StyleSheet.create({
        snackbar: {
            backgroundColor: colors.error,
        },
    });

    const handleTabChange = (tabKey: string) => {
        setActiveTab(tabKey as TransactionType);
    };

    const HeaderTitleComponent = () => (
        <>
            <FormSheetTabs
                tabs={TABS}
                activeTab={activeTab}
                onTabChange={handleTabChange}
            />
        </>
    );

    const renderForm = () => {
        if (activeTab === 'expense') {
            return (
                <ExpenseStoreProvider>
                    <ExpenseForm
                        showSubmitButton={!isSnackbarVisible}
                        onSubmit={handleAddExpense}
                    />
                </ExpenseStoreProvider>
            );
        }

        return (
            <IncomeStoreProvider>
                <IncomeForm
                    showSubmitButton={!isSnackbarVisible}
                    onSubmit={handleAddIncome}
                />
            </IncomeStoreProvider>
        );
    };

    return (
        <>
            <FormSheetHeader
                title={<HeaderTitleComponent />}
                onClose={() => router.back()}
                headerStyle={{
                    paddingTop: 4,
                    paddingLeft: 12,
                }}
            />
            {renderForm()}

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
        </>
    );
}
