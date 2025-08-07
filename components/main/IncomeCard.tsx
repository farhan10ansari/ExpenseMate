import { Income } from "@/db/schema";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/base/ThemedText";
import CustomChip from "@/components/ui/CustomChip";
import { memo } from "react";
import { extractDateLabel, extractTimeString } from "@/lib/functions";
import { useLocalization } from "@/hooks/useLocalization";
import useIncomeSourcesStore from "@/stores/useIncomeSourcesStore";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Color from 'color';

// If you want to speed up lookups by name:
// const sourceMapping = Object.fromEntries(DefaultIncomeCategories.map(cat => [cat.name, cat]));

type IncomeCardProps = {
    income: Income;
    onPress?: (id: number) => void;
};

function IncomeCard({ income, onPress }: IncomeCardProps) {
    const { colors } = useAppTheme();
    const { uses24HourClock } = useLocalization();

    // Get the source mapping from the income sources store
    const sourceMapping = useIncomeSourcesStore((state) => state.sourceMapping);

    const formattedDate = extractDateLabel(income.dateTime);
    const formattedTime = extractTimeString(income.dateTime, uses24HourClock);

    // Lookup the source definition (icon, label, color) by income.source (string)
    const sourceDef = sourceMapping[income.source];

    const styles = StyleSheet.create({
        wrapper: {
            borderRadius: 12,
            overflow: "hidden",
        },
        card: {
            height: 100,
            padding: 16,
            borderWidth: 1,
            borderRadius: 12,
            borderColor: colors.border,
            backgroundColor: Color(colors.card).alpha(0.6).rgb().string(), // semi-transparent card
        },
        topRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        amountContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
        },
        amountText: {
            fontWeight: "bold",
            fontSize: 24,
            color: colors.tertiary
        },
        chipsContainer: {
            flexDirection: "row",
            gap: 8,
        },
        bottomRow: {
            marginTop: 10,
        },
        dateText: {
            fontSize: 12,
            color: "#666",
        },
    });

    const handleOnPress = () => {
        if (onPress && income.id) onPress(income.id)
    }

    return (
        <View style={styles.wrapper}>
            <Pressable
                onPress={handleOnPress}
                android_ripple={{ color: Color(colors.tertiary).alpha(0.12).rgb().string() }}
                style={styles.card}
            >
                <View style={styles.topRow}>
                    <View style={styles.amountContainer}>
                        <FontAwesome name="rupee" size={24} color={colors.tertiary} />
                        <ThemedText type="title" style={styles.amountText}>
                            {income.amount}
                        </ThemedText>
                    </View>
                    <View style={styles.chipsContainer}>
                        <CustomChip
                            size="small"
                            variant="tertiary"
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
                <View style={styles.bottomRow}>
                    <ThemedText type="default" style={styles.dateText}>
                        {formattedDate} • {formattedTime}
                    </ThemedText>
                </View>
            </Pressable>
        </View>
    );
}

export default memo(IncomeCard)
