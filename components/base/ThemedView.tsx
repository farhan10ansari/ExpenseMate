import { useAppTheme } from '@/themes/providers/AppThemeProvider';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps;

export function ThemedView({ style, ...otherProps }: ThemedViewProps) {
  const { colors } = useAppTheme();

  return <View style={[{ backgroundColor: colors.background }, style]} {...otherProps} />;
}
