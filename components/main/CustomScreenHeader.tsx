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
      paddingTop: insets.top + (14 * scale), // Reduced from 18 to 14
      paddingBottom: 12 * scale, // Reduced from 16 to 12
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      minHeight: 48 * scale, // Reduced from 56 to 48
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
      alignItems: showBackButton ? "center" : "flex-start", // Dynamic alignment
      justifyContent: "center",
      // paddingHorizontal: showBackButton ? 16 : 0, // No padding when left-aligned
      // paddingLeft: showBackButton ? 16 : 0, // Only left padding when centered
      paddingHorizontal: 6
    },
    title: {
      fontSize: 28 * scale, // Reduced from 32 to 28
      fontWeight: "500",
      color: colors.onSurface,
      textAlign: showBackButton ? "center" : "left", // Dynamic text alignment
      lineHeight: 32 * scale, // Reduced from 36 to 32
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
