import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/base/ThemedText';
import { ThemedView } from '@/components/base/ThemedView';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';

interface SourceBreakdownChartProps {
  data?: {
    source: string;
    total: number;
    count: number;
  }[];
  title?: string;
}

export default function SourceBreakdownChart({ data, title = "Income Sources" }: SourceBreakdownChartProps) {
  const { colors } = useAppTheme();

  if (!data || data.length === 0) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: colors.surface }]}>
        <ThemedText style={[styles.title, { color: colors.text }]}>{title}</ThemedText>
        <ThemedText style={[styles.noData, { color: colors.text }]}>
          No income data available
        </ThemedText>
      </ThemedView>
    );
  }

  const total = data.reduce((sum, item) => sum + item.total, 0);

  

  return (
    <ThemedView style={[styles.container, { backgroundColor: colors.surface }]}>
      <ThemedText style={[styles.title, { color: colors.text }]}>{title}</ThemedText>
      {data.map((item, index) => {
        const percentage = total > 0 ? ((item.total / total) * 100).toFixed(1) : '0.0';
        return (
          <View key={index} style={styles.item}>
            <ThemedText style={[styles.sourceText, { color: colors.text }]}>
              {item.source}
            </ThemedText>
            <View style={styles.rightContainer}>
              <ThemedText style={[styles.amountText, { color: colors.text }]}>
                ₹{item.total.toLocaleString()}
              </ThemedText>
              <ThemedText style={[styles.percentageText, { color: colors.text }]}>
                {percentage}% ({item.count} transactions)
              </ThemedText>
            </View>
          </View>
        );
      })}
    </ThemedView>
  );
}


const styles = StyleSheet.create({
    container: {
      marginTop: 16,
      padding: 16,
      borderRadius: 12,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
    },
    sourceText: {
      fontSize: 14,
      fontWeight: '500',
    },
    amountText: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    percentageText: {
      fontSize: 12,
      opacity: 0.7,
    },
    noData: {
      textAlign: 'center',
      fontStyle: 'italic',
      paddingVertical: 20,
    },
    rightContainer: {
      alignItems: 'flex-end',
    },
  });