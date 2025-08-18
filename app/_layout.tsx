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
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useCurrentScreenTracker from '@/hooks/useCurrentScreenTracker';
import CustomBackButton from '@/components/ui/CustomBackButton';
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
  const router = useRouter();

  // Track the current screen using the custom hook
  useCurrentScreenTracker()
  return (
    <Stack
      screenOptions={{
        headerLeft: (props) => ( // Custom back button component
          router.canGoBack() ? (<CustomBackButton onPress={() => router.back()} />) : null // Show back button only if we can go back
        ),
        headerTitleAlign: 'center', // Center the title
        headerShadowVisible: false, // Hide the header shadow
        headerStyle: {
          backgroundColor: colors.card, // Use card color for header background
        }
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false
        }}
      />

      {/* Income Screens */}
      <Stack.Screen
        name="transaction/new"
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

      <Stack.Screen
        name="menu/themes"
        options={{
          title: 'Themes',
        }}
      />
      <Stack.Screen
        name="menu/settings"
        options={{
          title: 'Settings',
        }}
      />
      <Stack.Screen
        name="menu/dev-options"
        options={{
          title: 'Dev Options',
          headerStyle: {
            backgroundColor: colors.background,
          }
        }}
      />
      <Stack.Screen
        name="menu/about"
        options={{
          title: 'App Info',
          headerStyle: {}
        }}
      />

      {/* Stats Screens */}
      <Stack.Screen
        name="stats/expenses"
        options={{
          title: 'Expense Stats',
        }}
      />
      <Stack.Screen
        name="stats/incomes"
        options={{
          title: 'Income Stats',
        }}
      />

      <Stack.Screen name="+not-found" />
    </Stack>
  )
}