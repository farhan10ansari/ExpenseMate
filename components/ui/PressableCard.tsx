import React from 'react';
import { Pressable, View, ViewStyle } from 'react-native';
import { ThemedText } from '@/components/base/ThemedText';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';

interface PressableCardProps {
  primaryLabel: string;
  secondaryLabel?: string;
  isSelected?: boolean;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary';
  style?: ViewStyle;
}

export default function PressableCard({
  primaryLabel,
  secondaryLabel,
  isSelected = false,
  onPress,
  variant = 'primary',
  style,
}: PressableCardProps) {
  const { colors } = useAppTheme();

  const getVariantColors = () => {
    const variants = {
      primary: {
        background: isSelected ? colors.primary : colors.surface,
        border: isSelected ? colors.primary : colors.outline,
        text: isSelected ? colors.onPrimary : colors.onSurface,
      },
      secondary: {
        background: isSelected ? colors.secondary : colors.surface,
        border: isSelected ? colors.secondary : colors.outline,
        text: isSelected ? colors.onSecondary : colors.onSurface,
      },
      tertiary: {
        background: isSelected ? colors.tertiary : colors.surface,
        border: isSelected ? colors.tertiary : colors.outline,
        text: isSelected ? colors.onTertiary : colors.onSurface,
      },
    };
    return variants[variant];
  };

  const variantColors = getVariantColors();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          borderRadius: 10,
          borderWidth: 1,
          borderColor: variantColors.border,
          backgroundColor: variantColors.background,
          paddingHorizontal: 20,
          paddingVertical: 12,
          minWidth: 80,
          minHeight: 40,
          justifyContent: 'center',
          alignItems: 'center',
          opacity: pressed ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        style,
      ]}
    >
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <ThemedText
          style={{
            fontSize: secondaryLabel ? 12 : 14,
            fontWeight: '600',
            textAlign: 'center',
            color: variantColors.text,
            lineHeight: secondaryLabel ? 13 : 14,
            marginBottom: secondaryLabel ? 2 : 0,
          }}
        >
          {primaryLabel}
        </ThemedText>
        {secondaryLabel && (
          <ThemedText
            style={{
              fontSize: 12,
              textAlign: 'center',
              color: variantColors.text,
              opacity: 0.8,
              lineHeight: 12,
            }}
          >
            {secondaryLabel}
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
}
