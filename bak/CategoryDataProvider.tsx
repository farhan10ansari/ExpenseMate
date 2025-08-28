// import React, { createContext, useContext, useMemo, ReactNode } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { getAllExpenseCategories, getAllIncomeSources } from '@/repositories/CategoryRepo';
// import { ExpenseCategory, IncomeSource } from '@/db/schema';
// import { Category } from '@/lib/types';

// interface CategoryDataContextType {
//     expenseCategories: ExpenseCategory[];
//     incomeSources: IncomeSource[];
// }

// // Contexts
// const CategoryDataContext = createContext<CategoryDataContextType | undefined>(undefined);

// // Provider Component
// export const CategoryDataProvider = ({ children }: { children: ReactNode }) => {
//     const expenseCategoriesQuery = useQuery({
//         queryKey: ['expenseCategories'],
//         queryFn: () => getAllExpenseCategories(true),
//     });

//     const incomeSourcesQuery = useQuery({
//         queryKey: ['incomeSources'],
//         queryFn: () => getAllIncomeSources(true),
//     });

//     const contextValue: CategoryDataContextType = {
//         expenseCategories: expenseCategoriesQuery.data || [],
//         incomeSources: incomeSourcesQuery.data || [],
//     };

//     return (
//         <CategoryDataContext.Provider value={contextValue}>
//             {children}
//         </CategoryDataContext.Provider>
//     );
// };

// // Base hook to access context
// const useDataContext = (): CategoryDataContextType => {
//     const context = useContext(CategoryDataContext);
//     if (context === undefined) {
//         throw new Error('useDataContext must be used within a DataProvider');
//     }
//     return context;
// };

// // Custom Hooks
// export const useExpenseCategories = (): ExpenseCategory[] => {
//     const { expenseCategories } = useDataContext();
//     return expenseCategories;
// };

// export const useIncomeSources = (): IncomeSource[] => {
//     const { incomeSources } = useDataContext();
//     return incomeSources;
// };

// // Mapping hooks
// export const useExpenseCategoryMapping = (): Record<string, ExpenseCategory> => {
//     const categories = useExpenseCategories();

//     return useMemo(() => {
//         return categories.reduce((acc, category) => {
//             acc[category.name] = category;
//             return acc;
//         }, {} as Record<string, ExpenseCategory>);
//     }, [categories]);
// };

// export const useIncomeSourceMapping = (): Record<string, IncomeSource> => {
//     const sources = useIncomeSources();

//     return useMemo(() => {
//         return sources.reduce((acc, source) => {
//             acc[source.name] = source;
//             return acc;
//         }, {} as Record<string, IncomeSource>);
//     }, [sources]);
// };

// // Additional utility hooks
// export const useEnabledExpenseCategories = (): ExpenseCategory[] => {
//     const categories = useExpenseCategories();
//     return useMemo(() => categories.filter(cat => cat.enabled), [categories]);
// };

// export const useEnabledIncomeSources = (): IncomeSource[] => {
//     const sources = useIncomeSources();
//     return useMemo(() => sources.filter(source => source.enabled), [sources]);
// };


// export const getCategoryRows = (categories: Category[]) => {
//     const rows = [];
//     const numberOfRows = 2; // Number of categories per row
//     const rowSize = Math.ceil(categories.length / numberOfRows);
//     for (let i = 0; i < categories.length; i += rowSize) {
//         rows.push(categories.slice(i, i + rowSize));
//     }
//     return rows;
// }

