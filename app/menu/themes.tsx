import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/base/ThemedText";
import usePersistentAppStore from "@/stores/usePersistentAppStore";
import { Button } from "react-native-paper";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import CustomScreenHeader from "@/components/main/CustomScreenHeader";
import { ScreenWrapper } from "@/components/main/ScreenWrapper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ThemesScreen() {
  const { colors } = useAppTheme();
  const theme = usePersistentAppStore(state => state.theme);
  const setTheme = usePersistentAppStore(state => state.setTheme);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 18,
    },
    sectionContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionIcon: {
      marginRight: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.primary,
    },
    themeButtonsContainer: {
      flexDirection: "row",
      gap: 12,
      marginTop: 8,
    },
    themeButton: {
      flex: 1,
    },
    descriptionText: {
      color: colors.muted,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 16,
    },
  });

  const themeOptions = [
    {
      key: "light" as const,
      label: "Light",
      icon: "weather-sunny",
      description: "Always use light theme",
    },
    {
      key: "dark" as const,
      label: "Dark",
      icon: "weather-night",
      description: "Always use dark theme",
    },
    {
      key: "system" as const,
      label: "System",
      icon: "theme-light-dark",
      description: "Follow system preference",
    },
  ];

  return (
    <ScreenWrapper
      header={<CustomScreenHeader title="Themes" />}
      background="card"
    >
      <View style={styles.container}>
        {/* Theme Selection Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="palette"
              size={24}
              color={colors.primary}
              style={styles.sectionIcon}
            />
            <ThemedText style={styles.sectionTitle}>
              App Appearance
            </ThemedText>
          </View>

          <ThemedText style={styles.descriptionText}>
            Choose your preferred theme for the app. System theme will automatically switch between light and dark based on your device settings.
          </ThemedText>

          <View style={styles.themeButtonsContainer}>
            {themeOptions.map((option) => (
              <Button
                key={option.key}
                mode={theme === option.key ? "contained" : "outlined"}
                style={styles.themeButton}
                onPress={() => setTheme(option.key)}
                icon={option.icon}
                contentStyle={{ flexDirection: "column", paddingVertical: 12 }}
                labelStyle={{ fontSize: 14, marginTop: 4 }}
              >
                {option.label}
              </Button>
            ))}
          </View>
        </View>

        {/* Current Selection Info */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="information-outline"
              size={20}
              color={colors.secondary}
              style={styles.sectionIcon}
            />
            <ThemedText style={[styles.sectionTitle, { fontSize: 16 }]}>
              Current Selection
            </ThemedText>
          </View>

          <ThemedText style={{ color: colors.text, fontSize: 15 }}>
            <ThemedText style={{ fontWeight: "600", color: colors.primary }}>
              {themeOptions.find(opt => opt.key === theme)?.label} Theme
            </ThemedText>
            {"\n"}
            <ThemedText style={styles.descriptionText}>
              {themeOptions.find(opt => opt.key === theme)?.description}
            </ThemedText>
          </ThemedText>
        </View>
      </View>
    </ScreenWrapper>
  );
}
