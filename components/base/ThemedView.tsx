import { useAppTheme } from '@/themes/providers/AppThemeProvider';
import { View, type ViewProps } from 'react-native';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { colors } = useAppTheme();

  return <View style={[{ backgroundColor: colors.background }, style]} {...otherProps} />;
}
