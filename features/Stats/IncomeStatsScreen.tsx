import CustomScreenHeader from "@/components/main/CustomScreenHeader";
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

export default function IncomeStatsScreen() {
    const { colors } = useAppTheme();
    const incomesPeriod = useStatsStore((state) => state.period);
    const insets = useSafeAreaInsets();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const queryClient = useQueryClient();

    // Income stats query
    const { data: incomeStats } = useQuery({
        queryKey: ['insights', 'income-stats-in-a-period', incomesPeriod.value],
        queryFn: () => getIncomeStatsByPeriod(incomesPeriod.value),
    });

    const handleRefresh = async () => {
        setIsRefreshing(true);
        try {
            await queryClient.refetchQueries({ queryKey: ['insights'] });
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <ScreenWrapper
            header={<CustomScreenHeader title="Income Stats" showBackButton />}
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
                <SourceBreakdownChart data={incomeStats?.sources}
                />
            </View>
        </ScreenWrapper>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 10,
    }
});