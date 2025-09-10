import { Income, Category } from "@/lib/types";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/base/ThemedText";
import CustomChip from "@/components/ui/CustomChip";
import { memo } from "react";
import { extractDateLabel, extractTimeString } from "@/lib/functions";
import { useLocalization } from "@/hooks/useLocalization";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Color from 'color';
import { useIncomeSourceMapping } from "@/contexts/CategoryDataProvider";

type IncomeCardProps = {
    income: Income;
    onPress?: (id: number) => void;
};


function IncomeCard({ income, onPress }: IncomeCardProps) {
    const { colors } = useAppTheme();
    const { uses24HourClock } = useLocalization();

    // Get the source mapping
    const sourceMapping = useIncomeSourceMapping()

    const formattedDate = extractDateLabel(income.dateTime);
    const formattedTime = extractTimeString(income.dateTime, uses24HourClock);

    // Lookup the source definition (icon, label, color) by income.source (string)
    const sourceDef = sourceMapping.get(income.source) as Category ?? {
        name: income.source,
        label: income.source,
        icon: 'help',
        color: colors.error,
        deletable: false,
        enabled: true,
    };

    const styles = StyleSheet.create({
        wrapper: {
            borderRadius: 12,
            overflow: "hidden",
        },
        card: {
            height: 80, // Reduced from 100 to 80
            paddingVertical: 12, // More balanced vertical padding
            paddingHorizontal: 16, // More balanced horizontal padding
            borderWidth: 1,
            borderRadius: 12,
            borderColor: colors.border,
            backgroundColor: Color(colors.card).alpha(0.6).rgb().string(),
            justifyContent: "space-between", // Better space distribution
        },
        topRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        amountContainer: {
            flexDirection: "row",
            alignItems: "center", // Changed from "center" to "baseline" for better alignment
            gap: 4, // Reduced from 5 to 4

        },
        amountText: {
            fontWeight: "bold",
            fontSize: 20, // Reduced from 24 to 20
            color: colors.tertiary,
            lineHeight: 20, // Explicit line height for consistent alignment
        },
        chipsContainer: {
            flexDirection: "row",
            gap: 6, // Reduced from 8 to 6
        },
        dateText: {
            fontSize: 12, // Reduced from 12 to 11
            color: "#666",
            lineHeight: 14, // Tight line height for compact date text
        },
    });

    const handleOnPress = () => {
        if (onPress && income.id) onPress(income.id)
    }

    return (
        <View style={styles.wrapper}>
            <Pressable
                onPress={handleOnPress}
                android_ripple={{ color: colors.rippleTertiary }}
                style={styles.card}
            >
                <View style={styles.topRow}>
                    <View style={styles.amountContainer}>
                        <FontAwesome name="rupee" size={20} color={colors.tertiary} />
                        <ThemedText type="title" style={styles.amountText}>
                            {income.amount}
                        </ThemedText>
                    </View>
                    <View style={styles.chipsContainer}>
                        <CustomChip
                            size="small"
                            variant={sourceDef.color}
                            icon={sourceDef.icon}
                            label={sourceDef.label}
                        />
                        {income.recurring && (
                            <CustomChip
                                size="small"
                                variant="secondary"
                                icon="repeat"
                                label="Recurring"
                            />
                        )}
                    </View>
                </View>
                <View>
                    <ThemedText type="default" style={styles.dateText}>
                        {formattedDate} • {formattedTime}
                    </ThemedText>
                </View>
            </Pressable>
        </View>
    );
}

export default memo(IncomeCard)
