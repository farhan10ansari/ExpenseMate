import { ColorType } from "@/lib/types";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { NativeSyntheticEvent, StyleSheet, TextInput, TextInputFocusEventData } from "react-native";

type NotesInputProps = {
    note: string;
    setNote: (description: string) => void;
    onFocus?: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void);
    onBlur?: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void);
    colorType?: ColorType;
};

export default function NotesInput({ note, setNote, onFocus, onBlur, colorType = "primary" }: NotesInputProps) {
    const { colors } = useAppTheme();

    const styles = StyleSheet.create({
        notesInput: {
            backgroundColor: colors.background,
            padding: 10,
            color: colors.text,
            borderRadius: 10,
            borderColor: colors[colorType],
            borderWidth: 1,
        },
    });

    return (
        <TextInput
            value={note}
            onChangeText={setNote}
            style={styles.notesInput}
            placeholder="Add a note"
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={4}
            cursorColor={colors[colorType]}
            onFocus={onFocus}
            onBlur={onBlur}
        />
    )
}