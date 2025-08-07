import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Switch, Text } from 'react-native-paper';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';

type RecurringInputProps = {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label?: string;
}

export default function RecurringInput({
  value,
  onValueChange,
  label = "Recurring",
}: RecurringInputProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <Switch
        value={!!value}
        onValueChange={onValueChange}
        color={colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingHorizontal: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});
