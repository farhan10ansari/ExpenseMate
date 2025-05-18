import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { FontAwesome } from "@expo/vector-icons";
import { useRef } from "react";
import { NativeSyntheticEvent, Pressable, StyleSheet, TextInput, TextInputFocusEventData } from "react-native";

export type AmountInputProps = {
    amount: number;
    setAmount: (amount: number) => void;
    onFocus?: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
    onBlur?: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void)
};

export default function AmountInput({ amount, setAmount, onFocus, onBlur }: AmountInputProps) {
    const { colors } = useAppTheme();

    const inputRef = useRef<TextInput>(null);

    const styles = StyleSheet.create({
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
        },
        input: {
            color: colors.text,
            backgroundColor: "transparent",
            borderRadius: 10,
            fontSize: 60,
        }
    });

    return (
        <Pressable style={styles.inputContainer} onPress={() => inputRef.current?.focus()}>
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
                onFocus={onFocus}
                onBlur={onBlur}
            />
        </Pressable>
    )
}