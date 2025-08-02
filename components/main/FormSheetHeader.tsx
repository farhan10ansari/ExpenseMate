import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { StyleSheet, Text, View } from "react-native";
import { Divider, IconButton } from "react-native-paper";
import SheetGrabber from "../ui/SheetGrabber";

type FormSheetHeaderProps = {
    title: string;
    onClose?: () => void; // Callback for close action
};

export default function FormSheetHeader({ title, onClose }: FormSheetHeaderProps) {
    const { colors } = useAppTheme();
    const styles = StyleSheet.create({
        headerContainer: {
            paddingHorizontal: 24,
            paddingBottom: 8,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        headerText: {
            fontSize: 22,
            fontWeight: 'bold',
            // color: colors.primary,
            color: colors.text,
            flex: 1,
            textAlign: 'left',
        }
    });

    return (
        <>
            <View style={styles.headerContainer}>
                <SheetGrabber />
                <View style={styles.row}>
                    <Text style={styles.headerText}>{title}</Text>
                    {onClose && (
                        <IconButton
                            icon="close"
                            size={15}
                            accessibilityLabel="Close"
                            onPress={onClose}
                            style={{ marginRight: -8, marginLeft: 8 }}
                            mode="contained-tonal"
                        />
                    )}
                </View>
            </View>
            <Divider />
        </>
    );
}
