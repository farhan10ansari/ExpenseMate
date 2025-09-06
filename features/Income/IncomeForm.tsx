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
import { useEnabledIncomeSources } from '@/stores/useIncomeSourcesStore';
import { useIsFocused } from '@react-navigation/native';
import { useSnackbarState } from '@/contexts/GlobalSnackbarProvider';
// import RecurringInput from '@/components/input/RecurringInput';
type IncomeFormProps = {
    onSubmit?: (income: IncomeData) => void;
    type?: 'create' | 'edit';
}

export default function IncomeForm({ onSubmit, type = "create" }: IncomeFormProps) {
    const { colors } = useAppTheme();
    const { keyboardHeight } = useKeyboardHeight();
    const isFocused = useIsFocused()
    const globalSnackbar = useSnackbarState()

    const income = useIncomeStore((state) => state.income);
    const updateIncome = useIncomeStore((state) => state.updateIncome);
    const sources = useEnabledIncomeSources()

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
                    <ThemedText type='defaultSemiBold' style={[styles.sectionTitle, { color: colors.muted }]}>
                        Amount
                    </ThemedText>
                    <AmountInput
                        amount={income.amount}
                        setAmount={(amount) => updateIncome({ amount })}
                        colorType='tertiary'
                    />
                </View>
                {/* Source */}
                <View style={styles.inputSection}>
                    <ThemedText type="defaultSemiBold" style={[styles.sectionTitle, { color: colors.muted }]}>
                        Source
                    </ThemedText>
                    <CategoriesInput
                        categories={sources}
                        category={income.source}
                        setCategory={(category) => updateIncome({ source: category })}
                        colorType='tertiary'
                        type='income'
                    />
                </View>
                {/* Description (Notes) */}
                <View style={styles.inputSection}>
                    <ThemedText type='defaultSemiBold' style={[styles.sectionTitle, { color: colors.muted }]}>
                        Description
                    </ThemedText>
                    <NotesInput
                        note={income.description}
                        setNote={(description => updateIncome({ description }))}
                        colorType='tertiary'
                    />
                </View>
                {/* Recurring (add a switch or checkbox if desired) */}
                {/* <View style={styles.inputSection}>
                    <RecurringInput
                        value={!!income.recurring}
                        onValueChange={(val) => updateIncome({ recurring: val })}
                        label="Recurring Income"
                    />
                </View> */}

                {/* Date & Time */}
                <View style={styles.inputSection}>
                    <ThemedText type='defaultSemiBold' style={[styles.sectionTitle, { color: colors.muted }]}>
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
            {isFocused && !globalSnackbar && (
                <ConfirmButton
                    onPress={handleSubmit}
                    keyboardHeight={keyboardHeight}
                    type={type}
                />
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        flex: 1,
    },
    sectionTitle: {
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
