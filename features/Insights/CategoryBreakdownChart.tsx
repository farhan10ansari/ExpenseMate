import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Card, Switch } from 'react-native-paper';
import { ThemedText } from '@/components/base/ThemedText';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import { CategoryStat } from '@/lib/types';
import useCategoriesStore from '@/stores/useCategoriesStore';

type CategoryBreakdownData = {
  data?: CategoryStat[];
};

export default function CategoryBreakdownChart({ data }: CategoryBreakdownData) {
  const { colors, dark } = useAppTheme();
  const { width: windowWidth } = useWindowDimensions();
  const [showAbsolute, setShowAbsolute] = useState(false);
  const chartWidth = windowWidth - 54;
  const categoryMapping = useCategoriesStore((state) => state.categoryMapping);

  // prepare chart data with sum and count in legend
  const chartData = useMemo(() => {
    return data?.map((cat, idx) => ({
      name: `${categoryMapping[cat.category].label} (${cat.count})`,
      amount: showAbsolute ? parseFloat(cat.total.toFixed(2)) : cat.total, // format to 2 decimal places
      color: categoryMapping[cat.category].color,
      legendFontColor: colors.text,
      legendFontSize: showAbsolute ? 10 : 12, // adjust font size based on absolute toggle
    }))
  }, [data, categoryMapping, colors, showAbsolute]);

  if (!chartData || chartData.length === 0) return null;

  return (
    <View style={styles.chartContainer}>
      <Card style={[styles.chartCard, { backgroundColor: colors.onSecondary }]}>
        {/* Header with title and toggle */}
        <Pressable
          style={[
            styles.header,
            { backgroundColor: colors.surface, borderBottomColor: colors.text },
          ]}
          onPress={() => setShowAbsolute(!showAbsolute)}
          android_ripple={{ color: dark ? colors.primary100 : colors.primary10 }}
        >
          <View style={styles.switchContainer}>
            <ThemedText style={[styles.switchLabel, { color: colors.text }]}>
              Show absolute values
            </ThemedText>
            <Switch
              value={showAbsolute}
              onValueChange={setShowAbsolute}
              color={colors.accent}
            />
          </View>
        </Pressable>

        <View style={styles.chartWrapper}>
          <PieChart
            data={chartData}
            width={chartWidth}
            height={200}
            chartConfig={{
              backgroundGradientFrom: 'transparent',
              backgroundGradientTo: 'transparent',
              color: () => colors.accent,
              labelColor: () => colors.text,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute={showAbsolute}
            style={styles.chartStyle}
          />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    marginTop: 12,
    alignItems: 'center',
    width: '100%',
  },
  chartCard: {
    borderRadius: 8,
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    overflow: 'hidden', // to ensure the android ripple effect doesn't overflow
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: "#ccc"
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  switchContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    marginRight: 8,
    fontSize: 14,
  },
  chartWrapper: {
    padding: 16,
    alignItems: 'center',
  },
  chartStyle: {
    borderRadius: 8,
    marginVertical: 0,
  },
});
