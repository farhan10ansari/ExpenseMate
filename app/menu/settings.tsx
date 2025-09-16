import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/base/ThemedText";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { ScreenWrapper } from "@/components/main/ScreenWrapper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { List, Switch } from "react-native-paper";
import useSettings from "@/hooks/settings/useSettings";
import { Currency, Language } from "@/lib/types";
import { useLocalAuth } from "@/contexts/LocalAuthProvider";
import usePersistentAppStore from "@/stores/usePersistentAppStore";
import SettingSwitchListItem from "@/components/main/SettingSwitchListItem";
import SettingOptionListItem from "@/components/main/SettingOptionListItem";
import { CURRENCY_OPTIONS, LANGUAGE_OPTIONS } from "@/lib/constants";
import SettingButton from "@/components/main/SettingButton";


// UI Components
interface SettingSectionProps {
  icon: string;
  title: string;
  description: string;
  children: React.ReactNode;
}

const SettingSection = ({ icon, title, description, children }: SettingSectionProps) => {
  const { colors } = useAppTheme();
  const styles = StyleSheet.create({
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
  });

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons
          name={icon as any}
          size={24}
          color={colors.primary}
          style={styles.sectionIcon}
        />
        <ThemedText style={styles.sectionTitle}>
          {title}
        </ThemedText>
      </View>
      <ThemedText style={styles.descriptionText}>
        {description}
      </ThemedText>
      {children}
    </View>
  );
};


function SecureLoginSection() {
  const { colors } = useAppTheme();
  const {
    biometricLogin,
    isAuthenticationSupported,
    handleBiometricLoginToggle,
  } = useLocalAuth();

  const styles = StyleSheet.create({
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
  });

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons
          name="fingerprint"
          size={24}
          color={colors.primary}
          style={styles.sectionIcon}
        />
        <ThemedText style={styles.sectionTitle}>
          Secure Login
        </ThemedText>
      </View>

      <ThemedText style={styles.descriptionText}>
        Use fingerprint, face recognition, or device passcode to secure your app login.
      </ThemedText>

      <List.Item
        title="Enable Secure Login"
        description={
          !isAuthenticationSupported
            ? "Secure Login not supported on this device. Please set up device security (PIN, Pattern, Password, or Biometrics) to enable."
            : "Use biometrics or device lock to unlock the app"
        }
        titleStyle={[
          styles.listItemTitle,
          !isAuthenticationSupported && { opacity: 0.6 }
        ]}
        descriptionStyle={styles.listItemDescription}
        style={styles.listItem}
        descriptionNumberOfLines={5}
        left={(props) => (
          <List.Icon
            {...props}
            icon={
              isAuthenticationSupported
                ? (biometricLogin ? "fingerprint" : "fingerprint-off")
                : "fingerprint-off"
            }
            color={
              (isAuthenticationSupported && biometricLogin)
                ? colors.primary
                : colors.muted
            }
          />
        )}
        right={() => (
          <Switch
            value={biometricLogin}
            onValueChange={handleBiometricLoginToggle}
            disabled={!isAuthenticationSupported}
            style={{
              transform: [{ scale: 0.9 }],
              opacity: (!isAuthenticationSupported) ? 0.6 : 1
            }}
          />
        )}
        onPress={() => {
          if (isAuthenticationSupported) {
            handleBiometricLoginToggle(!biometricLogin);
          }
        }}
        disabled={!isAuthenticationSupported}
      />
    </View>
  );
}

interface LanguageSectionProps {
  language: Language;
  handleLanguageChange: (languageKey: Language) => void;
}

const LanguageSection = ({ language, handleLanguageChange }: LanguageSectionProps) => {
  const { colors } = useAppTheme();

  return (
    <SettingSection
      icon="translate"
      title="Language"
      description="Select your preferred language for the app interface. More languages will be added in future updates."
    >
      {LANGUAGE_OPTIONS.map((option) => (
        <SettingOptionListItem
          key={option.key}
          option={option}
          isSelected={language === option.key}
          onPress={() => option.available && handleLanguageChange(option.key)}
          colors={colors}
        />
      ))}
    </SettingSection>
  );
};

interface CurrencySectionProps {
  currency: Currency;
  handleCurrencyChange: (currencyKey: Currency) => void;
}

const CurrencySection = ({ currency, handleCurrencyChange }: CurrencySectionProps) => {
  const { colors } = useAppTheme();

  return (
    <SettingSection
      icon="currency-rupee"
      title="Currency"
      description="Choose your default currency for displaying amounts. Additional currencies will be supported soon."
    >
      {CURRENCY_OPTIONS.map((option) => (
        <SettingOptionListItem
          key={option.key}
          option={option}
          isSelected={currency === option.key}
          onPress={() => option.available && handleCurrencyChange(option.key)}
          colors={colors}
          leftIcon={option.available ? "currency-sign" : "clock-outline"}
        />
      ))}
    </SettingSection>
  );
};

interface HapticsSectionProps {
  haptics: any;
  handleHapticsToggle: (enabled: boolean) => void;
}

export const HapticsSection = ({ haptics, handleHapticsToggle }: HapticsSectionProps) => {
  return (
    <SettingSection
      icon="vibrate"
      title="Haptic Feedback"
      description="Control vibration feedback when interacting with the app."
    >
      <SettingSwitchListItem
        title="Enable Haptic Feedback"
        description="Feel vibrations when using the app"
        value={haptics.enabled}
        onValueChange={handleHapticsToggle}
        leftIcon={haptics.enabled ? "vibrate" : "vibrate-off"}
      />
    </SettingSection>
  );
};


const ComingSoonSection = () => {
  const { colors } = useAppTheme();

  const styles = StyleSheet.create({
    comingSoonBadge: {
      backgroundColor: colors.primaryContainer,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: "center",
      marginTop: 8,
    },
    comingSoonText: {
      color: colors.onPrimaryContainer,
      fontSize: 12,
      fontWeight: "600",
    },
  });

  return (
    <SettingSection
      icon="cog-outline"
      title="More Settings"
      description="Additional settings and customization options are being developed and will be available in future updates."
    >
      <View style={styles.comingSoonBadge}>
        <ThemedText style={styles.comingSoonText}>
          More options coming soon!
        </ThemedText>
      </View>
    </SettingSection>
  );
};



// Main Component
export default function SettingsScreen() {
  const updateUIFlag = usePersistentAppStore(state => state.updateUIFlag);
  const {
    language,
    currency,
    haptics,
    handleLanguageChange,
    handleCurrencyChange,
    handleHapticsToggle,
  } = useSettings();



  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 18,
    },
  });

  return (
    <ScreenWrapper background="card" withScrollView>
      <View style={styles.container}>
        <SettingSection
          icon="account-cog-outline"
          title="Show Onboarding"
          description="Revisit the onboarding screens to learn about the app features and setup."
        >
          <SettingButton
            title="Revisit Onboarding"
            onPress={() => updateUIFlag('onboardingCompleted', false)}
          />
        </SettingSection>
        <CurrencySection
          currency={currency}
          handleCurrencyChange={handleCurrencyChange}
        />
        <HapticsSection
          haptics={haptics}
          handleHapticsToggle={handleHapticsToggle}
        />
        <SecureLoginSection />
        <LanguageSection
          language={language}
          handleLanguageChange={handleLanguageChange}
        />
        <ComingSoonSection />
      </View>
    </ScreenWrapper>
  );
}
