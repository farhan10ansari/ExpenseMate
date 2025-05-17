import { ThemedText } from '@/components/base/ThemedText';
import db, { expoClient } from '@/db/client';
import migrations from '@/drizzle/migrations/migrations';
import useAppStore from '@/stores/useAppStore';
import { AppThemeProvider, useAppTheme } from '@/themes/providers/AppThemeProviders';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // drizzle studio for debugging during development
  useDrizzleStudio(expoClient);
  const theme = useAppStore(state => state.theme);
  // drizzle migrations for schema changes
  const { success, error } = useMigrations(db, migrations);

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }


  if (error) {
    return <ThemedText>Migration error: {error.message}</ThemedText>;
  }
  if (!success) {
    return <ThemedText>Running migrations…</ThemedText>;
  }

  return (
    <AppThemeProvider>
      <MainLayout />
      <StatusBar style={theme === "system" ? "auto" : (theme === "light" ? "dark" : "light")} />
    </AppThemeProvider>
  );
}


function MainLayout() {
  const { colors } = useAppTheme();
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentScreen"
        options={{
          // title: 'Payment',
          presentation: 'formSheet',
          gestureDirection: "vertical",
          animation: "slide_from_bottom",
          sheetGrabberVisible: true,
          sheetInitialDetentIndex: 0,
          // sheetAllowedDetents: "fitToContents",
          sheetAllowedDetents: [0.75, 1],
          sheetExpandsWhenScrolledToEdge: true,
          sheetElevation: 24,
          sheetCornerRadius: 20,
          contentStyle: {
            backgroundColor: colors.card,
          }
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  )
}