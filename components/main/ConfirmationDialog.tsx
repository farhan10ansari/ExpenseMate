// contexts/ConfirmationContext.tsx
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Portal, Dialog, Button } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/base/ThemedText';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';

export interface ConfirmationConfig {
  title?: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: 'default' | 'warning' | 'error' | 'info';
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  showCancel?: boolean;
}

export interface ConfirmationContextType {
  showConfirmationDialog: (config: ConfirmationConfig) => void;
  hideConfirmationDialog: () => void;
  isVisible: boolean;
}

const ConfirmationContext = createContext<ConfirmationContextType | undefined>(undefined);

interface ConfirmationProviderProps {
  children: ReactNode;
}

interface ConfirmationState {
  visible: boolean;
  config: ConfirmationConfig | null;
}

export const ConfirmationProvider: React.FC<ConfirmationProviderProps> = ({ children }) => {
  const { colors } = useAppTheme();
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>({
    visible: false,
    config: null,
  });

  const showConfirmationDialog = useCallback((config: ConfirmationConfig) => {
    setConfirmationState({
      visible: true,
      config: {
        title: 'Confirmation',
        confirmText: 'OK',
        cancelText: 'Cancel',
        type: 'default',
        showCancel: true,
        ...config,
      },
    });
  }, []);

  const hideConfirmationDialog = useCallback(() => {
    setConfirmationState({
      visible: false,
      config: null,
    });
  }, []);

  const handleConfirm = useCallback(async () => {
    const { config } = confirmationState;
    if (config?.onConfirm) {
      try {
        await config.onConfirm();
      } catch (error) {
        console.error('Confirmation dialog confirm callback error:', error);
      }
    }
    hideConfirmationDialog();
  }, [confirmationState, hideConfirmationDialog]);

  const handleCancel = useCallback(() => {
    const { config } = confirmationState;
    if (config?.onCancel) {
      try {
        config.onCancel();
      } catch (error) {
        console.error('Confirmation dialog cancel callback error:', error);
      }
    }
    hideConfirmationDialog();
  }, [confirmationState, hideConfirmationDialog]);

  const getConfirmButtonColor = useCallback((type: ConfirmationConfig['type']) => {
    switch (type) {
      case 'error':
        return colors.error;
      case 'warning':
        return colors.tertiary;
      case 'info':
        return colors.primary;
      default:
        return colors.primary;
    }
  }, [colors]);

  const contextValue: ConfirmationContextType = {
    showConfirmationDialog,
    hideConfirmationDialog,
    isVisible: confirmationState.visible,
  };

  return (
    <ConfirmationContext.Provider value={contextValue}>
      {children}
      
      <Portal>
        <Dialog 
          visible={confirmationState.visible} 
          onDismiss={confirmationState.config?.showCancel ? handleCancel : undefined}
          dismissable={confirmationState.config?.showCancel}
          style={styles.dialog}
        >
          {confirmationState.config?.title && (
            <Dialog.Title style={styles.title}>
              {confirmationState.config.title}
            </Dialog.Title>
          )}
          
          <Dialog.Content style={styles.content}>
            {typeof confirmationState.config?.message === 'string' ? (
              <ThemedText style={styles.message}>
                {confirmationState.config.message}
              </ThemedText>
            ) : (
              confirmationState.config?.message
            )}
          </Dialog.Content>
          
          <Dialog.Actions style={styles.actions}>
            {confirmationState.config?.showCancel && (
              <Button 
                onPress={handleCancel}
                style={styles.cancelButton}
              >
                {confirmationState.config.cancelText}
              </Button>
            )}
            <Button 
              mode="contained"
              onPress={handleConfirm}
              textColor={colors.onPrimary}
              buttonColor={getConfirmButtonColor(confirmationState.config?.type)}
              style={styles.confirmButton}
            >
              {confirmationState.config?.confirmText}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ConfirmationContext.Provider>
  );
};

export const useConfirmation = (): ConfirmationContextType => {
  const context = useContext(ConfirmationContext);
  if (context === undefined) {
    throw new Error('useConfirmation must be used within a ConfirmationProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  dialog: {
    marginHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    paddingBottom: 8,
  },
  content: {
    paddingVertical: 16,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 8,
    gap: 8,
  },
  cancelButton: {
    marginRight: 8,
  },
  confirmButton: {
    minWidth: 80,
  },
});
