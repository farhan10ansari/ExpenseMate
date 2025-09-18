import { ThemedText } from "@/components/base/ThemedText";
import styles from "./styles";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import StatsCard from "./components/StatsCard";
import { View } from "react-native";
import { PeriodIncomeStats } from "@/lib/types";
import { useIncomeSourceMapping } from "@/contexts/CategoryDataProvider";
import { Icon } from "react-native-paper";

type Props = {
    incomeStats?: PeriodIncomeStats;
    showTitle?: boolean;
    isLoading?: boolean;
}

export default function IncomeStats({ incomeStats, showTitle = false, isLoading = false }: Props) {
    const { colors } = useAppTheme();

    const sourceMapping = useIncomeSourceMapping()

    const topSource = incomeStats?.topSource
        ? sourceMapping.get(incomeStats?.topSource) : null;

    return (
        <View style={styles.section}>
            {showTitle && (
                <ThemedText style={[{ fontSize: 18, fontWeight: 'bold', color: colors.text }]}>
                    Income Statistics
                </ThemedText>
            )

            }
            <View style={styles.row}>
                <StatsCard
                    title="Total Income"
                    prefix={<Icon source="currency-inr" size={18} color={colors.onTertiary} />}
                    value={incomeStats?.total ?? 0}
                    icon={<Icon source="finance" size={24} color={colors.onTertiary} />}
                    backgroundColor={colors.tertiary}
                    textColor={colors.onTertiary}
                    isLoading={isLoading}
                />
                <StatsCard
                    title="Income Count"
                    value={incomeStats?.count ?? 0}
                    icon={<Icon source="plus-circle-outline" size={20} color={colors.tertiary} />}
                    textColor={colors.tertiary}
                    isLoading={isLoading}
                />
            </View>
            <View style={styles.row}>
                <StatsCard
                    title="Daily Avg Income"
                    titleStyle={{
                        fontSize: 12
                    }}
                    prefix={<Icon source="currency-inr" size={18} color={colors.text} />}
                    value={incomeStats?.avgPerDay ?? 0}
                    icon={<Icon source="trending-up" size={24} color={colors.tertiary} />}
                    textColor={colors.text}
                    isLoading={isLoading}
                />
                <StatsCard
                    title="Top Income Source"
                    titleStyle={{
                        fontSize: 12
                    }}
                    value={topSource?.label ?? 'No data'}
                    icon={<Icon source="source-branch" size={24} color={colors.tertiary} />}
                    textColor={colors.text}
                    isLoading={isLoading}
                />
            </View>
            <StatsCard
                title="Max/Min Income"
                value={
                    <>
                        <Icon source="currency-inr" size={18} color={colors.text} />
                        {incomeStats?.max ?? 0}/
                        <Icon source="currency-inr" size={18} color={colors.text} />
                        {incomeStats?.min ?? 0}
                    </>
                }
                icon={<Icon source="chart-timeline-variant" size={24} color={colors.tertiary} />}
                textColor={colors.text}
                isLoading={isLoading}
            />
        </View>
    )
}