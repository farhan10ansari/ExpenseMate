import useCurrentScreenTracker from "@/hooks/useCurrentScreenTracker";
// import useSystemState from "@/hooks/useSystemState";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { Stack, useRouter } from "expo-router";
import CustomBackButton from "../ui/CustomBackButton";

export default 
function MainLayout() {
  const { colors } = useAppTheme();
  const router = useRouter();

  // Track the current screen using the custom hook
  useCurrentScreenTracker()
  // Track system state changes like low power mode
//   useSystemState()
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
        name="helper-screens/select-stats-period"
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