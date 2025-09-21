import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { StyleSheet, View } from "react-native";
import { Icon } from "react-native-paper";
import { ThemedText } from "../base/ThemedText";

interface SettingSectionProps {
    icon: string;
    title: string;
    description: string;
    children: React.ReactNode;
}

const SettingSection = ({ icon, title, description, children }: SettingSectionProps) => {
    const { colors } = useAppTheme();
    const styles = StyleSheet.create({
        sectionContainer: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            elevation: 2,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        sectionHeader: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
            gap: 12,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: "600",
            color: colors.primary,
        },
        descriptionText: {
            color: colors.muted,
            fontSize: 14,
            lineHeight: 20,
            marginBottom: 16,
        },
    });

    return (
        <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
                <Icon
                    source={icon}
                    size={24}
                    color={colors.primary}
                />
                <ThemedText style={styles.sectionTitle}>
                    {title}
                </ThemedText>
            </View>
            <ThemedText style={styles.descriptionText}>
                {description}
            </ThemedText>
            {children}
        </View>
    );
};

export default SettingSection;
