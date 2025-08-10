import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { ThemedText } from "@/components/base/ThemedText";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import { Divider } from "react-native-paper";

type HeaderProps = {
  title: string;
  description?: string;
  onBack?: () => void;
  style?: object;
  // background?: "card" | "background";
};

function CustomScreenHeader({
  title,
  description,
  onBack,
  style,
  // background = "card",
}: HeaderProps) {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleGoBack = () => {
    if (onBack) return onBack();
    if (navigation.canGoBack()) navigation.goBack();
  };


  return (
    <View
      style={{
        paddingTop: insets.top + 18,
        // backgroundColor: background === "background" ? colors.background : colors.card,

      }}
    >
      <View style={[headerStyles.headerContainer, style]}>
        {/* Make Pressable perfectly round with no inner padding */}
        <Pressable
          style={headerStyles.backButton}
          onPress={handleGoBack}
          android_ripple={{ color: colors.surfaceVariant, radius: 20 }}
          hitSlop={10}
        >
          <MaterialCommunityIcons name="chevron-left" size={40} color={colors.secondary} />
        </Pressable>
        <View style={headerStyles.titleArea}>
          <ThemedText
            type="title"
            style={[
              headerStyles.headerTitle,
              !description && headerStyles.headerTitleNoDescription,
              { color: colors.secondary, textAlign: "right" }
            ]}
            numberOfLines={1}
          >
            {title}
          </ThemedText>
          {description && (
            <ThemedText
              type="default"
              style={[
                headerStyles.headerDescription,
                { color: colors.muted, textAlign: "right" },
              ]}
              numberOfLines={1}
            >
              {description}
            </ThemedText>
          )}
        </View>
      </View>
      <Divider />
    </View>
  );
}

// Key changes: no horizontal padding on the container, even spacing
const headerStyles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingRight: 18, // Right padding for spacing
    paddingLeft: 12, // Left padding for spacing
    paddingBottom: 16,
    zIndex: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,     // Makes it a perfect circle
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",   // Required for ripple to respect borderRadius
    // No marginRight here, spacing will be inside container's padding
  },
  titleArea: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    minHeight: 48,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    minHeight: 40,
  },
  headerTitleNoDescription: {
    fontSize: 36,
    minHeight: 40,
    paddingVertical: 4,
  },
  headerDescription: {
    fontSize: 15,
    opacity: 0.85,
    marginTop: 2,
    fontWeight: "400",
    maxWidth: "98%",
  },
});

export default CustomScreenHeader;
