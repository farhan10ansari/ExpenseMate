import { ThemedText } from '@/components/base/ThemedText';
import useKeyboardHeight from '@/hooks/useKeyboardHeight';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import React, { useEffect } from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { IncomeData, useIncomeStore } from './IncomeStoreProvider';
import AmountInput from '@/components/input/AmountInput';
import CategoriesInput from '@/components/input/CategoriesInput';
import ConfirmButton from '@/components/input/ConfirmButton';
import DateInput from '@/components/input/DateInput';
import NotesInput from '@/components/input/NotesInput';
import TimeInput from '@/components/input/TimeInput';
import { DefaultIncomeCategories } from '@/lib/constants';
type IncomeFormProps = {
    showSubmitButton?: boolean;
    onSubmit?: (income: IncomeData) => void;
    type?: 'create' | 'edit';
}

export default function IncomeForm({ showSubmitButton, onSubmit, type = "create" }: IncomeFormProps) {
    const { colors } = useAppTheme();
    const { keyboardHeight } = useKeyboardHeight();

    const income = useIncomeStore((state) => state.income);
    const updateIncome = useIncomeStore((state) => state.updateIncome);

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
        inputSection: {
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
        if (!income.dateTime) {
            updateIncome({ dateTime: new Date() });
        }
    }, [])

    const handleSubmit = () => onSubmit?.(income);

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }} onTouchStart={() => Keyboard.dismiss()}>
                {/* Amount */}
                <View style={styles.amountContainer}>
                    <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
                        Amount
                    </ThemedText>
                    <AmountInput
                        amount={income.amount}
                        setAmount={(amount) => updateIncome({ amount })}
                    />
                </View>
                {/* Source */}
                <View style={styles.inputSection}>
                    <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                        Source
                    </ThemedText>
                    <CategoriesInput
                        categories={DefaultIncomeCategories}
                        category={income.source}
                        setCategory={(category) => updateIncome({ source: category })}
                    />
                </View>
                {/* Description (Notes) */}
                <View style={styles.inputSection}>
                    <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
                        Description
                    </ThemedText>
                    <NotesInput
                        note={income.description}
                        setNote={(description => updateIncome({ description }))}
                    />
                </View>
                {/* Recurring (add a switch or checkbox if desired) */}
                {/* Receipt (add file picker if needed) */}
                {/* Date & Time */}
                <View style={styles.inputSection}>
                    <ThemedText type='defaultSemiBold' style={styles.sectionTitle}>
                        Date & Time
                    </ThemedText>
                    <View style={styles.datetimeMain}>
                        <DateInput
                            datetime={income.dateTime ?? undefined}
                            setDatetime={(dateTime => updateIncome({ dateTime }))}
                            style={styles.datetimeInputContainer}
                        />
                        <TimeInput
                            datetime={income.dateTime ?? undefined}
                            setDatetime={(dateTime => updateIncome({ dateTime }))}
                            style={styles.datetimeInputContainer}
                        />
                    </View>
                </View>
            </View>
            {/* Confirm Button */}
            {showSubmitButton && (
                <ConfirmButton
                    onPress={handleSubmit}
                    keyboardHeight={keyboardHeight}
                    type={type}
                />
            )}
        </View>
    );
}
