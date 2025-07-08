import { ThemedView } from '@/components/base/ThemedView';
import InsightCard from '@/features/Insights/InsightCard';
import PeriodCard from '@/features/Insights/PeriodCard';
import { InsightPeriod } from '@/lib/types';
import { getExpenseStatsByPeriod } from '@/repositories/expenses';
import useInsightsStore from '@/stores/useInsightsStore';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import { FontAwesome } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';




export default function HomeScreen() {
  const { colors } = useAppTheme()
  const expensesPeriod = useInsightsStore((state) => state.period);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const { data, error } = useQuery({
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
      flexDirection:"column",
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
        <PeriodCard/>
        <View style={styles.row}>
          <InsightCard
            title="Total Expenses"
            value={<>
              <FontAwesome name="rupee" size={18} color={colors.text} />
              {data?.total ?? 0}
            </>
            }
            icon={<FontAwesome name="rupee" size={24} color={colors.primary} />}
          />
          <InsightCard
            title="Avg Per Day"
            value={data?.avgPerDay ?? 0}
            icon={<FontAwesome name="dollar" size={24} color={colors.primary} />}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}
