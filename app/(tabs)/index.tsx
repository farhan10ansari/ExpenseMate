import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import PeriodCard from '@/features/Stats/components/PeriodCard';
import useStatsStore from '@/stores/useStatsStore';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getExpenseStatsByPeriod } from '@/repositories/ExpenseRepo';
import { getIncomeStatsByPeriod } from '@/repositories/IncomeRepo';
import { ScreenWrapper } from '@/components/main/ScreenWrapper';
import FinancialSummaryStats from '@/features/Stats/FinancialOverviewStats';
import ExpenseStats from '@/features/Stats/ExpenseStats';
import IncomeStats from '@/features/Stats/IncomeStats';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import { Button, IconButton, Menu } from 'react-native-paper';
import { Href, useNavigation, useRouter } from 'expo-router';
import usePersistentAppStore from '@/stores/usePersistentAppStore';


export default function HomeScreen() {
  const { colors } = useAppTheme();
  const expensesPeriod = useStatsStore((state) => state.period);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  // Expense stats query
  const { data: expenseStats } = useQuery({
    queryKey: ['insights', 'expense', 'stats-in-a-period', expensesPeriod.value],
    queryFn: () => getExpenseStatsByPeriod(expensesPeriod.value),
  });

  // Income stats query
  const { data: incomeStats } = useQuery({
    queryKey: ['insights', 'income', 'stats-in-a-period', expensesPeriod.value],
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
  // Set up screen menu
  useScreenMenu({ onRefresh: () => handleRefresh() });

  const MoreStatsButton = ({ routeName }: { routeName: Href }) => (
    <View style={styles.moreStatsButtonContainer}>
      <Button
        mode="text"
        compact
        icon={() => <MaterialIcons name="chevron-right" size={20} color={colors.primary} />}
        contentStyle={{ flexDirection: 'row-reverse' }}
        labelStyle={{ fontSize: 12, fontWeight: '600' }}
        textColor={colors.primary}
        onPress={() => router.push(routeName)}
      >
        More Stats
      </Button>
    </View>
  )

  return (
    <ScreenWrapper
      background="background"
      withScrollView
      isRefreshing={isRefreshing}
      onRefresh={handleRefresh}
      contentContainerStyle={styles.scrollContainer}
    >
      <PeriodCard />
      <FinancialSummaryStats expenseStats={expenseStats} incomeStats={incomeStats} />
      <View style={styles.section}>
        <ExpenseStats expenseStats={expenseStats} showTitle />
        <MoreStatsButton routeName="/stats/expenses" />
      </View>
      <View style={styles.section}>
        <IncomeStats incomeStats={incomeStats} showTitle />
        <MoreStatsButton routeName="/stats/incomes" />
      </View>
    </ScreenWrapper>
  );
}

const useScreenMenu = ({ onRefresh }: { onRefresh: () => void }) => {
  const navigation = useNavigation();
  const { colors } = useAppTheme();
  const showNegativeStats = usePersistentAppStore((state) => state.uiFlags.showNegativeStats);
  const updateUiFlag = usePersistentAppStore((state) => state.updateUIFlag);
  const [showMenu, setShowMenu] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Menu
          visible={showMenu}
          onDismiss={() => setShowMenu(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              onPress={() => setShowMenu(true)}
            />
          }
          anchorPosition='bottom'
          contentStyle={{ backgroundColor: colors.surface }} // Optional: styled menu
        >
          <Menu.Item
            leadingIcon={showNegativeStats ? "eye-off" : "eye"}
            title={showNegativeStats ? "Hide Negative Stats" : "Show Negative Stats"}
            onPress={() => {
              updateUiFlag("showNegativeStats", !showNegativeStats);
              setShowMenu(false); // Close after click
            }}
          />
          <Menu.Item
            leadingIcon="refresh"
            title="Refresh Data"
            onPress={() => {
              onRefresh();
              setShowMenu(false);
            }}
          />
        </Menu>
      ),
    });
  }, [showMenu, showNegativeStats, colors.primary]);
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
  moreStatsButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  section: {
    gap: 10
  },
  menuItemWithSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: 10,
  }
});