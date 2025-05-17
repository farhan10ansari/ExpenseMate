import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps;

export function ThemedView({ style, ...otherProps }: ThemedViewProps) {
  const { colors } = useAppTheme();

  return <View style={[{ backgroundColor: colors.background }, style]} {...otherProps} />;
}
