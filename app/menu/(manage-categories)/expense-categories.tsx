import React from 'react';
import { ThemedText } from '@/components/base/ThemedText';
import { useExpenseCategories, useExpenseCategoriesStore } from '@/stores/useExpenseCategoriesStore';
import { getName, getLabel } from '@/lib/functions';
import { CategoryManagerScreen } from '@/components/New/CategoryManagerScreen';
import { View } from 'react-native';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import { softDeleteExpensesByCategory } from '@/repositories/ExpenseRepo';
import { useQueryClient } from '@tanstack/react-query';

export default function ExpenseCategoriesScreen() {
    const { colors } = useAppTheme();
    const queryClient = useQueryClient();
    const categories = useExpenseCategories();
    const { addCategory, updateCategory, deleteCategory } = useExpenseCategoriesStore();

    const deleteCategoryWithCorrespondingExpenses = async (category: string) => {
        try {
            // First, soft-delete all expenses with this category
            await softDeleteExpensesByCategory(category);

            // Then, delete the category from the store
            deleteCategory(category);

            // Remove specific expense queries from cache
            queryClient.invalidateQueries({ queryKey: ['expense'] });
            queryClient.removeQueries({ queryKey: ['expense'] });

            // Invalidate expenses list
            await queryClient.invalidateQueries({ queryKey: ['expenses'] });

            console.log('Category and expenses deleted successfully');
        } catch (error) {
            console.error('Error deleting expenses for category:', error);
        }
    }

    return (
        <CategoryManagerScreen
            categories={categories}
            onAdd={addCategory}
            onUpdate={updateCategory}
            onDelete={deleteCategoryWithCorrespondingExpenses}
            getName={getName}
            getLabel={getLabel}
            labels={{
                createTitle: 'Create Expense Category',
                editTitle: 'Edit Expense Category',
                createButton: 'Create',
                updateButton: 'Update',
                deleteTitle: 'Delete Expense Category?',
                deleteMessage: (label) => (
                    <View style={{ gap: 8 }}>
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
