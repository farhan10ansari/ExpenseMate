import { Expense } from "@/db/schema";
import { paymentMethodsMapping } from "@/lib/constants";
import { useExpenseCategoryMapping } from "@/contexts/CategoryDataProvider";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/base/ThemedText";
import CustomChip from "@/components/ui/CustomChip";
import { memo } from "react";
import { extractDateLabel, extractTimeString } from "@/lib/functions";
import { useLocalization } from "@/hooks/useLocalization";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Color from "color";

type ExpenseCardProps = {
    expense: Expense;
    onPress?: (id: number) => void;
};

function ExpenseCard({ expense, onPress }: ExpenseCardProps) {
    const { colors } = useAppTheme();
    const { uses24HourClock } = useLocalization()

    // Get the category mapping from the categories store
    const categoryMapping = useExpenseCategoryMapping()


    const formattedDate = extractDateLabel(expense.dateTime)
    const formattedTime = extractTimeString(expense.dateTime, uses24HourClock)

    const styles = StyleSheet.create({
        wrapper: {
            borderRadius: 12,
            overflow: "hidden",
        },
        card: {
            height: 80,
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderRadius: 12,
            borderColor: colors.border,
            backgroundColor: Color(colors.card).alpha(0.6).rgb().string(),
            justifyContent: "space-between",
        },
        topRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        amountContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
        },
        amountText: {
            fontWeight: "bold",
            fontSize: 20,
            color: colors.primary,
            lineHeight: 20,
        },
        chipsContainer: {
            flexDirection: "row",
            gap: 6,
        },
        dateText: {
            fontSize: 12,
            color: "#666",
            lineHeight: 14,
        },
    });

    const handleOnPress = () => {
        if (onPress && expense.id) onPress(expense.id)
    }

    return (
        <View style={styles.wrapper}>
            <Pressable
                onPress={handleOnPress}
                android_ripple={{ color: colors.ripplePrimary }}
                style={styles.card}
            >
                <View style={styles.topRow}>
                    <View style={styles.amountContainer}>
                        <FontAwesome name="rupee" size={20} color={colors.primary} />
                        <ThemedText type="title" style={styles.amountText}>
                            {expense.amount}
                        </ThemedText>
                    </View>
                    <View style={styles.chipsContainer}>
                        <CustomChip
                            size="small"
                            variant="primary"
                            icon={categoryMapping?.[expense.category]?.icon}
                            label={categoryMapping?.[expense.category]?.label}
                        />
                        {expense.paymentMethod && (
                            <CustomChip
                                size="small"
                                variant="tertiary"
                                icon={paymentMethodsMapping?.[expense.paymentMethod]?.icon}
                                label={paymentMethodsMapping?.[expense.paymentMethod]?.label}
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

export default memo(ExpenseCard)
