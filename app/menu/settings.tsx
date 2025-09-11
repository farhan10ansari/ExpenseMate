import { AppState, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/base/ThemedText";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { ScreenWrapper } from "@/components/main/ScreenWrapper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { List, Switch } from "react-native-paper";
import useSettings from "@/hooks/settings/useSettings";
import { Currency, Language } from "@/lib/types";
import { useLocalAuth } from "@/contexts/LocalAuthProvider";
import { useEffect } from "react";

interface SettingOption {
  label: string;
  description: string;
  available: boolean;
}
interface LanguageOption extends SettingOption {
  key: Language;
}
interface CurrencyOption extends SettingOption {
  key: Currency;
  symbol: string;
}

const LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    key: "english",
    label: "English",
    description: "Default language",
    available: true,
  },
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

const CURRENCY_OPTIONS: CurrencyOption[] = [
  {
    key: "rupees",
    label: "Indian Rupee (₹)",
    description: "INR - Default currency",
    symbol: "₹",
    available: true,
  },
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

interface OptionListItemProps {
  option: LanguageOption | CurrencyOption;
  isSelected: boolean;
  onPress: () => void;
  colors: any;
  leftIcon?: string;
}

const OptionListItem = ({ option, isSelected, onPress, colors, leftIcon }: OptionListItemProps) => {
  const styles = StyleSheet.create({
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

  return (
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
          icon={leftIcon || (option.available ? "check-circle" : "clock-outline")}
          color={option.available ? colors.primary : colors.muted}
        />
      )}
      right={() => (
        <>
          {isSelected && option.available && (
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
      onPress={onPress}
      disabled={!option.available}
    />
  );
};

interface SwitchListItemProps {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  leftIcon: string;
  disabled?: boolean;
  onPress?: () => void;
}

const SwitchListItem = ({
  title,
  description,
  value,
  onValueChange,
  leftIcon,
  disabled = false,
  onPress
}: SwitchListItemProps) => {
  const { colors } = useAppTheme();
  const styles = StyleSheet.create({
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
    <List.Item
      title={title}
      description={description}
      titleStyle={[
        styles.listItemTitle,
        disabled && { opacity: 0.6 }
      ]}
      descriptionStyle={styles.listItemDescription}
      style={styles.listItem}
      left={(props) => (
        <List.Icon
          {...props}
          icon={leftIcon}
          color={value && !disabled ? colors.primary : colors.muted}
        />
      )}
      right={() => (
        <Switch
          value={value && !disabled}
          onValueChange={onValueChange}
          disabled={disabled}
          style={{
            transform: [{ scale: 0.9 }],
            opacity: disabled ? 0.6 : 1
          }}
        />
      )}
      onPress={onPress || (() => !disabled && onValueChange(!value))}
      disabled={disabled}
    />
  );
};


function BiometricLoginSection() {
  const { colors } = useAppTheme();
  const {
    biometricLogin,
    isAuthenticationSupported,
    handleBiometricLoginToggle,
    refresh
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


  useEffect(() => {
    refresh();
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        // App has come to the foreground, refresh biometric support status
        refresh();
      }
    });
    return () => {
      subscription.remove();
    };
  }, []);


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
          Biometric Login
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
        <OptionListItem
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
        <OptionListItem
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

const HapticsSection = ({ haptics, handleHapticsToggle }: HapticsSectionProps) => {
  return (
    <SettingSection
      icon="vibrate"
      title="Haptic Feedback"
      description="Control vibration feedback when interacting with the app."
    >
      <SwitchListItem
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
        <CurrencySection
          currency={currency}
          handleCurrencyChange={handleCurrencyChange}
        />
        <HapticsSection
          haptics={haptics}
          handleHapticsToggle={handleHapticsToggle}
        />
        <BiometricLoginSection />
        <LanguageSection
          language={language}
          handleLanguageChange={handleLanguageChange}
        />
        <ComingSoonSection />
      </View>
    </ScreenWrapper>
  );
}
