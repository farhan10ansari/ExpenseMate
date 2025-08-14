import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenWrapperProps = {
    header: React.ReactNode;
    children: React.ReactNode;
    style?: object;
    background?: "card" | "background";
    withScrollView?: boolean;
};

export function ScreenWrapper({ header, children, style, background = "card", withScrollView = false }: ScreenWrapperProps) {
    const { colors } = useAppTheme();
    const insets = useSafeAreaInsets()

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: background === "background" ? colors.background : colors.card,
            paddingLeft: insets.left,
            paddingRight: insets.right,
        },
        content: {
            flex: 1,
        },
    });
    const content = (
        <View style={styles.content}>
            {children}
        </View>
    )
    return (
        <View style={[styles.container, style]}>
            {/* Render header at the top */}
            {header}
            {/* Main content below header */}
            {withScrollView ? (
                <ScrollView
                    contentContainerStyle={{ paddingBottom: insets.bottom }}
                    showsVerticalScrollIndicator={false}
                >
                    {content}
                </ScrollView>
            ) : (
                content
            )}
        </View>
    );
}

