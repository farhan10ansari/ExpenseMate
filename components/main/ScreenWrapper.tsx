import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import React from "react";
import { View, StyleSheet } from "react-native";

type ScreenWrapperProps = {
    header: React.ReactNode;
    children: React.ReactNode;
    style?: object;
    background?: "card" | "background";
};

export function ScreenWrapper({ header, children, style, background = "card" }: ScreenWrapperProps) {
    const { colors } = useAppTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            // backgroundColor: colors.card,
            // backgroundColor: colors.background,
            backgroundColor: background === "background" ? colors.background : colors.card,

        },
        content: {
            flex: 1,
        },
    });
    return (
        <View style={[styles.container, style]}>
            {/* Render header at the top */}
            {header}
            {/* Main content below header */}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
}

