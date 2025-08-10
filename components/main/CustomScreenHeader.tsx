import React from "react";
import { View, StyleSheet, Pressable, Dimensions } from "react-native";
import { ThemedText } from "@/components/base/ThemedText";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";

type HeaderProps = {
  title: string;
  description?: string;
  onBack?: () => void;
  style?: object;
  showBackButton?: boolean;
};

function CustomScreenHeader({
  title,
  description,
  onBack,
  style,
  showBackButton = true,
}: HeaderProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Simple scaling based on screen height
  const { height } = Dimensions.get('window');
  const scale = Math.min(height / 800, 1); // Scale down for screens smaller than 800px

  const handleGoBack = () => {
    if (onBack) return onBack();
    if (navigation.canGoBack()) navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      paddingTop: insets.top + (18 * scale),
      paddingBottom: 16 * scale,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      minHeight: 56 * scale,
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
    backButton: {
      width: 44 * scale,
      height: 44 * scale,
      borderRadius: 22 * scale,
      backgroundColor: colors.surfaceVariant + '30',
      justifyContent: "center",
      alignItems: "center",
      elevation: 1,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    backButtonPlaceholder: {
      width: 44 * scale,
      height: 44 * scale,
    },
    titleContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 16,
    },
    title: {
      fontSize: 32 * scale,
      fontWeight: "500",
      color: colors.onSurface,
      textAlign: "center",
      lineHeight: 36 * scale,
    },
    description: {
      fontSize: 14 * scale,
      color: colors.onSurfaceVariant,
      textAlign: "center",
      marginTop: 2,
      opacity: 0.85,
      fontWeight: "400",
    },
    placeholder: {
      width: 44 * scale,
      height: 44 * scale, // Match back button height for alignment
    },
    divider: {
      opacity: 0.2,
      height: 1,
    },
  });

  return (
    <>
      <View style={[styles.container, style]}>
        {/* Left side - Back button or placeholder */}
        {showBackButton ? (
          <Pressable
            style={styles.backButton}
            onPress={handleGoBack}
            android_ripple={{
              color: colors.primary + '20',
              radius: 22 * scale,
              borderless: false
            }}
            hitSlop={8}
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={26 * scale}
              color={colors.onSurfaceVariant}
            />
          </Pressable>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}

        {/* Centered title container */}
        <View style={styles.titleContainer}>
          <ThemedText style={styles.title} numberOfLines={1}>
            {title}
          </ThemedText>
          {description && (
            <ThemedText style={styles.description} numberOfLines={1}>
              {description}
            </ThemedText>
          )}
        </View>

        {/* Right side placeholder for balance */}
        <View style={styles.placeholder} />
      </View>
    </>
  );
}

export default CustomScreenHeader;
