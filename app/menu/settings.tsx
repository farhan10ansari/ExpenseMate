import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/base/ThemedText";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { ScreenWrapper } from "@/components/main/ScreenWrapper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { List, Switch } from "react-native-paper";
import usePersistentAppStore from "@/stores/usePersistentAppStore";
import { useHaptics } from "@/contexts/HapticsProvider";

export default function SettingsScreen() {
  const { colors } = useAppTheme();
  const language = usePersistentAppStore(state => state.language);
  const setLanguage = usePersistentAppStore(state => state.setLanguage);
  const currency = usePersistentAppStore(state => state.currency);
  const setCurrency = usePersistentAppStore(state => state.setCurrency);
  const { hapticImpact } = useHaptics()


  // Haptics settings
  const haptics = usePersistentAppStore(state => state.haptics);
  const setHaptics = usePersistentAppStore(state => state.setHaptics);

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
    descriptionText: {
      color: colors.muted,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 16,
    },
    listItem: {
      paddingHorizontal: 0,
      paddingVertical: 8,
      backgroundColor: colors.inverseOnSurface,
      borderRadius: 8,
      marginBottom: 8,
    },
    listItemTitle: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
    },
    listItemDescription: {
      fontSize: 14,
      color: colors.muted,
    },
    comingSoonBadge: {
      backgroundColor: colors.primaryContainer,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: "flex-start",
    },
    checkIconContainer: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: "flex-start",
    },
    comingSoonText: {
      color: colors.onPrimaryContainer,
      fontSize: 12,
      fontWeight: "600",
    },
  });

  const languageOptions = [
    {
      key: "english",
      label: "English",
      description: "Default language",
      available: true,
    },
    // Future languages
    {
      key: "hindi",
      label: "हिन्दी (Hindi)",
      description: "Coming soon",
      available: false,
    },
    {
      key: "spanish",
      label: "Español (Spanish)",
      description: "Coming soon",
      available: false,
    },
  ];

  const currencyOptions = [
    {
      key: "rupees",
      label: "Indian Rupee (₹)",
      description: "INR - Default currency",
      symbol: "₹",
      available: true,
    },
    // Future currencies
    {
      key: "usd",
      label: "US Dollar ($)",
      description: "USD - Coming soon",
      symbol: "$",
      available: false,
    },
    {
      key: "euro",
      label: "Euro (€)",
      description: "EUR - Coming soon",
      symbol: "€",
      available: false,
    },
  ];

  // const hapticsIntensityOptions = [
  //   {
  //     key: "light",
  //     label: "Light",
  //     description: "Subtle vibration feedback",
  //     icon: "radiobox-blank", // Empty circle for light
  //   },
  //   {
  //     key: "medium",
  //     label: "Medium",
  //     description: "Balanced vibration feedback",
  //     icon: "checkbox-blank-circle", // Half-filled for medium
  //   },
  //   {
  //     key: "heavy",
  //     label: "Heavy",
  //     description: "Strong vibration feedback",
  //     icon: "checkbox-marked-circle", // Filled circle for heavy
  //   },
  // ];


  const handleHapticsToggle = (enabled: boolean) => {
    setHaptics(enabled);
    if (enabled) {
      hapticImpact(undefined, true);
    }
  };

  // const handleIntensityChange = (intensity: "light" | "medium" | "heavy") => {
  //   setHaptics(true, intensity);
  //   hapticImpact(intensity);
  // };

  return (
    <ScreenWrapper
      background="card"
      withScrollView
    >
      <View style={styles.container}>
        {/* Language Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="translate"
              size={24}
              color={colors.primary}
              style={styles.sectionIcon}
            />
            <ThemedText style={styles.sectionTitle}>
              Language
            </ThemedText>
          </View>

          <ThemedText style={styles.descriptionText}>
            Select your preferred language for the app interface. More languages will be added in future updates.
          </ThemedText>

          {languageOptions.map((option) => (
            <List.Item
              key={option.key}
              title={option.label}
              description={option.description}
              titleStyle={[
                styles.listItemTitle,
                !option.available && { opacity: 0.6 }
              ]}
              descriptionStyle={styles.listItemDescription}
              style={styles.listItem}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={option.available ? "check-circle" : "clock-outline"}
                  color={option.available ? colors.primary : colors.muted}
                />
              )}
              right={() => (
                <>
                  {language === option.key && option.available && (
                    <View style={styles.checkIconContainer}>
                      <MaterialCommunityIcons
                        name="check"
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                  )}
                  {!option.available && (
                    <View style={styles.comingSoonBadge}>
                      <ThemedText style={styles.comingSoonText}>
                        Soon
                      </ThemedText>
                    </View>
                  )}
                </>
              )}
              onPress={() => {
                if (option.available) {
                  hapticImpact("light");
                  setLanguage(option.key as "english");
                }
              }}
              disabled={!option.available}
            />
          ))}
        </View>

        {/* Currency Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="currency-rupee"
              size={24}
              color={colors.primary}
              style={styles.sectionIcon}
            />
            <ThemedText style={styles.sectionTitle}>
              Currency
            </ThemedText>
          </View>

          <ThemedText style={styles.descriptionText}>
            Choose your default currency for displaying amounts. Additional currencies will be supported soon.
          </ThemedText>

          {currencyOptions.map((option) => (
            <List.Item
              key={option.key}
              title={option.label}
              description={option.description}
              titleStyle={[
                styles.listItemTitle,
                !option.available && { opacity: 0.6 }
              ]}
              descriptionStyle={styles.listItemDescription}
              style={styles.listItem}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={option.available ? "currency-sign" : "clock-outline"}
                  color={option.available ? colors.primary : colors.muted}
                />
              )}
              right={() => (
                <>
                  {currency === option.key && option.available && (
                    <View style={styles.checkIconContainer}>
                      <MaterialCommunityIcons
                        name="check"
                        size={20}
                        color={colors.primary}
                      />
                    </View>
                  )}
                  {!option.available && (
                    <View style={styles.comingSoonBadge}>
                      <ThemedText style={styles.comingSoonText}>
                        Soon
                      </ThemedText>
                    </View>
                  )}
                </>
              )}
              onPress={() => {
                if (option.available) {
                  hapticImpact("light");
                  setCurrency(option.key as "rupees");
                }
              }}
              disabled={!option.available}
            />
          ))}
        </View>

        {/* Haptics Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="vibrate"
              size={24}
              color={colors.primary}
              style={styles.sectionIcon}
            />
            <ThemedText style={styles.sectionTitle}>
              Haptic Feedback
            </ThemedText>
          </View>

          <ThemedText style={styles.descriptionText}>
            Control vibration feedback when interacting with the app. Choose your preferred intensity level.
          </ThemedText>

          {/* Enable/Disable Haptics */}
          <List.Item
            title="Enable Haptic Feedback"
            description="Feel vibrations when using the app"
            titleStyle={styles.listItemTitle}
            descriptionStyle={styles.listItemDescription}
            style={styles.listItem}
            left={(props) => (
              <List.Icon
                {...props}
                icon={haptics.enabled ? "vibrate" : "vibrate-off"}
                color={haptics.enabled ? colors.primary : colors.muted}
              />
            )}
            right={() => (
              <Switch
                value={haptics.enabled}
                onValueChange={handleHapticsToggle}
                style={{ transform: [{ scale: 0.9 }] }}
              />
            )}
            onPress={() => handleHapticsToggle(!haptics.enabled)}
          />

          {/* Intensity Options - Only show when haptics is enabled */}
          {/* {haptics.enabled && (
            <>
              <View style={{ height: 8 }} />
              {hapticsIntensityOptions.map((option) => (
                <List.Item
                  key={option.key}
                  title={option.label}
                  description={option.description}
                  titleStyle={styles.listItemTitle}
                  descriptionStyle={styles.listItemDescription}
                  style={styles.listItem}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon={option.icon}
                      color={haptics.intensity === option.key ? colors.primary : colors.muted}
                    />
                  )}
                  right={() => (
                    haptics.intensity === option.key && (
                      <View style={styles.checkIconContainer}>
                        <MaterialCommunityIcons
                          name="check"
                          size={20}
                          color={colors.primary}
                        />
                      </View>
                    )
                  )}
                  onPress={() => handleIntensityChange(option.key as "light" | "medium" | "heavy")}
                />
              ))}
            </>
          )} */}
        </View>

        {/* More Settings Coming Soon */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="cog-outline"
              size={24}
              color={colors.primary}
              style={styles.sectionIcon}
            />
            <ThemedText style={styles.sectionTitle}>
              More Settings
            </ThemedText>
          </View>

          <ThemedText style={styles.descriptionText}>
            Additional settings and customization options are being developed and will be available in future updates.
          </ThemedText>

          <View style={[styles.comingSoonBadge, { alignSelf: "center", marginTop: 8 }]}>
            <ThemedText style={styles.comingSoonText}>
              More options coming soon!
            </ThemedText>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}
