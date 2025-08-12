import { StyleSheet, Pressable, View } from "react-native";
import { ThemedText } from "@/components/base/ThemedText";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import Color from "color";

interface MonthTabProps {
    month: string;
    count?: number;
    isSelected: boolean;
    onPress: () => void;
}

export default function MonthTab({ month, count, isSelected, onPress }: MonthTabProps) {
    const { colors } = useAppTheme();

    const styles = StyleSheet.create({
        tabWrapper: {
            borderRadius: 18,
            overflow: 'hidden',
            marginRight: 8,
        },
        tabContainer: {
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 18, // Add borderRadius here too
            backgroundColor: isSelected ? colors.primary : colors.surface,
            borderWidth: 1,
            borderColor: isSelected ? colors.primary : colors.outline,
            minWidth: 75,
            alignItems: 'center',
            elevation: isSelected ? 3 : 1,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: isSelected ? 2 : 1 },
            shadowOpacity: isSelected ? 0.25 : 0.1,
            shadowRadius: isSelected ? 3 : 2,
        },
        tabText: {
            fontSize: 13,
            fontWeight: isSelected ? '600' : '500',
            color: isSelected ? colors.onPrimary : colors.onSurface,
            lineHeight: 16,
        },
        countText: {
            fontSize: 11,
            color: isSelected ? colors.onPrimary : colors.onSurfaceVariant,
            marginTop: 2,
            lineHeight: 13,
            opacity: isSelected ? 0.9 : 0.7,
        },
    });

    return (
        <View style={styles.tabWrapper}>
            <Pressable
                style={styles.tabContainer}
                onPress={onPress}
                android_ripple={{
                    color: colors.ripplePrimary,
                    borderless: false,
                }}
            >
                <ThemedText style={styles.tabText}>
                    {month}
                </ThemedText>
                {count !== undefined && (
                    <ThemedText style={styles.countText}>
                        {count} items
                    </ThemedText>
                )}
            </Pressable>
        </View>
    );
}
