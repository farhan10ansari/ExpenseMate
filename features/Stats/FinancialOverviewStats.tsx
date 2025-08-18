import { ThemedText } from "@/components/base/ThemedText";
import styles from "./styles";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import StatsCard from "./components/StatsCard";
import { FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { getFinancialSummary } from "@/lib/helpers";
import { PeriodExpenseStats, PeriodIncomeStats } from "@/lib/types";
import { useMemo } from "react";
import usePersistentAppStore from "@/stores/usePersistentAppStore";
import { IconButton } from "react-native-paper";

type Props = {
    expenseStats?: PeriodExpenseStats,
    incomeStats?: PeriodIncomeStats
}

export default function FinancialSummaryStats({ expenseStats, incomeStats }: Props) {
    const { colors } = useAppTheme();
    const showNegativeStats = usePersistentAppStore((state) => state.uiFlags.showNegativeStats);

    // Financial summary query
    const financialSummary = useMemo(() => {
        if (!expenseStats || !incomeStats) return

        return getFinancialSummary(expenseStats, incomeStats)
    }, [expenseStats, incomeStats])

    // if no financial summary or negative stats are hidden and net income is negative, return null
    if (!financialSummary || (showNegativeStats === false && financialSummary.netIncome < 0)) return null;
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
                    description={
                        <View>
                            <ThemedText style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
                                What is Net Income?
                            </ThemedText>
                            <ThemedText style={{ marginBottom: 6 }}>
                                Net income is the difference between <ThemedText style={{ fontWeight: 'bold' }}>total income</ThemedText> and <ThemedText style={{ fontWeight: 'bold' }}>total expenses</ThemedText> for the selected period.
                            </ThemedText>
                            <ThemedText style={{ fontWeight: 'bold' }}>
                                • <ThemedText style={{ fontWeight: 'normal' }}>A <ThemedText style={{ color: colors.primary }}>positive</ThemedText> value means you earned more than you spent.</ThemedText>
                            </ThemedText>
                            <ThemedText style={{ fontWeight: 'bold' }}>
                                • <ThemedText style={{ fontWeight: 'normal' }}>A <ThemedText style={{ color: colors.error }}>negative</ThemedText> value means your expenses exceeded your income.</ThemedText>
                            </ThemedText>
                            <ThemedText style={{ marginTop: 6, opacity: 0.8, color: colors.error }}>
                                {"It may also indicate that you haven't added your income yet."}
                            </ThemedText>
                            <ThemedText style={{ marginTop: 6, opacity: 0.8 }}>
                                Net income helps you quickly assess whether you are effectively managing your money or may need to adjust your spending or track your income more carefully.
                            </ThemedText>
                        </View>
                    }
                    infoIcon={
                        financialSummary?.netIncome < 0 ? (
                            <IconButton
                                icon="alert"
                                size={20}
                                iconColor={colors.onError}
                                style={{ margin: 0 }}
                            />
                        ) : undefined
                    }
                />
                <StatsCard
                    title="Savings Rate"
                    value={financialSummary?.savingsRate ?? 0}
                    suffix="%"
                    icon={<MaterialCommunityIcons name="piggy-bank" size={24} color={colors.tertiary} />}
                    textColor={colors.tertiary}
                    description={
                        <View>
                            <ThemedText style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>
                                What is Savings Rate?
                            </ThemedText>
                            <ThemedText style={{ marginBottom: 6 }}>
                                Savings rate shows what percentage of your <ThemedText style={{ fontWeight: 'bold' }}>total income</ThemedText> remains after your expenses.
                            </ThemedText>
                            <ThemedText style={{ fontWeight: 'bold' }}>
                                • <ThemedText style={{ fontWeight: 'normal' }}>A higher rate means you keep more of your money.</ThemedText>
                            </ThemedText>
                            <ThemedText style={{ fontWeight: 'bold' }}>
                                • <ThemedText style={{ fontWeight: 'normal' }}>Track this to see your financial health improve over time.</ThemedText>
                            </ThemedText>
                            <ThemedText style={{ marginTop: 6, opacity: 0.8 }}>
                                {`Example: A savings rate of 20% means you save ₹20 for every ₹100 of income.`}
                            </ThemedText>
                        </View>
                    }
                    infoIconColor={colors.onSurface}
                />

            </View>
        </View>
    )
}
