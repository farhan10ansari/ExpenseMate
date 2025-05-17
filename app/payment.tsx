import { ThemedText } from '@/components/base/ThemedText';
import { useLocalization } from '@/hooks/useLocalization';
import { extractDateTime } from '@/lib/functions';
import useCategoriesStore, { AddCategory, getCategoryRows } from '@/stores/useCategoriesStore';
import usePaymentStore from '@/stores/usePaymentStore';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { SingleChange } from 'react-native-paper-dates/lib/typescript/Date/Calendar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function PaymentScreen() {
  const { uses24HourClock } = useLocalization()

  const { colors } = useAppTheme();
  const inputRef = useRef<TextInput>(null);
  // payment store
  const amount = usePaymentStore((state) => state.amount);
  const setAmount = usePaymentStore((state) => state.setAmount);
  const category = usePaymentStore((state) => state.category);
  const setCategory = usePaymentStore((state) => state.setCategory);
  const description = usePaymentStore((state) => state.description);
  const setDescription = usePaymentStore((state) => state.setDescription);
  const datetime = usePaymentStore((state) => state.datetime);
  const setDatetime = usePaymentStore((state) => state.setDatetime);

  //datetime picker
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

  // categories store
  const categories = useCategoriesStore((state) => state.categories);

  const styles = StyleSheet.create({
    container: {
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    amountContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: colors.primary,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    input: {
      color: colors.text,
      backgroundColor: "transparent",
      borderRadius: 10,
      fontSize: 60,
    },
    sectionTitle: {
      color: colors.muted,
      width: '100%',
      textAlign: 'center',
      marginBottom: 10
    },
    categoriesContainer: {
      marginTop: 20,
      gap: 2,
    },
    categoriesMain: {
      flexDirection: 'column',
      gap: 10,
    },
    categoryRow: {
      flexDirection: 'row',
      gap: 10,
    },
    categoryButtonStyle: {
      borderRadius: 10,
      borderColor: colors.primary,
    },
    categoryButtonLabelStyle: {
      marginVertical: 8,
      marginHorizontal: 10,
    },
    notesContainer: {
      marginTop: 20,
    },
    notesInput: {
      backgroundColor: colors.background,
      padding: 10,
      color: colors.text,
      borderRadius: 10,
      borderColor: colors.primary,
      borderWidth: 1,
    },
    datetimeContainer: {
      marginTop: 20,
    },
    datetimeButton: {
      borderRadius: 20,
      borderColor: colors.primary,
      borderWidth: 1,
    }
  });

  const onConfirmDate: SingleChange = useCallback(
    (params) => {
      // setDatetime(params.date);
      if (!params.date) {
        setDatePickerVisibility(false);
        return;
      }
      const date = new Date(datetime ?? new Date());
      date.setFullYear(params.date.getFullYear());
      date.setMonth(params.date.getMonth());
      date.setDate(params.date.getDate());
      setDatetime(date);
      setDatePickerVisibility(false);
    }, [datetime, setDatetime]);

  const onDismissDate = useCallback(() => {
    setDatePickerVisibility(false);
  }, [setDatePickerVisibility]);

  const onConfirmTime = useCallback((params: {
    hours: number;
    minutes: number;
  }) => {
    setTimePickerVisibility(false);
    const date = new Date(datetime ?? new Date());
    date.setHours(params.hours);
    date.setMinutes(params.minutes);
    date.setSeconds(0);
    setDatetime(date);
  }, [datetime, setDatetime]);

  const onDismissTime = useCallback(() => {
    setTimePickerVisibility(false);
  }, [setTimePickerVisibility]);


  useEffect(() => {
    setDatetime(new Date())
  }, [])


  const { date, time } = extractDateTime(datetime ?? new Date(), uses24HourClock);
  const categoryRows = getCategoryRows(categories);

  return (
    <View style={styles.container}>
      <SheetGrabber />
      {/* Amount */}
      <Pressable style={styles.amountContainer} onPress={() => inputRef.current?.focus()}>
        <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
          Amount
        </ThemedText>
        <View style={styles.inputContainer}>
          <FontAwesome name="rupee" size={20} color={colors.text} />
          <TextInput
            // autoFocus
            ref={inputRef}
            style={styles.input}
            placeholderTextColor={colors.muted}
            keyboardType="numeric"
            value={amount === 0 ? "" : amount.toString()}
            onChangeText={(text) => {
              if (text === '') {
                setAmount(0);
                return;
              }
              const parsedAmount = parseFloat(text);
              setAmount(parsedAmount);
            }}
            placeholder="0"
            maxLength={8}
            cursorColor={colors.primary}
          />
        </View>
      </Pressable>
      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
          Categories
        </ThemedText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoriesMain}>
            {categoryRows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.categoryRow}>
                {row.map((c) => (
                  <Button
                    compact
                    key={c.name}
                    icon={c.icon}
                    mode={c.name === category ? 'contained' : 'outlined'}
                    style={styles.categoryButtonStyle}
                    labelStyle={styles.categoryButtonLabelStyle}
                    onPress={() => {
                      setCategory(c.name);
                    }}
                  >
                    {c.name}
                  </Button>
                ))}
                {
                  rowIndex === categoryRows.length - 1 && (
                    <Button
                      compact
                      icon={AddCategory.icon}
                      mode='outlined'
                      style={[styles.categoryButtonStyle, {
                        borderColor: colors.muted
                      }]}
                      labelStyle={styles.categoryButtonLabelStyle}
                      onPress={() => { }}
                      // disabled
                      textColor={colors.muted}

                    >{AddCategory.name}
                    </Button>)
                }
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
      {/* Notes */}
      <View style={styles.notesContainer}>
        <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
          Notes
        </ThemedText>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={styles.notesInput}
          placeholder="Add a note"
          placeholderTextColor={colors.muted}
          multiline
          numberOfLines={4}
          cursorColor={colors.primary}
        />
      </View>
      {/* Date & Time */}
      <View style={styles.datetimeContainer}>
        <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
          Date & Time
        </ThemedText>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{
            flex: 1,
          }}>
            <Button
              icon="calendar"
              mode="outlined"
              onPress={() => setDatePickerVisibility(true)}
              style={styles.datetimeButton}
            >
              {datetime ? date : "Set date"}
            </Button>
            <SafeAreaProvider>
              <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                <DatePickerModal
                  locale="en"
                  mode="single"
                  visible={isDatePickerVisible}
                  onConfirm={onConfirmDate}
                  onDismiss={onDismissDate}
                  date={datetime}
                  animationType='slide'
                  saveLabel="Save"
                  placeholder='Select date'
                  label="Select date"
                />
              </View>
            </SafeAreaProvider>

          </View>
          <View style={{
            flex: 1,
          }}>
            <Button
              icon="clock"
              mode="outlined"
              onPress={() => setTimePickerVisibility(true)}
              style={styles.datetimeButton}
            >
              {datetime ? time : "Set time"}
            </Button>
            <SafeAreaProvider>
              <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
                <TimePickerModal
                  locale="en"
                  visible={isTimePickerVisible}
                  onConfirm={onConfirmTime}
                  onDismiss={onDismissTime}
                  hours={datetime?.getHours()}
                  minutes={datetime?.getMinutes()}
                  animationType='slide'
                  use24HourClock={uses24HourClock}
                  label="Select time"
                />
              </View>
            </SafeAreaProvider>

          </View>
        </View>
      </View>
    </View>
  );
}

const SheetGrabber = () => {
  const { colors } = useAppTheme();
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginBottom: 12,
    },
    grabber: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.muted,
      opacity: 0.6,
    },
  });

  return (
    Platform.OS === 'android' && (
      <View style={styles.container}>
        <View
          style={styles.grabber}
        />
      </View>
    )
  )
}