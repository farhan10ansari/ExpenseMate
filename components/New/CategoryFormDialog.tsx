import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { StyleSheet, Keyboard, Platform, KeyboardAvoidingView } from 'react-native';
import {
  Portal,
  Dialog,
  TextInput,
} from 'react-native-paper';
import { IconSelector } from './IconSelector';
import { CategoryFormData } from '@/lib/types';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import ThemedButton from '../ui/ThemedButton';

interface CategoryFormDialogProps {
  visible: boolean;
  initialData?: CategoryFormData;
  mode: 'create' | 'edit';
  onSubmit: (data: CategoryFormData) => void;
  onDismiss: () => void;
  dialogTitle?: string;
  submitLabel?: string;
}

const VALIDATION_RULES = {
  MIN_LENGTH: 2,
  MAX_LENGTH: 32,
} as const;

export const CategoryFormDialog = React.memo<CategoryFormDialogProps>(({
  visible,
  initialData,
  mode,
  onSubmit,
  onDismiss,
  dialogTitle = mode === 'create' ? 'Create' : 'Edit',
  submitLabel = mode === 'create' ? 'Create' : 'Update',
}) => {
  const [formData, setFormData] = useState<CategoryFormData>({
    title: '',
    icon: null,
    color: null
  });

  const isValid = useMemo(() => {
    const trimmedTitle = formData.title.trim();
    return trimmedTitle.length >= VALIDATION_RULES.MIN_LENGTH &&
      trimmedTitle.length <= VALIDATION_RULES.MAX_LENGTH &&
      formData.icon && formData.color;
  }, [formData.title, formData.icon]);

  // Reset form when dialog opens/closes or initial data changes
  useEffect(() => {
    if (visible) {
      setFormData({
        title: initialData?.title || '',
        icon: initialData?.icon,
        color: initialData?.color
      });
    }
  }, [visible, initialData]);

  const handleTitleChange = useCallback((title: string) => {
    setFormData(prev => ({ ...prev, title }));
  }, []);

  const handleIconSelect = useCallback(({ icon, color }: { icon: IconSource, color: string }) => {
    setFormData(prev => ({ ...prev, icon, color }));
  }, []);

  const handleSubmit = useCallback(() => {

    const trimmedTitle = formData.title.trim();

    // Final validation check before submitting
    if (isValid) {
      onSubmit({
        title: trimmedTitle,
        icon: formData.icon,
        color: formData.color
      });
    }
  }, [formData, onSubmit]);

  const handleDismiss = useCallback(() => {
    Keyboard.dismiss();
    onDismiss();
  }, [onDismiss]);

  return (
    <Portal>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <Dialog
          visible={visible}
          onDismiss={handleDismiss}
        >
          <Dialog.Title style={{
            fontSize: 16,
          }}>{dialogTitle}</Dialog.Title>

          <Dialog.Content style={{
            paddingBottom: 0
          }}>
            <TextInput
              label="Category Name"
              value={formData.title}
              onChangeText={handleTitleChange}
              mode="outlined"
              maxLength={VALIDATION_RULES.MAX_LENGTH}
              autoFocus
              dense
            />

            <IconSelector
              selectedIcon={formData.icon}
              onIconSelect={handleIconSelect}
            />
          </Dialog.Content>

          <Dialog.Actions style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 2,
            paddingHorizontal: 16,
            paddingVertical: 8
          }}>
            <ThemedButton
              onPress={handleDismiss}
              mode='text'
              compact
              colorType='secondary'
            >
              Cancel
            </ThemedButton>
            <ThemedButton
              mode="contained"
              onPress={handleSubmit}
              disabled={!isValid}
              compact
              colorType='primary'
              themedBorder
            >
              {submitLabel}
            </ThemedButton>
          </Dialog.Actions>
        </Dialog>
      </KeyboardAvoidingView>
    </Portal>
  );
});

CategoryFormDialog.displayName = 'CategoryFormDialog';

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  },
});
