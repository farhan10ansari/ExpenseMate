import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Pressable, ScrollView } from "react-native";
import { ThemedText } from "@/components/base/ThemedText";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import * as Linking from "expo-linking";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomScreenHeader from "@/components/main/CustomScreenHeader";
import { ScreenWrapper } from "@/components/main/ScreenWrapper";
import usePersistentAppStore from "@/stores/usePersistentAppStore";
import CustomSnackbar from "@/components/ui/CustomSnackbar";
import Color from "color";

const APP_NAME = process.env.EXPO_PUBLIC_APP_NAME;
const APP_VERSION = process.env.EXPO_PUBLIC_APP_VERSION;
const APP_AUTHOR = process.env.EXPO_PUBLIC_APP_AUTHOR;
const APP_DESCRIPTION = process.env.EXPO_PUBLIC_APP_DESCRIPTION;
const TELEGRAM_URL = process.env.EXPO_PUBLIC_TELEGRAM_URL;
const CONTACT_EMAIL = process.env.EXPO_PUBLIC_CONTACT_EMAIL;

export default function AboutScreen() {
    const { colors } = useAppTheme();
    const showDevOptions = usePersistentAppStore((state) => state.showDevOptions);
    const setShowDevOptions = usePersistentAppStore((state) => state.setShowDevOptions);

    // Snackbar state
    const [isSnackbarVisible, setSnackbarVisibility] = useState(false);
    const [snackbarText, setSnackbarText] = useState("");

    const tapCountRef = useRef(0);
    const lastTapTimeRef = useRef(0);

    const handleRepoPress = () => {
        Linking.openURL("https://github.com/farhan10ansari/ExpenseMate");
    };

    const handleTelegramPress = () => {
        if (TELEGRAM_URL) {
            Linking.openURL(TELEGRAM_URL);
        }
    };

    const handleEmailPress = () => {
        if (CONTACT_EMAIL) {
            Linking.openURL(`mailto:${CONTACT_EMAIL}`);
        }
    };

    const handleVersionTap = () => {
        const now = Date.now();
        if (now - lastTapTimeRef.current > 2000) tapCountRef.current = 0;
        tapCountRef.current += 1;
        lastTapTimeRef.current = now;

        if (showDevOptions) {
            setSnackbarText("Dev options already enabled");
            setSnackbarVisibility(true);
            tapCountRef.current = 0;
            return;
        }

        if (tapCountRef.current >= 5) {
            setShowDevOptions(true);
            setSnackbarText("Dev options enabled");
            setSnackbarVisibility(true);
            tapCountRef.current = 0;
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: 18,
        },
        sectionContainer: {
            backgroundColor: colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
            elevation: 2,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        sectionHeader: {
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
        },
        sectionIcon: {
            marginRight: 12,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: "600",
            color: colors.primary,
        },
        descriptionText: {
            color: colors.muted,
            fontSize: 14,
            lineHeight: 20,
            marginBottom: 16,
        },
        appInfoContainer: {
            alignItems: "center",
            paddingVertical: 8,
        },
        appLogoIcon: {
            marginBottom: 12,
        },
        appName: {
            fontSize: 24,
            fontWeight: "bold",
            color: colors.primary,
            marginBottom: 4,
            textAlign: "center",
        },
        appAuthor: {
            fontSize: 16,
            color: colors.secondary,
            marginBottom: 4,
            textAlign: "center",
        },
        appVersion: {
            fontSize: 15,
            color: colors.muted,
            marginBottom: 8,
            textAlign: "center",
        },
        appDescription: {
            fontSize: 14,
            color: colors.text,
            textAlign: "center",
            opacity: 0.90,
            lineHeight: 20,
        },
    });

    return (
        <ScreenWrapper 
            header={<CustomScreenHeader title="About" />}
            background="card"
        >
            <ScrollView 
                style={styles.container} 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
            >
                {/* App Information Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons
                            name="information-outline"
                            size={24}
                            color={colors.primary}
                            style={styles.sectionIcon}
                        />
                        <ThemedText style={styles.sectionTitle}>
                            App Information
                        </ThemedText>
                    </View>

                    <View style={styles.appInfoContainer}>
                        <MaterialCommunityIcons 
                            name="wallet" 
                            size={48} 
                            color={colors.primary} 
                            style={styles.appLogoIcon} 
                        />
                        <ThemedText style={styles.appName}>{APP_NAME}</ThemedText>
                        <ThemedText style={styles.appAuthor}>by {APP_AUTHOR}</ThemedText>
                        <ThemedText style={styles.appVersion}>Version {APP_VERSION}</ThemedText>
                        {APP_DESCRIPTION && (
                            <ThemedText style={styles.appDescription}>
                                {APP_DESCRIPTION}
                            </ThemedText>
                        )}
                    </View>
                </View>

                {/* Version Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons
                            name="tag-outline"
                            size={24}
                            color={colors.primary}
                            style={styles.sectionIcon}
                        />
                        <ThemedText style={styles.sectionTitle}>
                            Version Details
                        </ThemedText>
                    </View>

                    <ThemedText style={styles.descriptionText}>
                        Tap the version number 5 times quickly to enable developer options for testing and debugging.
                    </ThemedText>

                    <AboutItem
                        icon="information-outline"
                        title="App Version"
                        description="Current version of the application"
                        onPress={handleVersionTap}
                    >
                        <ThemedText style={{ opacity: 0.8, fontWeight: "600" }}>
                            {APP_VERSION}
                        </ThemedText>
                    </AboutItem>
                </View>

                {/* Social Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons
                            name="account-group"
                            size={24}
                            color={colors.primary}
                            style={styles.sectionIcon}
                        />
                        <ThemedText style={styles.sectionTitle}>
                            Social & Community
                        </ThemedText>
                    </View>

                    <ThemedText style={styles.descriptionText}>
                        Connect with us on various platforms for updates, support, and community discussions.
                    </ThemedText>

                    <AboutItem
                        icon="github"
                        title="GitHub Repository"
                        description="View source code, report issues, or request features"
                        onPress={handleRepoPress}
                    />
                    {TELEGRAM_URL && (
                        <AboutItem
                            icon="send"
                            title="Telegram Community"
                            description="Join our community for discussions and support"
                            onPress={handleTelegramPress}
                        />
                    )}
                </View>

                {/* Contact Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons
                            name="email-outline"
                            size={24}
                            color={colors.primary}
                            style={styles.sectionIcon}
                        />
                        <ThemedText style={styles.sectionTitle}>
                            Get in Touch
                        </ThemedText>
                    </View>

                    <ThemedText style={styles.descriptionText}>
                        Have questions, feedback, or need support? We're here to help.
                    </ThemedText>

                    {CONTACT_EMAIL && (
                        <AboutItem
                            icon="email-outline"
                            title="Email Support"
                            description="Send us an email for direct contact and support"
                            onPress={handleEmailPress}
                        />
                    )}
                </View>
            </ScrollView>

            <CustomSnackbar
                usePortal
                visible={isSnackbarVisible}
                onDismiss={() => setSnackbarVisibility(false)}
                duration={2000}
                style={{ backgroundColor: colors.primary }}
                action={{
                    label: 'Dismiss',
                    icon: 'close',
                }}
                type="success"
                position="bottom"
                offset={0}
            >
                {snackbarText}
            </CustomSnackbar>
        </ScreenWrapper>
    );
}

// AboutItem component with consistent styling
interface AboutItemProps {
    icon: string;
    title: string;
    description: string;
    onPress?: () => void;
    children?: React.ReactNode;
}

function AboutItem({ icon, title, description, onPress, children }: AboutItemProps) {
    const { colors } = useAppTheme();

    const styles = StyleSheet.create({
        itemContainer: {
            borderRadius: 8,
            overflow: 'hidden',
            marginBottom: 8,
            backgroundColor: colors.inverseOnSurface,
        },
        itemPressable: {
            flexDirection: "row",
            alignItems: "flex-start",
            padding: 12,
        },
        itemIcon: {
            marginRight: 12,
            marginTop: 2,
        },
        itemContent: {
            flex: 1,
        },
        itemTitle: {
            fontSize: 16,
            fontWeight: "600",
            color: colors.text,
            marginBottom: 2,
        },
        itemDescription: {
            fontSize: 14,
            color: colors.muted,
            lineHeight: 18,
            marginBottom: children ? 4 : 0,
        },
    });

    return (
        <View style={styles.itemContainer}>
            <Pressable
                onPress={onPress}
                android_ripple={{
                    color: colors.ripplePrimary,
                    borderless: false,
                }}
            >
                <View style={styles.itemPressable}>
                    <MaterialCommunityIcons 
                        name={icon as any} 
                        size={20} 
                        color={colors.secondary} 
                        style={styles.itemIcon} 
                    />
                    <View style={styles.itemContent}>
                        <ThemedText style={styles.itemTitle}>
                            {title}
                        </ThemedText>
                        <ThemedText style={styles.itemDescription}>
                            {description}
                        </ThemedText>
                        {children}
                    </View>
                </View>
            </Pressable>
        </View>
    );
}
