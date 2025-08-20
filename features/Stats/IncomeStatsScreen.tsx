import { ScreenWrapper } from "@/components/main/ScreenWrapper";
import { getIncomeStatsByPeriod } from "@/repositories/IncomeRepo";
import useStatsStore from "@/stores/useStatsStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import PeriodCard from "./components/PeriodCard";
import IncomeStats from "./IncomeStats";
import { ThemedText } from "@/components/base/ThemedText";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import statsStyles from "./styles";
import SourceBreakdownChart from "./components/SourceBreakdownChart";
import IncomeSourcesBreakdownCard from "./components/IncomeSourcesBreakdownData";

export default function IncomeStatsScreen() {
    const { colors } = useAppTheme();
    const incomesPeriod = useStatsStore((state) => state.period);
    const insets = useSafeAreaInsets();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const queryClient = useQueryClient();

    // Income stats query
    const { data: incomeStats } = useQuery({
        queryKey: ['stats', 'income', 'stats-in-a-period', incomesPeriod],
        queryFn: () => getIncomeStatsByPeriod(incomesPeriod),
    });

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await queryClient.refetchQueries({ queryKey: ['stats', 'income'] });
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
            <IncomeStats incomeStats={incomeStats} />
            <View style={statsStyles.section}>
                <ThemedText style={[statsStyles.sectionTitle, { color: colors.text }]}>
                    Breakdowns
                </ThemedText>
                <IncomeSourcesBreakdownCard
                    data={incomeStats?.sources}
                    title="Income Sources"
                />
                <SourceBreakdownChart data={incomeStats?.sources}
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