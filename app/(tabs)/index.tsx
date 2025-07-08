import { ThemedView } from '@/components/base/ThemedView';
import InsightCard from '@/features/Insights/InsightCard';
import PeriodCard from '@/features/Insights/PeriodCard';
import { getExpenseStatsByPeriod } from '@/repositories/expenses';
import useInsightsStore from '@/stores/useInsightsStore';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function HomeScreen() {
  const { colors } = useAppTheme()
  const expensesPeriod = useInsightsStore((state) => state.period);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const { data: expenseStats, error } = useQuery({
    queryKey: ['insights', "expense-stats-in-a-period", expensesPeriod.value],
    queryFn: () => getExpenseStatsByPeriod(expensesPeriod.value),
  })

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      // padding: 8,
    },
    scrollContainer: {
      flex: 1,
      padding: 16,
      flexDirection: "column",
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      marginTop: 12,
    }
  })


  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await queryClient.refetchQueries({ queryKey: ['insights'] });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />
        }
      >
        <PeriodCard />
        <View style={styles.row}>
          <InsightCard
            title="Total Expenses"
            value={<>
              <FontAwesome name="rupee" size={18} color={colors.onPrimary} />
              {expenseStats?.total ?? 0}
            </>
            }
            icon={<FontAwesome name="rupee" size={24} color={colors.onPrimary} />}
            cardStyle={{
              backgroundColor: colors.primary80,
            }}
            textStyle={{
              color: colors.onPrimary
            }}
          />
          <InsightCard
            title="Transactions"
            value={expenseStats?.count ?? 0}
            icon={<Feather name="pie-chart" size={24} color={colors.accent} />}
            cardStyle={{
              backgroundColor: colors.onSecondary,
            }}
          />
        </View>
        <View style={styles.row}>
          <InsightCard
            title="Daily Avg"
            value={<>
              <FontAwesome name="rupee" size={18} color={colors.text} />
              {expenseStats?.avgPerDay ?? 0}
            </>}
            icon={<MaterialIcons name="trending-up" size={24} color={colors.accent} />}
          />
          <InsightCard
            title="Max/Min Spend"
            value={<>
              <FontAwesome name="rupee" size={18} color={colors.text} />
              {expenseStats?.max ?? 0}/
              <FontAwesome name="rupee" size={18} color={colors.text} />
              {expenseStats?.min ?? 0}
            </>}
            icon={<MaterialCommunityIcons name="chart-timeline-variant" size={24} color={colors.accent} />}
          />

        </View>
      </ScrollView>
    </ThemedView>
  );
}
