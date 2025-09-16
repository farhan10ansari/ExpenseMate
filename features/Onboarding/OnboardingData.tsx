import LottieView from 'lottie-react-native';
import { Icon } from 'react-native-paper';
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { useMemo } from "react";
import ThemeSelector from '@/components/main/ThemeSelector';
import useSettings from '@/hooks/settings/useSettings';
import SettingSwitchListItem from '@/components/main/SettingSwitchListItem';

export interface OnboardingStep {
  id: string;
  type: 'intro' | 'setting';
  title: string;
  description: string;
  settingKey?: keyof Settings;
  options?: { label: string; value: string | boolean }[];
  icon?: React.ReactNode | string;
  lottie?: React.ReactNode;
  component?: React.ReactNode;
}

export interface Settings {
  theme: string;
  language: string;
  currency: string;
  secureLogin: boolean;
  haptics: boolean;
}

const APP_NAME = process.env.EXPO_PUBLIC_APP_NAME ?? 'Expense Manager';

export const useOnboardingData = () => {
  const theme = useAppTheme();
  const {
    haptics,
    handleHapticsToggle,
  } = useSettings();

  return useMemo<OnboardingStep[]>(() => ([
    {
      id: '1',
      type: 'intro',
      title: `Welcome to ${APP_NAME}`,
      description: 'Your smart companion for tracking expenses, managing budgets, and gaining insights into your spending habits. Take control of your finances with ease.',
      lottie: <LottieView source={require('../../assets/lottie/onboarding.json')} autoPlay loop style={{ height: "100%", width: "100%" }} />
    },
    {
      id: '2',
      type: 'intro',
      title: 'Track Every Transaction',
      description: 'Easily manage your incomes and expenses with customizable categories and payment methods. All data stored locally for your privacy.',
      icon: <Icon source={"chart-bar"} size={120} color={theme.colors.primary} />
    },
    {
      id: '3',
      type: 'intro',
      title: 'Smart Insights',
      description: 'Analyze spending patterns and track your financial progress with our intuitive, fast interface. View detailed statistics across different time periods.',
      icon: <Icon source={"lightbulb-on-outline"} size={120} color={"orange"} />
    },
    {
      id: '4',
      type: 'setting',
      title: 'Choose Your Theme',
      description: 'Choose your preferred theme for the app. System theme will automatically switch between light and dark based on your device settings.',
      settingKey: 'theme',
      component: <ThemeSelector />,
      icon: <Icon source={"palette-outline"} size={120} color={theme.colors.primary} />
    },
    // {
    //   id: '5',
    //   type: 'setting',
    //   title: 'Default Currency',
    //   description: 'Set your primary currency for expense tracking.',
    //   settingKey: 'currency',
    //   options: [
    //     { label: 'US Dollar (USD)', value: 'USD' },
    //     { label: 'Euro (EUR)', value: 'EUR' },
    //     { label: 'British Pound (GBP)', value: 'GBP' },
    //     { label: 'Indian Rupee (INR)', value: 'INR' },
    //   ],
    //   icon: 'currency-rupee',
    // },
    // {
    //   id: '6',
    //   type: 'setting',
    //   title: 'Language Preference',
    //   description: 'Select your preferred language for the app interface.',
    //   settingKey: 'language',
    //   options: [
    //     { label: 'English', value: 'en' },
    //     { label: 'Spanish', value: 'es' },
    //     { label: 'French', value: 'fr' },
    //     { label: 'German', value: 'de' },
    //     { label: 'Chinese', value: 'zh' },
    //   ],
    //   icon: 'translate',
    // },
    {
      id: '7',
      type: 'setting',
      title: 'Haptic Feedback',
      description: 'Enable vibration feedback for better interaction experience.',
      settingKey: 'haptics',
      component: <SettingSwitchListItem
        title="Enable Haptic Feedback"
        description="Feel vibrations when using the app"
        value={haptics.enabled}
        onValueChange={handleHapticsToggle}
        leftIcon={haptics.enabled ? "vibrate" : "vibrate-off"}
      />,
      icon: <Icon source={"vibrate"} size={120} color={theme.colors.primary} />,
    },
    {
      id: '8',
      type: 'intro',
      title: 'All Set!',
      description: `You're all set to take control of your finances with ${APP_NAME}. Let's get started!`,
      lottie: <LottieView source={require('../../assets/lottie/success.json')} autoPlay loop style={{ height: "100%", width: "100%" }} />
    }
  ]), [theme, haptics])

}
