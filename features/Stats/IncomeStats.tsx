import { ThemedText } from "@/components/base/ThemedText";
import { PeriodIncomeStats } from "@/repositories/IncomeRepo";
import styles from "./styles";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import StatsCard from "./components/StatsCard";
import { AntDesign, FontAwesome, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { useRouter } from "expo-router";

type Props = {
    incomeStats?: PeriodIncomeStats;
    showTitle?: boolean;
}

export default function IncomeStats({ incomeStats, showTitle = false }: Props) {
    const { colors } = useAppTheme();

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
                    prefix={<FontAwesome name="rupee" size={18} color={colors.onPrimary} />}
                    value={incomeStats?.total ?? 0}
                    icon={<MaterialIcons name="trending-up" size={24} color={colors.onPrimary} />}
                    backgroundColor={colors.tertiary}
                    textColor={colors.onPrimary}
                />
                <StatsCard
                    title="Income Count"
                    value={incomeStats?.count ?? 0}
                    icon={<AntDesign name="plus" size={24} color={colors.tertiary} />}
                    textColor={colors.tertiary}
                />
            </View>
            <View style={styles.row}>
                <StatsCard
                    title="Daily Avg Income"
                    titleStyle={{
                        fontSize: 12
                    }}
                    prefix={<FontAwesome name="rupee" size={18} color={colors.text} />}
                    value={incomeStats?.avgPerDay ?? 0}
                    icon={<MaterialIcons name="timeline" size={24} color={colors.tertiary} />}
                    textColor={colors.text}
                />
                <StatsCard
                    title="Top Income Source"
                    titleStyle={{
                        fontSize: 12
                    }}
                    value={incomeStats?.topSource ?? 'No data'}
                    icon={<MaterialCommunityIcons name="source-branch" size={24} color={colors.tertiary} />}
                    textColor={colors.text}
                />
            </View>
            <StatsCard
                title="Max/Min Income"
                value={
                    <>
                        <FontAwesome name="rupee" size={18} color={colors.text} />
                        {incomeStats?.max ?? 0}/
                        <FontAwesome name="rupee" size={18} color={colors.text} />
                        {incomeStats?.min ?? 0}
                    </>
                }
                icon={<MaterialCommunityIcons name="chart-line" size={24} color={colors.tertiary} />}
                textColor={colors.text}
            />
        </View>
    )
}