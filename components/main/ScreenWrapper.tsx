import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import React from "react";
import { View, StyleSheet, ScrollView, ViewStyle, StyleProp } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenWrapperProps = {
    header: React.ReactNode;
    children: React.ReactNode;
    containerStyle?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    background?: "card" | "background";
    withScrollView?: boolean;
    isRefreshing?: boolean;
    onRefresh?: () => void;
};

export function ScreenWrapper({
    header,
    children,
    containerStyle,
    contentContainerStyle,
    background = "card",
    withScrollView = false,
    isRefreshing = false,
    onRefresh
}: ScreenWrapperProps) {
    const { colors } = useAppTheme();
    const insets = useSafeAreaInsets();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: background === "background" ? colors.background : colors.card,
            paddingLeft: insets.left,
            paddingRight: insets.right,
        },
        headerContainer: {
            paddingTop: insets.top,
        },
        content: {
            flex: 1,
        },
        nonScrollContent: {
            flex: 1,
            paddingBottom: insets.bottom,
        },
    });

    return (
        <View style={[styles.container, containerStyle]}>
            {/* Header with safe area top padding */}
            <View style={styles.headerContainer}>
                {header}
            </View>

            {/* Main content */}
            {withScrollView ? (
                <ScrollView
                    style={styles.content}
                    contentContainerStyle={[
                        { paddingBottom: insets.bottom },
                        contentContainerStyle
                    ]}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        onRefresh ? (
                            <RefreshControl
                                refreshing={isRefreshing}
                                onRefresh={onRefresh}
                            />
                        ) : undefined
                    }
                >
                    {children}
                </ScrollView>
            ) : (
                <View style={[styles.nonScrollContent, contentContainerStyle]}>
                    {children}
                </View>
            )}
        </View>
    );
}
