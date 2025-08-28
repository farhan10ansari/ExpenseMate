import useCurrentScreenTracker from "@/hooks/useCurrentScreenTracker";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { Stack, useRouter } from "expo-router";
import CustomBackButton from "../ui/CustomBackButton";
import { useCallback, useMemo } from "react";

export default function MainLayout() {
  const { colors } = useAppTheme();
  const router = useRouter();

  // Track the current screen using the custom hook
  useCurrentScreenTracker();

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const headerLeft = useCallback(() => (
    router.canGoBack() ? <CustomBackButton onPress={handleGoBack} /> : null
  ), [router, handleGoBack]);

  // Memoize screen options to prevent recreation
  const screenOptions = useMemo(() => ({
    headerLeft,
    headerTitleAlign: 'center' as const,
    headerShadowVisible: false,
    headerStyle: {
      backgroundColor: colors.card,
    }
  }), [headerLeft, colors.card]);

  // Memoize common form sheet options
  const formSheetOptions = useMemo(() => ({
    presentation: 'formSheet' as const,
    gestureDirection: "vertical" as const,
    animation: "slide_from_bottom" as const,
    sheetGrabberVisible: true,
    sheetInitialDetentIndex: 0,
    sheetExpandsWhenScrolledToEdge: true,
    sheetElevation: 24,
    sheetCornerRadius: 20,
    contentStyle: {
      backgroundColor: colors.card,
    }
  }), [colors.card]);

  // Memoize specific variations
  const formSheetWithDetents = useMemo(() => ({
    ...formSheetOptions,
    sheetAllowedDetents: [0.75, 1],
  }), [formSheetOptions]);

  const formSheetFitContent = useMemo(() => ({
    ...formSheetOptions,
    sheetAllowedDetents: "fitToContents" as const,
  }), [formSheetOptions]);

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false }}
      />

      {/* Transaction Screens */}
      <Stack.Screen
        name="transaction/new"
        options={{
          title: 'Create Expense',
          ...formSheetWithDetents,
        }}
      />

      <Stack.Screen
        name="expense/[id]"
        options={{
          title: 'Expense Details',
          ...formSheetFitContent,
        }}
      />

      <Stack.Screen
        name="expense/[id]/edit"
        options={{
          title: 'Edit Expense',
          ...formSheetWithDetents,
        }}
      />

      <Stack.Screen
        name="income/[id]"
        options={{
          title: 'Income Details',
          ...formSheetFitContent,
        }}
      />

      <Stack.Screen
        name="income/[id]/edit"
        options={{
          title: 'Edit Income',
          ...formSheetWithDetents,
        }}
      />

      {/* Helper Screens */}
      <Stack.Screen
        name="helper-screens/select-stats-period"
        options={{
          title: 'Select Period',
          ...formSheetFitContent,
        }}
      />

      {/* Menu Screens */}
      <Stack.Screen
        name="menu/themes"
        options={{ title: 'Themes' }}
      />
      <Stack.Screen
        name="menu/settings"
        options={{ title: 'Settings' }}
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
        options={{ title: 'App Info' }}
      />

       <Stack.Screen
        name="menu/(manage-categories)"
        options={{ title: 'Expense Categories' }}
      />

      {/* Stats Screens */}
      <Stack.Screen
        name="stats/expenses"
        options={{ title: 'Expense Stats' }}
      />
      <Stack.Screen
        name="stats/incomes"
        options={{ title: 'Income Stats' }}
      />

      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
