import { PaymentMethod } from '@/lib/types';
import { Expense } from '@/db/schema'
import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { createStore, StoreApi, useStore } from 'zustand'

export type ExpenseData = {
    amount: number;
    category: string | null;
    description: string;
    datetime: Date | undefined | null;
    paymentMethod: PaymentMethod["name"] | undefined | null;
}

type ExpenseStore = {
    expense: ExpenseData;
    updateExpense: (expense: Partial<ExpenseData>) => void;
}

const ExpenseStoreContext = createContext<StoreApi<ExpenseStore> | undefined>(undefined);

type ExpenseStoreProviderProps = PropsWithChildren<{
    initialExpense?: Expense;
}>;

export function ExpenseStoreProvider({ initialExpense, children }: ExpenseStoreProviderProps) {
    const [store] = useState(() =>
        createStore<ExpenseStore>((set) => ({
            expense: {
                amount: initialExpense ? initialExpense.amount : 0,
                category: initialExpense ? initialExpense.category : null,
                description: initialExpense ? (initialExpense.description ?? "") : "",
                datetime: initialExpense ? new Date(initialExpense.dateTime) : undefined,
                paymentMethod: initialExpense ? (initialExpense.paymentMethod as PaymentMethod["name"]) : undefined,
            },
            updateExpense: (expense) => set((state) => ({
                expense: {
                    ...state.expense,
                    ...expense,
                },
            })),

        }))
    );

    return (
        <ExpenseStoreContext.Provider value={store}>
            {children}
        </ExpenseStoreContext.Provider>
    );
}


export function useExpenseStore<T>(selector: (state: ExpenseStore) => T) {
    const store = useContext(ExpenseStoreContext);
    if (!store) {
        throw new Error("useExpenseStore must be used within a ExpenseStoreProvider");
    }
    return useStore(store, selector);
};
