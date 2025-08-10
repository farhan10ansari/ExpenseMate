import { ThemedText } from '@/components/base/ThemedText';
import GlobalLevelComponents from '@/components/main/GlobalLevelComponents';
import db, { expoClient } from '@/db/client';
import migrations from '@/drizzle/migrations/migrations';
import usePersistentAppStore from '@/stores/usePersistentAppStore';
import { AppThemeProvider, useAppTheme } from '@/themes/providers/AppThemeProviders';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useCurrentScreenTracker from '@/hooks/useCurrentScreenTracker';
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
          <MainLayout />
          <GlobalLevelComponents />
          <StatusBar style={theme === "system" ? "auto" : (theme === "light" ? "dark" : "light")} />
        </AppThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}


function MainLayout() {
  const { colors } = useAppTheme();

  // Track the current screen using the custom hook
  useCurrentScreenTracker()
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      {/* Income Screens */}
      <Stack.Screen
        name="expense/new"
        options={{
          title: 'Create Expense',
          presentation: 'formSheet',
          gestureDirection: "vertical",
          animation: "slide_from_bottom",
          sheetGrabberVisible: true,
          sheetInitialDetentIndex: 0,
          sheetAllowedDetents: [0.75, 1],
          sheetExpandsWhenScrolledToEdge: true,
          sheetElevation: 24,
          sheetCornerRadius: 20,
          contentStyle: {
            backgroundColor: colors.card,
          }
        }}
      />
      <Stack.Screen
        name="expense/[id]"
        options={{
          title: 'Expense Details',
          presentation: 'formSheet',
          gestureDirection: "vertical",
          animation: "slide_from_bottom",
          sheetGrabberVisible: true,
          sheetInitialDetentIndex: 0,
          sheetAllowedDetents: "fitToContents",
          sheetExpandsWhenScrolledToEdge: true,
          sheetElevation: 24,
          sheetCornerRadius: 20,
          contentStyle: {
            backgroundColor: colors.card,
          }
        }}
      />
      <Stack.Screen
        name="expense/[id]/edit"
        options={{
          title: 'Edit Expense',
          presentation: 'formSheet',
          gestureDirection: "vertical",
          animation: "slide_from_bottom",
          sheetGrabberVisible: true,
          sheetInitialDetentIndex: 0,
          sheetAllowedDetents: [0.75, 1],
          sheetExpandsWhenScrolledToEdge: true,
          sheetElevation: 24,
          sheetCornerRadius: 20,
          contentStyle: {
            backgroundColor: colors.card,
          }
        }}
      />

      {/* Income Screens */}
      <Stack.Screen
        name="income/new"
        options={{
          title: 'Create Income',
          presentation: 'formSheet',
          gestureDirection: "vertical",
          animation: "slide_from_bottom",
          // headerShown: false,
          sheetGrabberVisible: true,
          sheetInitialDetentIndex: 0,
          sheetAllowedDetents: [0.75, 1],
          sheetExpandsWhenScrolledToEdge: true,
          sheetElevation: 24,
          sheetCornerRadius: 20,
          contentStyle: {
            backgroundColor: colors.card,
          }

        }}
      />

      <Stack.Screen
        name="income/[id]"
        options={{
          title: 'Income Details',
          presentation: 'formSheet',
          gestureDirection: "vertical",
          animation: "slide_from_bottom",
          sheetGrabberVisible: true,
          sheetInitialDetentIndex: 0,
          sheetAllowedDetents: "fitToContents",
          sheetExpandsWhenScrolledToEdge: true,
          sheetElevation: 24,
          sheetCornerRadius: 20,
          contentStyle: {
            backgroundColor: colors.card,
          }
        }}
      />

      <Stack.Screen
        name="income/[id]/edit"
        options={{
          title: 'Edit Income',
          presentation: 'formSheet',
          gestureDirection: "vertical",
          animation: "slide_from_bottom",
          sheetGrabberVisible: true,
          sheetInitialDetentIndex: 0,
          sheetAllowedDetents: [0.75, 1],
          sheetExpandsWhenScrolledToEdge: true,
          sheetElevation: 24,
          sheetCornerRadius: 20,
          contentStyle: {
            backgroundColor: colors.card,
          }
        }}
      />


      {/* Helper Screens */}
      <Stack.Screen
        name="helper-screens/select-insights-period"
        options={{
          title: 'Select Period',
          presentation: 'formSheet',
          gestureDirection: "vertical",
          animation: "slide_from_bottom",
          sheetGrabberVisible: true,
          sheetInitialDetentIndex: 0,
          sheetAllowedDetents: "fitToContents",
          sheetExpandsWhenScrolledToEdge: true,
          sheetElevation: 24,
          sheetCornerRadius: 20,
          contentStyle: {
            backgroundColor: colors.card,
          }
        }}
      />


      {/* <Stack.Screen
        name="menu"
        options={{
          title: 'Menu',
          headerShown: true,
          presentation: 'card',
          animation: 'default',
          contentStyle: { backgroundColor: colors.card },
        }}
      /> */}
      <Stack.Screen
        name="menu/themes"
        options={{
          title: 'Themes',
          headerShown: false,
          // presentation: 'formSheet',
          // animation: 'slide_from_bottom',
          // sheetGrabberVisible: true,
          // sheetInitialDetentIndex: 0,
          // sheetAllowedDetents: 'fitToContents',
          // sheetCornerRadius: 20,
          // contentStyle: { backgroundColor: colors.card },
        }}
      />
      <Stack.Screen
        name="menu/settings"
        options={{
          title: 'Settings',
          headerShown: false,
          // presentation: 'formSheet',
          // animation: 'slide_from_bottom',
          // sheetGrabberVisible: true,
          // sheetInitialDetentIndex: 0,
          // sheetAllowedDetents: 'fitToContents',
          // sheetCornerRadius: 20,
          // contentStyle: { backgroundColor: colors.card },
        }}
      />
      <Stack.Screen
        name="menu/dev-options"
        options={{
          title: 'Dev Options',
          headerShown: false,
          // presentation: 'formSheet',
          // animation: 'slide_from_bottom',
          // sheetGrabberVisible: true,
          // sheetInitialDetentIndex: 0,
          // sheetAllowedDetents: [0.75, 1],
          // sheetCornerRadius: 20,
          // contentStyle: { backgroundColor: colors.card },
        }}
      />
      <Stack.Screen
        name="menu/about"
        options={{
          title: 'App Info',
          headerShown: false,
          // presentation: 'formSheet',
          // animation: 'slide_from_bottom',
          // sheetGrabberVisible: true,
          // sheetInitialDetentIndex: 0,
          // sheetAllowedDetents: 'fitToContents',
          // sheetCornerRadius: 20,
          // contentStyle: { backgroundColor: colors.card },
        }}
      />

      <Stack.Screen name="+not-found" />
    </Stack>
  )
}