import React, { useCallback } from 'react';
import { ThemedText } from '@/components/base/ThemedText';
import { CategoryManagerScreen } from '@/features/Category/components/CategoryManagerScreen';
import { View } from 'react-native';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import { softDeleteIncomesBySource } from '@/repositories/IncomeRepo';
import { useQueryClient } from '@tanstack/react-query';
import { Category, CreateCategoryData, UpdateCategoryData } from '@/lib/types';
import { createNewCategory, deleteCategory, getAllCategories, updateCategory } from '@/repositories/CategoryRepo';
import { tryCatch } from '@/lib/try-catch';
import { ThemedView } from '@/components/base/ThemedView';

export default function IncomeSourcesScreen() {
    const { colors } = useAppTheme();
    const queryClient = useQueryClient();
    const [sources, setSources] = React.useState<Category[]>([]);
    const [error, setError] = React.useState<Error | null>(null);

    const handleGetSources = React.useCallback(async () => {
        setError(null);
        try {
            const data = await getAllCategories('income-source', true);
            setSources(data as Category[]);
        } catch (error: any) {
            setError(error);
        }
    }, []);

    React.useEffect(() => {
        handleGetSources();
        return () => {
            queryClient.invalidateQueries({ queryKey: ['incomeSources'] });
        };
    }, [handleGetSources]);

    const deleteSourceWithCorrespondingIncomes = useCallback((source: string) => {
        // First, soft-delete all incomes with this source
        softDeleteIncomesBySource(source).then(async () => {
            // Then, delete the source from the store
            queryClient.invalidateQueries({ queryKey: ['incomes'] });
            queryClient.invalidateQueries({ queryKey: ['income'] });
            queryClient.invalidateQueries({ queryKey: ['stats', 'income'] });
            const { error } = await tryCatch(deleteCategory("income-source", source));
            if (error) {
                console.error("Error deleting income source:", error);
                return;
            }
            // Finally, refresh the sources list
            handleGetSources();
        }).catch((error) => {
            console.error('Error deleting incomes for source:', error);
            // Optionally, show an error message to the user
        });
    }, []);

    const handleAddCategory = useCallback(async (data: CreateCategoryData) => {
        const { data: newCategory, error } = await tryCatch(createNewCategory("income-source", {
            name: data.name,
            label: data.label,
            icon: data.icon as string,
            color: data.color,
        }))
        if (error || !newCategory) {
            console.error("Error creating income source:", error);
            return;
        }
        setSources(prevCategories => [...prevCategories, newCategory]);
        handleGetSources();
    }, []);

    const handleUpdateIncome = useCallback(async (name: string, updates: UpdateCategoryData) => {
        const { data: updatedSource, error } = await tryCatch(updateCategory("income-source", name, {
            label: updates.label,
            icon: updates.icon as string,
            color: updates.color,
            enabled: updates.enabled,
        }))
        if (error || !updatedSource) {
            console.error("Error updating income source:", error);
            return;
        }
        setSources(prevCategories => prevCategories.map((category) => (category.name === name ? updatedSource : category)));
        handleGetSources();
    }, []);

    if (error) {
        return <ThemedView><ThemedText centered>Error: {error?.message}</ThemedText></ThemedView>;
    }

    return (
        <CategoryManagerScreen
            categories={sources}
            onAdd={handleAddCategory}
            onUpdate={handleUpdateIncome}
            onDelete={deleteSourceWithCorrespondingIncomes}
            labels={{
                createTitle: 'Create Income Source',
                editTitle: 'Edit Income Source',
                createButton: 'Create',
                updateButton: 'Update',
                deleteTitle: 'Delete Income Source?',
                deleteMessage: (label) => (
                    <View style={{ gap: 8 }}>
                        <ThemedText>
                            Are you sure you want to delete the income source{' '}
                            <ThemedText style={{ fontWeight: 'bold' }}>{label}</ThemedText>?
                        </ThemedText>
                        <ThemedText style={{ color: colors.error, fontWeight: '500' }}>
                            ⚠️ This will also delete all income records associated with this source.
                        </ThemedText>
                        <ThemedText style={{ fontStyle: 'italic', opacity: 0.8 }}>
                            This action cannot be undone.
                        </ThemedText>
                    </View>
                ),
            }}
            type='income'
        />
    );
}
