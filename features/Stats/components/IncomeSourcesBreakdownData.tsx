import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { ThemedText } from '@/components/base/ThemedText';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import { useIncomeSourceMapping } from '@/contexts/CategoryDataProvider';

interface IncomeSourceStat {
  source: string;
  total: number;
  count: number;
}

interface Props {
  data?: IncomeSourceStat[];
  title?: string;
}

export default function IncomeSourcesBreakdownCard({
  data,
  title = 'Income Sources',
}: Props) {
  const { colors } = useAppTheme();
  // Get the source mapping
  const sourceMapping = useIncomeSourceMapping()

  if (!data || data.length === 0) {
    return (
      <Card style={[styles.container, { backgroundColor: colors.surface }]}>
        <Card.Content>
          <ThemedText style={[styles.title, { color: colors.text }]}>{title}</ThemedText>
          <ThemedText style={[styles.noData, { color: colors.text }]}>
            No income data available
          </ThemedText>
        </Card.Content>
      </Card>
    );
  }

  const grandTotal = data.reduce((sum, item) => sum + item.total, 0);

  return (
    <Card style={[styles.container, { backgroundColor: colors.surface }]}>
      <Card.Content>
        <ThemedText style={[styles.title, { color: colors.text }]}>{title}</ThemedText>
        {data.map((item, index) => {
          const cfg = sourceMapping[item.source] || {};
          const label = cfg.label || item.source;
          const iconName = cfg.icon || 'help-circle';
          const color = cfg.color || colors.primary;
          const percentage = grandTotal > 0 ? ((item.total / grandTotal) * 100).toFixed(1) : '0.0';

          return (
            <View key={index} style={styles.item}>
              <View style={styles.leftContainer}>
                <Avatar.Icon size={32} icon={iconName} color={colors.onPrimary} style={{ backgroundColor: color }} />
                <ThemedText style={[styles.sourceText, { color: colors.text, marginLeft: 8 }]}>
                  {label}
                </ThemedText>
              </View>
              <View style={styles.rightContainer}>
                <ThemedText style={[styles.amountText, { color: colors.text }]}>₹{item.total.toLocaleString()}</ThemedText>
                <ThemedText style={[styles.percentageText, { color: colors.text }]}>
                  {percentage}% <ThemedText style={{ color: colors.muted }}>({item.count} txns)</ThemedText>
                </ThemedText>
              </View>
            </View>
          );
        })}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 6, borderRadius: 12, elevation: 3 },
  title: { fontSize: 17, fontWeight: 'bold', marginBottom: 12, letterSpacing: 0.5 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 0.5, borderBottomColor: '#eee' },
  leftContainer: { flexDirection: 'row', alignItems: 'center' },
  sourceText: { fontSize: 15, fontWeight: '600' },
  amountText: { fontSize: 15, fontWeight: 'bold', letterSpacing: 0.5 },
  percentageText: { fontSize: 13, opacity: 0.7, marginTop: 2, textAlign: 'right' },
  noData: { textAlign: 'center', fontStyle: 'italic', paddingVertical: 20, fontSize: 15, opacity: 0.6 },
  rightContainer: { alignItems: 'flex-end', minWidth: 90 },
});
