import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import db, { expoClient } from '@/db/client';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migrations/migrations';
import { ThemedText } from '@/components/base/ThemedText';
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import ReactNavigationThemeProvider from '@/themes/providers/ReactNavigationThemeProvider';
import ReactNativePaperProvider from '@/themes/providers/ReactNativePaperProvider';
import { AppThemeProvider } from '@/themes/providers/AppThemeProvider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // drizzle studio for debugging during development
  useDrizzleStudio(expoClient);
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
      <ReactNavigationThemeProvider>
        <ReactNativePaperProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ReactNativePaperProvider>
      </ReactNavigationThemeProvider>
    </AppThemeProvider>
  );
}
