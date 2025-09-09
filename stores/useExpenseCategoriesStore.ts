import { create } from 'zustand';
import Storage from 'expo-sqlite/kv-store';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useMemo } from 'react';
import { Category, CreateCategoryData, UpdateCategoryData } from '@/lib/types';
import { DefaultExpenseCategories } from '@/lib/constants';

interface ExpenseCategoriesStore {
  categories: Category[];

  // Basic operations
  setCategories: (categories: Category[]) => void;
  addCategory: (category: CreateCategoryData) => void;
  updateCategory: (name: string, updates: UpdateCategoryData) => void;
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
        ...cat, enabled: true
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
          isCustom: true,
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

        if (!category.isCustom) {
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
      storage: createJSONStorage(() => Storage),
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
    const map = new Map<string, Category>();
    categories.forEach(category => {
      map.set(category.name, category);
    });
    return map;
  }, [categories]);
};



