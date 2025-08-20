import { ThemedText } from '@/components/base/ThemedText';
import GlobalLevelComponents from '@/components/main/GlobalLevelComponents';
import db, { expoClient } from '@/db/client';
import migrations from '@/drizzle/migrations/migrations';
import usePersistentAppStore from '@/stores/usePersistentAppStore';
import { AppThemeProvider } from '@/themes/providers/AppThemeProviders';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HapticsProvider } from '@/contexts/HapticsProvider';
import MainLayout from '@/components/main/MainLayout';
const queryClient = new QueryClient()

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // drizzle studio for debugging during development
  useDrizzleStudio(expoClient);
  const theme = usePersistentAppStore(state => state.theme);
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
    <GestureHandlerRootView>
      <QueryClientProvider client={queryClient}>
        <AppThemeProvider>
          <HapticsProvider>
            <MainLayout />
          </HapticsProvider>
          <GlobalLevelComponents />
          <StatusBar style={theme === "system" ? "auto" : (theme === "light" ? "dark" : "light")} />
        </AppThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

