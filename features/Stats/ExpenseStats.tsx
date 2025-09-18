import { ThemedText } from "@/components/base/ThemedText";
import { PeriodExpenseStats } from "@/lib/types";
import styles from "./styles";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import StatsCard from "./components/StatsCard";
import { View } from "react-native";
import { useExpenseCategoryMapping } from "@/contexts/CategoryDataProvider";
import { Icon } from "react-native-paper";

type Props = {
    expenseStats?: PeriodExpenseStats;
    showTitle?: boolean;
    isLoading?: boolean;
}


export default function ExpenseStats({ expenseStats, showTitle = false, isLoading = false }: Props) {
    const { colors } = useAppTheme();
    const categoryMapping = useExpenseCategoryMapping()


    const topCategory = expenseStats?.topCategory
        ? categoryMapping.get(expenseStats?.topCategory) : null

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
                    prefix={<Icon source="currency-inr" size={18} color={colors.onPrimary} />}
                    value={expenseStats?.total ?? 0}
                    icon={<Icon source="currency-inr" size={24} color={colors.onPrimary} />}
                    backgroundColor={colors.primary}
                    textColor={colors.onPrimary}
                    isLoading={isLoading}
                />
                <StatsCard
                    title="Expense Count"
                    value={expenseStats?.count ?? 0}
                    icon={<Icon source="minus-circle-outline" size={20} color={colors.tertiary} />}
                    textColor={colors.tertiary}
                    isLoading={isLoading}
                />
            </View>
            <View style={styles.row}>
                <StatsCard
                    title="Daily Avg"
                    prefix={<Icon source="currency-inr" size={18} color={colors.text} />}
                    value={expenseStats?.avgPerDay ?? 0}
                    icon={<Icon source="trending-up" size={24} color={colors.tertiary} />}
                    textColor={colors.text}
                    isLoading={isLoading}
                />
                <StatsCard
                    title="Top Income Source"
                    titleStyle={{
                        fontSize: 12
                    }}
                    value={topCategory?.label ?? 'No data'}
                    icon={<Icon source="source-branch" size={24} color={colors.tertiary} />}
                    textColor={colors.text}
                    isLoading={isLoading}
                />
            </View>
            <StatsCard
                title="Max/Min Spend"
                value={
                    <>
                        <Icon source="currency-inr" size={18} color={colors.text} />
                        {expenseStats?.max ?? 0}/
                        <Icon source="currency-inr" size={18} color={colors.text} />
                        {expenseStats?.min ?? 0}
                    </>
                }
                icon={<Icon source="chart-timeline-variant" size={24} color={colors.tertiary} />}
                textColor={colors.text}
                isLoading={isLoading}
            />
        </View>
    )
}
