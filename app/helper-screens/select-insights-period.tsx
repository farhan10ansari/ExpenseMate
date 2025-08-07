import { ThemedText } from "@/components/base/ThemedText";
import { ThemedView } from "@/components/base/ThemedView";
import FormSheetHeader from "@/components/main/FormSheetHeader";
import SheetGrabber from "@/components/ui/SheetGrabber";
import useInsightsStore, { InsightPeriodOption, insightPeriodOptions } from "@/stores/useInsightsStore";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { useRouter } from "expo-router";
import { Fragment } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Divider } from "react-native-paper";



export default function SelectInsightsPeriodScreen() {
  const { colors } = useAppTheme();
  const period = useInsightsStore((state) => state.period);
  const setPeriod = useInsightsStore((state) => state.setPeriod);
  const router = useRouter();

  const handleSelectPeriod = (selectedPeriod: InsightPeriodOption) => {
    setPeriod(selectedPeriod);
    setTimeout(() => {
      router.back(); // Use router to go back in Expo Router
    }, 200); // Delay to ensure state is set before navigating
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,

    },
    optionsContainer: {
      gap: 4,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 80, // Space at the bottom
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: colors.primary,
    },
  });

  return (
    <ThemedView style={styles.container}>
      <FormSheetHeader
        title="Select Period"
        onClose={() => router.back()}
      />
      <View style={styles.optionsContainer}>
        {insightPeriodOptions.map((option, index) => (
          <Fragment key={index}>
            <Pressable
              key={option.value}
              onPress={() => handleSelectPeriod(option)}
            >
              <ThemedText
                type="default"
                style={{
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: period.value === option.value ? colors.primary : "transparent",
                  color: period.value === option.value ? colors.background : colors.text,
                }}
              >
                {option.label}
              </ThemedText>
            </Pressable>
            {index !== insightPeriodOptions.length - 1 && (
              <Divider />
            )}
          </Fragment>
        ))}
      </View>
    </ThemedView>
  );
}