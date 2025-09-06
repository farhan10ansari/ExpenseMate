import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import FormSheetHeader from "@/components/main/FormSheetHeader";
import FormSheetTabs from "@/components/main/FormSheetTabs";
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
    const { defaultTab } = useLocalSearchParams<{ defaultTab?: TransactionType }>();
    const [activeTab, setActiveTab] = useState<TransactionType>(defaultTab ?? 'expense');

    const {
        handleAddExpense,
        handleAddIncome,
    } = useTransactionForm();

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
                        onSubmit={handleAddExpense}
                    />
                </ExpenseStoreProvider>
            );
        }

        return (
            <IncomeStoreProvider>
                <IncomeForm
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
        </>
    );
}
