import { ThemedText } from '@/components/base/ThemedText';
import SheetGrabber from '@/components/ui/SheetGrabber';
import useKeyboardHeight from '@/hooks/useKeyboardHeight';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import React, { useEffect } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import AmountInput from './components/AmountInput';
import CategoriesInput from './components/CategoriesInput';
import ConfirmButton from './components/ConfirmButton';
import DateInput from './components/DateInput';
import NotesInput from './components/NotesInput';
import PaymentMethodInput from './components/PaymentMethodInput';
import TimeInput from './components/TimeInput';
import { ExpenseData, useExpenseStore } from './ExpenseStoreProvider';

type ExpenseFormProps = {
  showSubmitButton?: boolean;
  onSubmit?: (expense: ExpenseData) => void;
}

export default function ExpenseForm({ showSubmitButton, onSubmit }: ExpenseFormProps) {
  const { colors } = useAppTheme();
  const { keyboardHeight } = useKeyboardHeight();

  const expense = useExpenseStore((state) => state.expense);
  const updateExpense = useExpenseStore((state) => state.updateExpense);

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      flex: 1,
    },
    sectionTitle: {
      color: colors.muted,
      width: '100%',
      textAlign: 'center',
      marginBottom: 10
    },
    amountContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    categoriesContainer: {
      marginTop: 20,
      gap: 2,
    },
    notesContainer: {
      marginTop: 20,
    },
    datetimeContainer: {
      marginTop: 20,
    },
    datetimeMain: {
      flexDirection: 'row',
      gap: 10,
    },
    datetimeInputContainer: {
      flex: 1,
    }
  });

  // Set default date and time
  useEffect(() => {
    if (!expense.datetime) {
      updateExpense({ datetime: new Date() });
    }
  }, [])

  const handleSubmit = () => onSubmit?.(expense);

  return (
    <View style={styles.container}>
      <SheetGrabber />
      <View style={{ flex: 1 }} onTouchStart={() => Keyboard.dismiss()}>
        {/* Amount */}
        <View style={styles.amountContainer}>
          <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
            Amount
          </ThemedText>
          <AmountInput
            amount={expense.amount}
            setAmount={(amount) => updateExpense({ amount })}
          />
        </View>
        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Categories
          </ThemedText>
          <CategoriesInput
            category={expense.category}
            setCategory={(category) => updateExpense({ category })}
          />
        </View>
        {/* Notes */}
        <View style={styles.notesContainer}>
          <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
            Notes
          </ThemedText>
          <NotesInput
            note={expense.description}
            setNote={(description => updateExpense({ description }))}
          />
        </View>
        {/* Payment Method */}
        <View style={styles.notesContainer}>
          <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
            Payment Method
          </ThemedText>
          <PaymentMethodInput paymentMethod={expense.paymentMethod} setPaymentMethod={(paymentMethod => updateExpense({ paymentMethod }))} />
        </View>
        {/* Date & Time */}
        <View style={styles.datetimeContainer}>
          <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
            Date & Time
          </ThemedText>
          <View style={styles.datetimeMain}>
            <DateInput datetime={expense.datetime ?? undefined} setDatetime={(datetime => updateExpense({ datetime }))} style={styles.datetimeInputContainer} />
            <TimeInput datetime={expense.datetime ?? undefined} setDatetime={(datetime => updateExpense({ datetime }))} style={styles.datetimeInputContainer} />
          </View>
        </View>
      </View>


      {/* Confirm Button */}
      {showSubmitButton && <ConfirmButton onPress={handleSubmit} keyboardHeight={keyboardHeight} />}

    </View>
  );
}