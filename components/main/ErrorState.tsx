import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/base/ThemedText";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";

interface ErrorStateProps {
    title?: string;
    message?: string;
    error?: Error | unknown;
    onRetry?: () => void;
    retryLabel?: string;
    showRestartHint?: boolean;
    icon?: string;
    style?: object;
}

export default function ErrorState({
    title = "Something went wrong",
    message,
    error,
    onRetry,
    retryLabel = "Retry",
    showRestartHint = true,
    icon = "alert-circle-outline",
    style,
}: ErrorStateProps) {
    const { colors } = useAppTheme();

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 24,
            paddingVertical: 32,
        },
        icon: {
            marginBottom: 16,
        },
        title: {
            fontSize: 18,
            fontWeight: "600",
            color: colors.onSurface,
            marginBottom: 8,
            textAlign: "center",
        },
        message: {
            fontSize: 14,
            color: colors.error,
            marginBottom: 12,
            textAlign: "center",
            lineHeight: 20,
        },
        hint: {
            fontSize: 14,
            color: colors.onSurfaceVariant,
            marginBottom: 24,
            textAlign: "center",
            opacity: 0.8,
        },
        retryButton: {
            marginBottom: 16,
            paddingHorizontal: 24,
        },
        footer: {
            fontSize: 12,
            color: colors.onSurfaceVariant,
            textAlign: "center",
            opacity: 0.6,
            fontStyle: "italic",
        },
    });

    // Extract error message
    const errorMessage = message || (error instanceof Error ? error.message : "Unknown error occurred");

    return (
        <View style={[styles.container, style]}>
            <MaterialCommunityIcons
                name={icon as any}
                size={48}
                color={colors.error}
                style={styles.icon}
            />

            <ThemedText style={styles.title}>
                {title}
            </ThemedText>

            <ThemedText style={styles.message}>
                {errorMessage}
            </ThemedText>

            {onRetry && (
                <Button
                    mode="contained"
                    onPress={onRetry}
                    style={styles.retryButton}
                    icon="refresh"
                >
                    {retryLabel}
                </Button>
            )}

            {showRestartHint && (
                <ThemedText style={styles.footer}>
                    If the problem persists, try restarting the app.
                </ThemedText>
            )}
        </View>
    );
}
