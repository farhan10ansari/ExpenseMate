import React from 'react';
import { ThemedText } from '@/components/base/ThemedText';
import { useIncomeSources, useIncomeSourcesStore } from '@/stores/useIncomeSourcesStore';
import { getName, getLabel } from '@/lib/functions';
import { CategoryManagerScreen } from '@/components/New/CategoryManagerScreen';
import { View } from 'react-native';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import { softDeleteIncomesBySource } from '@/repositories/IncomeRepo';
import { useQueryClient } from '@tanstack/react-query';

export default function IncomeSourcesScreen() {
    const { colors } = useAppTheme();
    const queryClient = useQueryClient();
    const categories = useIncomeSources();
    const addSource = useIncomeSourcesStore(state => state.addSource);
    const updateSource = useIncomeSourcesStore(state => state.updateSource);
    const deleteSource = useIncomeSourcesStore(state => state.deleteSource);

    const deleteSourceWithCorrespondingIncomes = (source: string) => {
        // First, soft-delete all incomes with this source
        softDeleteIncomesBySource(source).then(() => {
            // Then, delete the source from the store
            queryClient.invalidateQueries({ queryKey: ['incomes'] });
            queryClient.invalidateQueries({ queryKey: ['income'] });
            queryClient.invalidateQueries({ queryKey: ['stats', 'income'] });
            deleteSource(source);
        }).catch((error) => {
            console.error('Error deleting incomes for source:', error);
            // Optionally, show an error message to the user
        });
    }

    return (
        <CategoryManagerScreen
            categories={categories}
            onAdd={addSource}
            onUpdate={updateSource}
            onDelete={deleteSourceWithCorrespondingIncomes}
            getName={getName}
            getLabel={getLabel}
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
