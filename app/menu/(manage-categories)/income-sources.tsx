import React, { useState, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { FAB, Portal } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Category, CategoryFormData } from '@/lib/types';
import { CategoryList } from '@/components/New/CategoryList';
import { CategoryFormDialog } from '@/components/New/CategoryFormDialog';
import { ThemedText } from '@/components/base/ThemedText';
import { useConfirmation } from '@/components/main/ConfirmationDialog';
import { ScreenWrapper } from '@/components/main/ScreenWrapper';
import { useIncomeSources, useIncomeSourcesStore } from '@/stores/useIncomeSourcesStore';
import { useIsFocused } from '@react-navigation/native';


type DialogMode = 'create' | 'edit' | null;

interface DialogState {
    mode: DialogMode;
    category?: Category;
}

export default function CategoriesScreen() {
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused()

    // Store actions
    const categories = useIncomeSources()
    const addCategory = useIncomeSourcesStore(state => state.addSource)
    const updateCategory = useIncomeSourcesStore(state => state.updateSource)
    const deleteCategory = useIncomeSourcesStore(state => state.deleteSource)

    // Confirmation dialog
    const { showConfirmationDialog } = useConfirmation()

    // Local state
    const [dialogState, setDialogState] = useState<DialogState>({ mode: null });

    // Handlers
    const handleToggleCategory = useCallback((name: string, enabled: boolean) => {
        updateCategory(name, { enabled });
    }, []);

    const handleOpenCreateDialog = useCallback(() => {
        setDialogState({ mode: 'create' });
    }, []);

    const handleOpenEditDialog = useCallback((category: Category) => {
        setDialogState({ mode: 'edit', category });
    }, []);

    const handleCloseDialog = useCallback(() => {
        setDialogState({ mode: null });
    }, []);

    const handleDeleteCategory = useCallback((category: Category) => {
        showConfirmationDialog({
            title: 'Delete Income Source?',
            message: (<ThemedText>Are you sure you want to delete the income source <ThemedText style={{ fontWeight: 'bold' }}>{category.label}</ThemedText>? This action cannot be undone.</ThemedText>),
            type: 'error',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            onConfirm: () => deleteCategory(category.name),
            onCancel: () => { },
            showCancel: true,
        })
    }, [showConfirmationDialog]);

    const handleSubmitForm = useCallback((data: CategoryFormData) => {
        if (!data.title || !data.icon || !data.color) return;
        const name = data.title.trim();
        const label = data.title.trim().toLocaleUpperCase();
        if (dialogState.mode === 'create') {
            addCategory({
                name,
                label,
                icon: data.icon as string,
                color: data.color,
            });
        } else if (dialogState.mode === 'edit' && dialogState.category) {
            updateCategory(dialogState.category.name, {
                label: data.title,
                icon: data.icon as string,
                color: data.color,
            });
        }
        handleCloseDialog();
    }, [dialogState, handleCloseDialog]);



    const dialogInitialData = dialogState.category
        ? {
            title: dialogState.category.label,
            icon: dialogState.category.icon,
            color: dialogState.category.color,
        }
        : undefined;

    return (
        <ScreenWrapper background='background'>
            <CategoryList
                categories={categories}
                onToggleCategory={handleToggleCategory}
                onEditCategory={handleOpenEditDialog}
                onDeleteCategory={handleDeleteCategory}
            />
            <CategoryFormDialog
                visible={dialogState.mode !== null}
                mode={dialogState.mode || 'create'}
                initialData={dialogInitialData}
                onSubmit={handleSubmitForm}
                onDismiss={handleCloseDialog}
                dialogTitle={dialogState.mode === 'create' ? 'Create Income Source' : 'Edit Income Source'}
                submitLabel={dialogState.mode === 'create' ? 'Create' : 'Update'}
            />
            <Portal>
                <FAB
                    visible={dialogState.mode == null && isFocused}
                    icon="plus"
                    style={[
                        styles.fab,
                        {
                            bottom: insets.bottom + 20,
                            right: insets.right + 16,
                        }
                    ]}
                    onPress={handleOpenCreateDialog}
                    variant="tertiary"
                    size="medium"
                />
            </Portal>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fab: {
        position: "absolute",
        height: 48,
        width: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
