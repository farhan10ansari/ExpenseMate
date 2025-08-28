import { ThemedText } from "@/components/base/ThemedText";
import { PeriodExpenseStats } from "@/lib/types";
import styles from "./styles";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import StatsCard from "./components/StatsCard";
import { AntDesign, FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { useExpenseCategoryMapping } from "@/stores/useExpenseCategoriesStore";

type Props = {
    expenseStats?: PeriodExpenseStats;
    showTitle?: boolean;
}


export default function ExpenseStats({ expenseStats, showTitle = false }: Props) {
    const { colors } = useAppTheme();
    const categoryMapping = useExpenseCategoryMapping()


    const topCategory = expenseStats?.topCategory
        ? categoryMapping[expenseStats?.topCategory] : null

    return (
        <View style={styles.section} >
            {showTitle && (
                <ThemedText style={[{ fontSize: 18, fontWeight: 'bold', color: colors.text }]}>
                    Expense Statistics
                </ThemedText>
            )}
            <View style={styles.row}>
                <StatsCard
                    title="Total Expenses"
                    prefix={<FontAwesome name="rupee" size={18} color={colors.onPrimary} />}
                    value={expenseStats?.total ?? 0}
                    icon={<FontAwesome name="rupee" size={24} color={colors.onPrimary} />}
                    backgroundColor={colors.primary}
                    textColor={colors.onPrimary}
                />
                <StatsCard
                    title="Expense Count"
                    value={expenseStats?.count ?? 0}
                    icon={<AntDesign name="minuscircleo" size={20} color={colors.tertiary} />}
                    textColor={colors.tertiary}
                />
            </View>
            <View style={styles.row}>
                <StatsCard
                    title="Daily Avg"
                    prefix={<FontAwesome name="rupee" size={18} color={colors.text} />}
                    value={expenseStats?.avgPerDay ?? 0}
                    icon={<MaterialIcons name="trending-up" size={24} color={colors.tertiary} />}
                    textColor={colors.text}
                />
                <StatsCard
                    title="Top Income Source"
                    titleStyle={{
                        fontSize: 12
                    }}
                    value={topCategory?.label ?? 'No data'}
                    icon={<MaterialCommunityIcons name="source-branch" size={24} color={colors.tertiary} />}
                    textColor={colors.text}
                />
            </View>
            <StatsCard
                title="Max/Min Spend"
                value={
                    <>
                        <FontAwesome name="rupee" size={18} color={colors.text} />
                        {expenseStats?.max ?? 0}/
                        <FontAwesome name="rupee" size={18} color={colors.text} />
                        {expenseStats?.min ?? 0}
                    </>
                }
                icon={<MaterialCommunityIcons name="chart-timeline-variant" size={24} color={colors.tertiary} />}
                textColor={colors.text}
            />
        </View>
    )
}
