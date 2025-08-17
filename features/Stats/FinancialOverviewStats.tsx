import { ThemedText } from "@/components/base/ThemedText";
import styles from "./styles";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import StatsCard from "./components/StatsCard";
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { getFinancialSummary } from "@/lib/helpers";
import { PeriodExpenseStats } from "@/lib/types";
import { PeriodIncomeStats } from "@/repositories/IncomeRepo";
import { useMemo } from "react";

type Props = {
    expenseStats?: PeriodExpenseStats,
    incomeStats?: PeriodIncomeStats
}

export default function FinancialSummaryStats({ expenseStats, incomeStats }: Props) {
    const { colors } = useAppTheme();

    // Financial summary query
    const financialSummary = useMemo(() => {
        if (!expenseStats || !incomeStats) return

        return getFinancialSummary(expenseStats, incomeStats)
    }, [expenseStats, incomeStats])

    // if no financial summary or income stats are available, return null
    // if (!financialSummary || incomeStats?.total === 0 || financialSummary.netIncome < 0) return null;
    return (
        <View style={styles.section}>
            <ThemedText style={[{ fontSize: 18, fontWeight: 'bold', color: colors.text }]}>
                Financial Overview
            </ThemedText>
            <View style={styles.row}>
                <StatsCard
                    title="Net Income"
                    prefix={<FontAwesome name="rupee" size={18} color={colors.onPrimary} />}
                    value={financialSummary?.netIncome ?? 0}
                    icon={<MaterialIcons name="account-balance-wallet" size={24} color={colors.onPrimary} />}
                    backgroundColor={financialSummary?.netIncome && financialSummary.netIncome >= 0 ? colors.primary : colors.error}
                    textColor={colors.onPrimary}
                    suffix={(financialSummary?.netIncome && financialSummary.netIncome >= 0) ? null : <FontAwesome name="exclamation-triangle" size={18} color={colors.onError} />}
                />
                <StatsCard
                    title="Savings Rate"
                    value={financialSummary?.savingsRate ?? 0}
                    suffix="%"
                    icon={<MaterialCommunityIcons name="piggy-bank" size={24} color={colors.tertiary} />}
                    textColor={colors.tertiary}
                />
            </View>
        </View>
    )
}
