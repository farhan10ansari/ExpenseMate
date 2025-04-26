import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { colors } from "@/themes";

// Custom themes for light and dark mode
export const customLightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
  },
};

export const customDarkTheme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.primary,
    card: "rgb(34, 34, 34)",
  },
};

export default function ReactNavigationThemeProvider({ children }: { children: React.ReactNode }) {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? customDarkTheme : customLightTheme}>
      {children}
    </ThemeProvider>
  )
}