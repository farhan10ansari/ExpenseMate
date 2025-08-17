import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import PeriodCard from '@/features/Stats/components/PeriodCard';
import useStatsStore from '@/stores/useStatsStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getExpenseStatsByPeriod } from '@/repositories/ExpenseRepo';
import { getIncomeStatsByPeriod } from '@/repositories/IncomeRepo';
import { ScreenWrapper } from '@/components/main/ScreenWrapper';
import CustomScreenHeader from '@/components/main/CustomScreenHeader';
import FinancialSummaryStats from '@/features/Stats/FinancialOverviewStats';
import ExpenseStats from '@/features/Stats/ExpenseStats';
import IncomeStats from '@/features/Stats/IncomeStats';


export default function HomeScreen() {
  const expensesPeriod = useStatsStore((state) => state.period);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  // Expense stats query
  const { data: expenseStats } = useQuery({
    queryKey: ['insights', 'expense-stats-in-a-period', expensesPeriod.value],
    queryFn: () => getExpenseStatsByPeriod(expensesPeriod.value),
  });

  // Income stats query
  const { data: incomeStats } = useQuery({
    queryKey: ['insights', 'income-stats-in-a-period', expensesPeriod.value],
    queryFn: () => getIncomeStatsByPeriod(expensesPeriod.value),
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
      header={<CustomScreenHeader title="Home" showBackButton={false} />}
      background="background"
      withScrollView
      isRefreshing={isRefreshing}
      onRefresh={handleRefresh}
      contentContainerStyle={styles.scrollContainer}
    >
      <PeriodCard />
      <FinancialSummaryStats expenseStats={expenseStats} incomeStats={incomeStats} />
      <ExpenseStats expenseStats={expenseStats} />
      <IncomeStats incomeStats={incomeStats} />
    </ScreenWrapper>
  );
}


const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 100,
    flexGrow: 1,
    gap: 20
  },
});