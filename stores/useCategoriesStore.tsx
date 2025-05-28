import { create } from 'zustand'
import { Category } from '@/lib/types';
import { DefaultCategories } from '@/lib/constants';

type CategoriesStore = {
    categories: Category[],
    categoryMapping: Record<string, Category>,
}

export const AddCategory: Category = {
    name: "add category",
    icon: "plus",
    label: "Add Category",
}

const useCategoriesStore = create<CategoriesStore>()((set) => ({
    categories: [...DefaultCategories],
    categoryMapping: DefaultCategories.reduce((acc, category) => {
        acc[category.name] = category;
        return acc;
    }, {} as Record<string, Category>),
}))

export default useCategoriesStore;


export const getCategoryRows = (categories: Category[]) => {
    const rows = [];
    const numberOfRows = 2; // Number of categories per row
    const rowSize = Math.ceil(categories.length / numberOfRows);
    for (let i = 0; i < categories.length; i += rowSize) {
        rows.push(categories.slice(i, i + rowSize));
    }
    return rows;
}