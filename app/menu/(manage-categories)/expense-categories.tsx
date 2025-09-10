import React, { useCallback } from 'react';
import { ThemedText } from '@/components/base/ThemedText';
import { CategoryManagerScreen } from '@/features/Category/components/CategoryManagerScreen';
import { View } from 'react-native';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import { softDeleteExpensesByCategory } from '@/repositories/ExpenseRepo';
import { useQueryClient } from '@tanstack/react-query';
import { Category, CreateCategoryData, UpdateCategoryData } from '@/lib/types';
import { createNewCategory, deleteCategory, getAllCategories, updateCategory } from '@/repositories/CategoryRepo';
import { tryCatch } from '@/lib/try-catch';

export default function ExpenseCategoriesScreen() {
    const { colors } = useAppTheme();
    const queryClient = useQueryClient();
    const [categories, setCategories] = React.useState<Category[]>([]);

    const handleGetCategories = useCallback(async () => {
        const data = await getAllCategories('expense-category', true);
        setCategories(data as Category[]);
    }, []);

    React.useEffect(() => {
        handleGetCategories();
        return () => {
            queryClient.invalidateQueries({ queryKey: ['expenseCategories'] });
        };
    }, [handleGetCategories]);


    const deleteCategoryWithCorrespondingExpenses = useCallback(async (category: string) => {
        // First, soft-delete all expenses with this category
        softDeleteExpensesByCategory(category).then(async () => {
            // Then, delete the category from the store
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            queryClient.invalidateQueries({ queryKey: ['expense'] });
            queryClient.invalidateQueries({ queryKey: ['stats', 'expense'] });
            const { error } = await tryCatch(deleteCategory("expense-category", category));
            if (error) {
                console.error("Error deleting expense category:", error);
                return;
            }
            // Finally, refresh the categories list
            handleGetCategories();
        }).catch((error) => {
            console.error('Error deleting expenses for source:', error);
            // Optionally, show an error message to the user
        });
    }, []);

    const handleAddCategory = useCallback(async (data: CreateCategoryData) => {
        const { data: newCategory, error } = await tryCatch(createNewCategory("expense-category", {
            name: data.name,
            label: data.label,
            icon: data.icon as string,
            color: data.color,
        }))
        if (error || !newCategory) {
            console.error("Error creating expense category:", error);
            return;
        }
        setCategories(prevCategories => [...prevCategories, newCategory]);
        handleGetCategories();
    }, []);

    const handleUpdateExpense = useCallback(async (name: string, updates: UpdateCategoryData) => {
        const { data: updatedExpense, error } = await tryCatch(updateCategory("expense-category", name, {
            label: updates.label,
            icon: updates.icon as string,
            color: updates.color,
            enabled: updates.enabled,
        }))
        if (error || !updatedExpense) {
            console.error("Error updating expense category:", error);
            return;
        }
        setCategories(prevCategories => prevCategories.map((category) => (category.name === name ? updatedExpense : category)));
        handleGetCategories();
    }, []);

    return (
        <CategoryManagerScreen
            categories={categories as Category[]}
            onAdd={handleAddCategory}
            onUpdate={handleUpdateExpense}
            onDelete={deleteCategoryWithCorrespondingExpenses}
            labels={{
                createTitle: 'Create Expense Category',
                editTitle: 'Edit Expense Category',
                createButton: 'Create',
                updateButton: 'Update',
                deleteTitle: 'Delete Expense Category?',
                deleteMessage: (label) => (
                    <View style={{ gap: 8, marginTop: 12 }}>
                        <ThemedText>
                            Are you sure you want to delete the expense category{' '}
                            <ThemedText style={{ fontWeight: 'bold' }}>{label}</ThemedText>?
                        </ThemedText>
                        <ThemedText style={{ color: colors.error, fontWeight: '500' }}>
                            ⚠️ This will also delete all expenses associated with this category.
                        </ThemedText>
                        <ThemedText style={{ fontStyle: 'italic', opacity: 0.8 }}>
                            This action cannot be undone.
                        </ThemedText>
                    </View>
                ),
            }}
        />
    );
}
