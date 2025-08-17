import React from "react";
import { View, StyleSheet, Pressable, ViewStyle, StyleProp, useWindowDimensions } from "react-native";
import { ThemedText } from "@/components/base/ThemedText";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";

type HeaderProps = {
  title: string;
  description?: string;
  onBack?: () => void;
  style?: StyleProp<ViewStyle>;
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
  const { height } = useWindowDimensions();
  const scale = Math.min(height / 800, 1); // Scale down for screens smaller than 800px

  const handleGoBack = () => {
    if (onBack) return onBack();
    if (navigation.canGoBack()) navigation.goBack();
  };

  const styles = StyleSheet.create({
    container: {
      paddingTop: (14 * scale), // removed insets.top because it's already applied in ScreenWrapper
      paddingBottom: 12 * scale,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      minHeight: 48 * scale,
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
    titleContainer: {
      flex: 1,
      alignItems: showBackButton ? "center" : "flex-start",
      justifyContent: "center",
      paddingHorizontal: 6
    },
    title: {
      fontSize: 28 * scale,
      fontWeight: "500",
      color: colors.onSurface,
      textAlign: showBackButton ? "center" : "left",
      lineHeight: 32 * scale,
    },
    description: {
      fontSize: 14 * scale,
      color: colors.onSurfaceVariant,
      textAlign: showBackButton ? "center" : "left", // Dynamic text alignment
      marginTop: 2,
      opacity: 0.85,
      fontWeight: "400",
    },
    placeholder: {
      width: showBackButton ? 44 * scale : 0, // Hide placeholder when no back button
      height: 44 * scale,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {/* Left side - Back button only when needed */}
      {showBackButton && (
        <Pressable
          style={styles.backButton}
          onPress={handleGoBack}
          android_ripple={{
            color: colors.ripplePrimary,
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
      )}

      {/* Title container with dynamic alignment */}
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

      {/* Right side placeholder only when back button exists */}
      <View style={styles.placeholder} />
    </View>
  );
}

export default CustomScreenHeader;
