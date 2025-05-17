import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { StyleSheet, TextInput } from "react-native";

type NotesInputProps = {
    note: string;
    setNote: (description: string) => void;
};

export default function NotesInput({ note, setNote }: NotesInputProps) {
    const { colors } = useAppTheme();

    const styles = StyleSheet.create({
        notesInput: {
            backgroundColor: colors.background,
            padding: 10,
            color: colors.text,
            borderRadius: 10,
            borderColor: colors.primary,
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
            cursorColor={colors.primary}
        />
    )
}