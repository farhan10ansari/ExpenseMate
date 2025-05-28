import { Expense } from "@/db/schema";
import { paymentMethodsMapping } from "@/lib/constants";
import useCategoriesStore from "@/stores/useCategoriesStore";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Chip } from "react-native-paper";
import { ThemedText } from "../base/ThemedText";

type ExpenseCardProps = {
    expense: Expense;
};

export default function ExpenseCard({ expense }: ExpenseCardProps) {
    const { colors } = useAppTheme();

    // Get the category mapping from the categories store
    const categoryMapping = useCategoriesStore((state) => state.categoryMapping);

    const formattedDate = new Date(expense.dateTime).toLocaleDateString();
    const formattedTime = new Date(expense.dateTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    const styles = StyleSheet.create({
        card: {
            borderRadius: 12,
            padding: 16,
            marginVertical: 8,
            borderWidth: 1,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
            // opacity: 0.6,
        },
        topRow: {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        },
        amountContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        amountText: {
            fontWeight: "bold",
            fontSize: 24,
        },
        chipsContainer: {
            flexDirection: "row",
            gap: 8,
        },
        chip: {
            borderRadius: 20,
        },
        chipText: {
            fontSize: 10,
            marginVertical: 0,
            marginHorizontal: 2,
        },
        categoryChip: {
            backgroundColor: colors.onPrimary,
            borderColor: colors.primary,
        },
        categoryChipText: {
            color: colors.text,
        },
        paymentMethodChip: {
            backgroundColor: colors.onTertiary,
            borderColor: colors.tertiary,
        },
        paymentMethodChipText: {
            color: colors.tertiary,
        },
        bottomRow: {
            marginTop: 10,
        },
        dateText: {
            fontSize: 12,
            color: "#666",
        },
    });


    return (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.topRow}>
                <View style={styles.amountContainer}>
                    <MaterialCommunityIcons name="currency-inr" size={20} color={colors.primary} />
                    <ThemedText type="title" style={[styles.amountText, { color: colors.primary }]}>
                        {expense.amount}
                    </ThemedText>
                </View>

                <View style={styles.chipsContainer}>
                    <Chip icon={categoryMapping?.[expense.category]?.icon ?? undefined} style={[styles.chip, styles.categoryChip]} textStyle={[styles.chipText, styles.categoryChipText]}>
                        {expense.category?.toLocaleUpperCase()}
                    </Chip>
                    {expense?.paymentMethod &&
                        <Chip icon={paymentMethodsMapping?.[expense.paymentMethod]?.icon} style={[styles.chip, styles.p]} textStyle={[styles.chipText, styles.paymentMethodChipText]}>
                            {expense?.paymentMethod?.toUpperCase()}
                        </Chip>
                    }
                </View>
            </View>

            <View style={styles.bottomRow}>
                <ThemedText type="default" style={styles.dateText}>
                    {formattedDate} • {formattedTime}
                </ThemedText>
            </View>
        </View>
    );
}

