import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllCategories } from '@/repositories/CategoryRepo';
import { ExpenseCategory, IncomeSource } from '@/db/schema';
import { Category } from '@/lib/types';

type ExpenseCategoriesContextType = ExpenseCategory[];
type IncomeSourcesContextType = IncomeSource[];

export const ExpenseCategoriesContext = createContext<ExpenseCategoriesContextType | undefined>(undefined);
export const IncomeSourcesContext = createContext<IncomeSourcesContextType | undefined>(undefined);

// Main provider component that handles data fetching and provides both contexts
export const CategoryDataProvider = ({ children }: { children: ReactNode }) => {
    const expenseCategoriesQuery = useQuery({
        queryKey: ['expenseCategories'],
        queryFn: () => getAllCategories('expense', true),
    });

    const incomeSourcesQuery = useQuery({
        queryKey: ['incomeSources'],
        queryFn: () => getAllCategories('income', true),
    });

    const expenseContextValue: ExpenseCategoriesContextType = useMemo(() => (expenseCategoriesQuery.data ?? []), [expenseCategoriesQuery]);

    const incomeContextValue: IncomeSourcesContextType = useMemo(() => (incomeSourcesQuery.data ?? []), [incomeSourcesQuery]);

    return (
        <ExpenseCategoriesContext.Provider value={expenseContextValue}>
            <IncomeSourcesContext.Provider value={incomeContextValue}>
                {children}
            </IncomeSourcesContext.Provider>
        </ExpenseCategoriesContext.Provider>
    );
};


// Public hooks (maintaining the same API)
export const useExpenseCategories = (): ExpenseCategory[] => {
    const context = useContext(ExpenseCategoriesContext);
    if (context === undefined) {
        throw new Error('useExpenseCategoriesContext must be used within CategoryDataProvider');
    }
    return context;
};

export const useIncomeSources = (): IncomeSource[] => {
    const context = useContext(IncomeSourcesContext);
    if (context === undefined) {
        throw new Error('useIncomeSourcesContext must be used within CategoryDataProvider');
    }
    return context;
};

// Mapping hooks
export const useExpenseCategoryMapping = () => {
    const categories = useExpenseCategories();
    return useMemo(() => {
        const map = new Map<string, Category>();
        categories.forEach(category => {
            map.set(category.name, category);
        });
        return map;
    }, [categories]);
};

export const useIncomeSourceMapping = () => {
    const sources = useIncomeSources();
    return useMemo(() => {
        const map = new Map<string, Category>();
        sources.forEach(source => {
            map.set(source.name, source);
        });
        return map;
    }, [sources]);
};

// Additional utility hooks
export const useEnabledExpenseCategories = (): ExpenseCategory[] => {
    const categories = useExpenseCategories();
    return useMemo(() => categories.filter(cat => cat.enabled), [categories]);
};

export const useEnabledIncomeSources = (): IncomeSource[] => {
    const sources = useIncomeSources();
    return useMemo(() => sources.filter(source => source.enabled), [sources]);
};