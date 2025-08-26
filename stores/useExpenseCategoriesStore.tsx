import { create } from 'zustand'
import { Category } from '@/lib/types';
import { DefaultExpenseCategories } from '@/lib/constants';
import { useMemo } from 'react';

type ExpenseCategoriesStore = {
    categories: Category[],
    categoryMapping: Record<string, Category>,
}

export const AddCategory: Category = {
    name: "add category",
    icon: "plus",
    label: "Add Category",
}

const useExpenseCategoriesStore = create<ExpenseCategoriesStore>()((set) => ({
    categories: [...DefaultExpenseCategories],
    categoryMapping: DefaultExpenseCategories.reduce((acc, category) => {
        acc[category.name] = category;
        return acc;
    }, {} as Record<string, Category>),
}))

export default useExpenseCategoriesStore;


export const getCategoryRows = (categories: Category[]) => {
    const rows = [];
    const numberOfRows = 2; // Number of categories per row
    const rowSize = Math.ceil(categories.length / numberOfRows);
    for (let i = 0; i < categories.length; i += rowSize) {
        rows.push(categories.slice(i, i + rowSize));
    }
    return rows;
}

export const useCategoryMapping = () => {
    const categories = useExpenseCategoriesStore(state => state.categories);

    return useMemo(() => {
        return categories
            // .filter(cat => cat.enabled)
            .reduce((acc, category) => {
                acc[category.name] = category;
                return acc;
            }, {} as Record<string, Category>);
    }, [categories]);
};
