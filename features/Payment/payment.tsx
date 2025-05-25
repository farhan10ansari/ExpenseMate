import { ThemedText } from '@/components/base/ThemedText';
import CustomSnackbar from '@/components/ui/CustomSnackbar';
import SheetGrabber from '@/components/ui/SheetGrabber';
import useKeyboardHeight from '@/hooks/useKeyboardHeight';
import { tryCatch } from '@/lib/try-catch';
import { addExpense } from '@/repositories/expenses';
import useAppStore from '@/stores/useAppStore';
import useCategoriesStore from '@/stores/useCategoriesStore';
import usePaymentStore from '@/stores/usePaymentStore';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import AmountInput from './components/AmountInput';
import CategoriesInput from './components/CategoriesInput';
import ConfirmButton from './components/ConfirmButton';
import DateInput from './components/DateInput';
import NotesInput from './components/NotesInput';
import PaymentMethodInput from './components/PaymentMethodInput';
import TimeInput from './components/TimeInput';

export default function PaymentScreen() {
  const navigation = useNavigation();
  const queryCLient = useQueryClient();
  const { colors } = useAppTheme();
  const { keyboardHeight, setKeyboardHeight } = useKeyboardHeight();

  // Payment store
  const amount = usePaymentStore((state) => state.amount);
  const setAmount = usePaymentStore((state) => state.setAmount);
  const category = usePaymentStore((state) => state.category);
  const setCategory = usePaymentStore((state) => state.setCategory);
  const description = usePaymentStore((state) => state.description);
  const setDescription = usePaymentStore((state) => state.setDescription);
  const datetime = usePaymentStore((state) => state.datetime);
  const setDatetime = usePaymentStore((state) => state.setDatetime);
  const paymentMethod = usePaymentStore((state) => state.paymentMethod);
  const setPaymentMethod = usePaymentStore((state) => state.setPaymentMethod);
  const resetPaymentStore = usePaymentStore((state) => state.resetPaymentStore);


  // categories store
  const categories = useCategoriesStore((state) => state.categories);

  // Snackbar
  const [isSnackbarVisible, setSnackbarVisibility] = React.useState(false);
  const onDismissSnackBar = () => setSnackbarVisibility(false);
  const [errorText, setErrorText] = React.useState('');

  // Global Snackbar
  const setGlobalSnackbar = useAppStore((state) => state.setGlobalSnackbar);

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
    },
    snackbar: {
      backgroundColor: colors.error,
    },
  });

  const handleAddExpense = async () => {
    const missingFields = [];
    if (!amount) missingFields.push('amount');
    if (!category) missingFields.push('category');
    if (!datetime) missingFields.push('datetime');
    if (!amount || !category || !datetime) {

      setErrorText(`Please fill the missing fields i.e. ${missingFields.join(', ')}`);
      setSnackbarVisibility(true)
      return;
    }

    const { data, error } = await tryCatch(addExpense({
      amount: amount,
      dateTime: datetime,
      description: description,
      paymentMethod: paymentMethod,
      category: category,
    }))

    if (error) {
      setErrorText('Failed to add expense. Please try again.');
      setSnackbarVisibility(true)
      return;
    }
    // Reset the payment store
    resetPaymentStore()
    // Show snackbar
    setGlobalSnackbar({
      message: 'Expense added successfully',
      duration: 2000,
      actionLabel: 'Dismiss',
      actionIcon: 'close',
      type: 'success',
      position: 'bottom',
      offset: 80,
    });

    setKeyboardHeight(0);
    // Navigate back to the previous screen
    navigation.goBack();
    // Invalidate the query to refetch expenses
    queryCLient.invalidateQueries({
      queryKey: ['expenses'],
    });
  }

  // Set default date and time
  useEffect(() => {
    setDatetime(new Date())
  }, [])

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
            amount={amount}
            setAmount={setAmount}
          />
        </View>
        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Categories
          </ThemedText>
          <CategoriesInput
            category={category}
            setCategory={setCategory}
            categories={categories}
          />
        </View>
        {/* Notes */}
        <View style={styles.notesContainer}>
          <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
            Notes
          </ThemedText>
          <NotesInput
            note={description}
            setNote={setDescription}
          />
        </View>
        {/* Payment Method */}
        <View style={styles.notesContainer}>
          <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
            Payment Method
          </ThemedText>
          <PaymentMethodInput paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />
        </View>
        {/* Date & Time */}
        <View style={styles.datetimeContainer}>
          <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
            Date & Time
          </ThemedText>
          <View style={styles.datetimeMain}>
            <DateInput datetime={datetime} setDatetime={setDatetime} style={styles.datetimeInputContainer} />
            <TimeInput datetime={datetime} setDatetime={setDatetime} style={styles.datetimeInputContainer} />
          </View>
        </View>

      </View>


      {/* Confirm Button */}
      {!isSnackbarVisible && <ConfirmButton onPress={handleAddExpense} keyboardHeight={keyboardHeight} />}

      {/* Error Snackbar */}
      <CustomSnackbar
        usePortal
        visible={isSnackbarVisible}
        onDismiss={onDismissSnackBar}
        duration={2000}
        style={styles.snackbar}
        action={{
          label: 'Dismiss',
          icon: 'close',
        }}
        type='error'
        position='bottom'
        offset={keyboardHeight}
      >
        {errorText}
      </CustomSnackbar>
    </View>
  );
}