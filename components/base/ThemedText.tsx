import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
  color?: string; // Optional color prop for custom text color for light and dark themes
  lightColor?: string; // Optional color for light theme. If provided, it will override the color prop in light mode
  darkColor?: string; // Optional color for dark theme. If provided, it will override the color prop in dark mode
  fontSize?: number; // Optional font size, can be used to override default sizes
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  centered?: boolean;
};

export function ThemedText({
  style,
  color,
  lightColor,
  darkColor,
  fontSize,
  type = 'default',
  centered = false,
  ...rest
}: ThemedTextProps) {
  const { colors } = useAppTheme();

  return (
    <Text
      style={[
        { color: colors.text },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
        color ? { color } : undefined,
        lightColor ? { color: lightColor } : undefined,
        darkColor ? { color: darkColor } : undefined,
        fontSize ? { fontSize } : undefined,
        centered ? { textAlign: 'center' } : undefined,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 14,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});
