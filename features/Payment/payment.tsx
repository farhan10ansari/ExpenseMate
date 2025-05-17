import { ThemedText } from '@/components/base/ThemedText';
import SheetGrabber from '@/components/ui/SheetGrabber';
import useCategoriesStore from '@/stores/useCategoriesStore';
import usePaymentStore from '@/stores/usePaymentStore';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import AmountInput from './components/AmountInput';
import CategoriesInput from './components/CategoriesInput';
import DateInput from './components/DateInput';
import NotesInput from './components/NotesInput';
import TimeInput from './components/TimeInput';

export default function PaymentScreen() {
  const { colors } = useAppTheme();

  // Payment store
  const amount = usePaymentStore((state) => state.amount);
  const setAmount = usePaymentStore((state) => state.setAmount);
  const category = usePaymentStore((state) => state.category);
  const setCategory = usePaymentStore((state) => state.setCategory);
  const description = usePaymentStore((state) => state.description);
  const setDescription = usePaymentStore((state) => state.setDescription);
  const datetime = usePaymentStore((state) => state.datetime);
  const setDatetime = usePaymentStore((state) => state.setDatetime);

  // categories store
  const categories = useCategoriesStore((state) => state.categories);

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 10,
      paddingHorizontal: 20,
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
    setDatetime(new Date())
  }, [])


  return (
    <View style={styles.container}>
      <SheetGrabber />
      {/* Amount */}
      <View style={styles.amountContainer}>
        <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
          Amount
        </ThemedText>
        <AmountInput amount={amount} setAmount={setAmount} />
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
        <NotesInput note={description} setNote={setDescription} />
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
  );
}