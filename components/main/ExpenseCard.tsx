import { Expense } from "@/db/schema";
import { paymentMethodsMapping } from "@/lib/constants";
import useCategoriesStore from "@/stores/useCategoriesStore";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/base/ThemedText";
import CustomChip from "@/components/ui/CustomChip";

type ExpenseCardProps = {
    expense: Expense;
    onPress?: (id: number) => void;
};

export default function ExpenseCard({ expense, onPress }: ExpenseCardProps) {
    const { colors, dark } = useAppTheme();

    // Get the category mapping from the categories store
    const categoryMapping = useCategoriesStore((state) => state.categoryMapping);

    const formattedDate = new Date(expense.dateTime).toLocaleDateString();
    const formattedTime = new Date(expense.dateTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });

    const styles = StyleSheet.create({
        wrapper: {
            marginVertical: 8,
            borderRadius: 12,
            overflow: "hidden",
        },
        card: {
            padding: 16,
            borderWidth: 1,
            borderRadius: 12,
            borderColor: colors.border,
            backgroundColor: colors.card.replace('rgb', 'rgba').replace(')', ', 0.6)'), // Adjust opacity for better visibility
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
            color: colors.primary
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
        if (onPress && expense.id) onPress(expense.id)
    }

    return (
        <View style={styles.wrapper}>
            <Pressable
                onPress={handleOnPress}
                android_ripple={{ color: dark ? colors.primary100 : colors.primary10 }}
                style={styles.card}
            >
                <View style={styles.topRow}>
                    <View style={styles.amountContainer}>
                        <MaterialCommunityIcons
                            name="currency-inr"
                            size={20}
                            color={colors.primary}
                        />
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
                <View style={styles.bottomRow}>
                    <ThemedText type="default" style={styles.dateText}>
                        {formattedDate} • {formattedTime}
                    </ThemedText>
                </View>
            </Pressable>
        </View>
    );
}
