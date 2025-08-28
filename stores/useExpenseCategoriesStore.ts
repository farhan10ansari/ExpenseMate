// stores/expenseCategoriesStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useMemo } from 'react';
import { Category } from '@/lib/types';
import { DefaultExpenseCategories } from '@/lib/constants';

interface CreateExpenseCategoryData {
  name: string;
  label: string;
  icon: string;
  color: string;
}

interface UpdateExpenseCategoryData {
  label?: string;
  icon?: string;
  color?: string;
  enabled?: boolean;
}

interface ExpenseCategoriesStore {
  categories: Category[];

  // Basic operations
  setCategories: (categories: Category[]) => void;
  addCategory: (category: CreateExpenseCategoryData) => void;
  updateCategory: (name: string, updates: UpdateExpenseCategoryData) => void;
  deleteCategory: (name: string) => void;

  // Utility functions
  getCategoryByName: (name: string) => Category | undefined;
  categoryExists: (name: string) => boolean;

  // Bulk operations
  resetToDefaults: (defaultCategories: Category[]) => void;
  clearAll: () => void;
}


export const useExpenseCategoriesStore = create<ExpenseCategoriesStore>()(
  persist(
    (set, get) => ({
      categories: DefaultExpenseCategories.map(cat => ({
        ...cat, enabled: true, deletable: false
      })),

      setCategories: (categories) => set({ categories }),

      addCategory: (categoryData) => {
        const { categories } = get();

        // Check if category already exists
        if (categories.some(cat => cat.name === categoryData.name)) {
          throw new Error(`Category with name '${categoryData.name}' already exists`);
        }

        const newCategory: Category = {
          ...categoryData,
          enabled: true,
          deletable: true,
        };

        set({ categories: [...categories, newCategory] });
      },

      updateCategory: (name, updates) => {
        const { categories } = get();
        const categoryIndex = categories.findIndex(cat => cat.name === name);

        if (categoryIndex === -1) {
          throw new Error(`Category with name '${name}' not found`);
        }

        const updatedCategories = [...categories];
        updatedCategories[categoryIndex] = {
          ...updatedCategories[categoryIndex],
          ...updates
        };

        set({ categories: updatedCategories });
      },

      deleteCategory: (name) => {
        const { categories } = get();
        const category = categories.find(cat => cat.name === name);

        if (!category) {
          throw new Error(`Category with name '${name}' not found`);
        }

        if (!category.deletable) {
          throw new Error(`Category '${name}' cannot be deleted`);
        }

        set({ categories: categories.filter(cat => cat.name !== name) });
      },

      getCategoryByName: (name) => {
        return get().categories.find(cat => cat.name === name);
      },

      categoryExists: (name) => {
        return get().categories.some(cat => cat.name === name);
      },

      resetToDefaults: (defaultCategories) => {
        set({ categories: defaultCategories });
      },

      clearAll: () => {
        set({ categories: [] });
      },
    }),
    {
      name: 'expense-categories-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Hooks
export const useExpenseCategories = () => {
  return useExpenseCategoriesStore(state => state.categories);
};

export const useEnabledExpenseCategories = () => {
  const categories = useExpenseCategoriesStore(state => state.categories);
  return useMemo(() => categories.filter(cat => cat.enabled), [categories]);
};

export const useExpenseCategoryMapping = () => {
  const categories = useExpenseCategoriesStore(state => state.categories);
  return useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category.name] = category;
      return acc;
    }, {} as Record<string, Category>);
  }, [categories]);
};


export const getCategoryRows = (categories: Category[]) => {
  const rows = [];
  const numberOfRows = 2; // Number of categories per row
  const rowSize = Math.ceil(categories.length / numberOfRows);
  for (let i = 0; i < categories.length; i += rowSize) {
    rows.push(categories.slice(i, i + rowSize));
  }
  return rows;
}

