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
import { ConfirmationProvider } from '@/components/main/ConfirmationDialog';
import { ThemedView } from '@/components/base/ThemedView';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity, // Queries will only be refetched when invalidated or app is restarted
      retry: 1, // Retry failed queries once
      refetchOnWindowFocus: false,
    }
  }
});

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
    // hide splash when everything is ready
    if (loaded && success) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    // hide splash on error for showing the error message
    if (error) {
      SplashScreen.hideAsync();
    }
  }, [error]);

  if (!loaded) {
    return null;
  }

  if (error) {
    return (
      <AppThemeProvider>
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <ThemedText>Migration/Seed error: {error?.message}</ThemedText>
        </ThemedView>
      </AppThemeProvider>
    );
  }

  if (!success) {
    return (
      <AppThemeProvider>
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
          <ThemedText>Running migrations/seeding data…</ThemedText>
        </ThemedView>
      </AppThemeProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <AppThemeProvider>
          <HapticsProvider>
            <ConfirmationProvider>
              <MainLayout />
              <GlobalLevelComponents />
              <StatusBar style={theme === "system" ? "auto" : (theme === "light" ? "dark" : "light")} />
            </ConfirmationProvider>
          </HapticsProvider>
        </AppThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
