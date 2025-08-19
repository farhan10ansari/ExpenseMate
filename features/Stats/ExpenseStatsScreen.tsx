import { ScreenWrapper } from "@/components/main/ScreenWrapper";
import { getExpenseStatsByPeriod } from "@/repositories/ExpenseRepo";
import useStatsStore from "@/stores/useStatsStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import PeriodCard from "./components/PeriodCard";
import ExpenseStats from "./ExpenseStats";
import { ThemedText } from "@/components/base/ThemedText";
import CategoryBreakdownChart from "./components/CategoryBreakdownChart";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import statsStyles from "./styles";
import ExpenseCategoryBreakdownCard from "./components/ExpenseCategoriesBreakdownData";

export default function ExpenseStatsScreen() {
    const { colors } = useAppTheme();
    const expensesPeriod = useStatsStore((state) => state.period);
    const insets = useSafeAreaInsets();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const queryClient = useQueryClient();

    // Expense stats query
    const { data: expenseStats } = useQuery({
        queryKey: ['stats', 'expense', 'stats-in-a-period', expensesPeriod.value],
        queryFn: () => getExpenseStatsByPeriod(expensesPeriod.value),
    });

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await queryClient.refetchQueries({ queryKey: ['stats', 'expense'] });
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <ScreenWrapper
            background="background"
            withScrollView
            isRefreshing={isRefreshing}
            onRefresh={handleRefresh}
            contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 16 }]}
        >
            <PeriodCard />
            <ExpenseStats expenseStats={expenseStats} />
            <View style={statsStyles.section}>
                <ThemedText style={[statsStyles.sectionTitle, { color: colors.text }]}>
                    Breakdowns
                </ThemedText>
                <ExpenseCategoryBreakdownCard
                    data={expenseStats?.categories}
                    title="Expense Categories"
                />
                <CategoryBreakdownChart data={expenseStats?.categories}
                />
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 20,
    }
});