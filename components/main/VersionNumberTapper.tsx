import React, { useRef, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { ThemedText } from "@/components/base/ThemedText";
import usePersistentAppStore from "@/stores/usePersistentAppStore";
import CustomSnackbar from "@/components/ui/CustomSnackbar";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";

export default function VersionNumberTapper() {
    const { colors } = useAppTheme();
    const showDevOptions = usePersistentAppStore((state) => state.showDevOptions);
    const setShowDevOptions = usePersistentAppStore((state) => state.setShowDevOptions);

    // Snackbar state
    const [isSnackbarVisible, setSnackbarVisibility] = useState(false);
    const [snackbarText, setSnackbarText] = useState("");

    const tapCountRef = useRef(0);
    const lastTapTimeRef = useRef(0);

    // Your version tap handler with 'already enabled' handling
    const handleVersionTap = () => {
        const now = Date.now();
        if (now - lastTapTimeRef.current > 1000) tapCountRef.current = 0;
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

    return (
        <>
            <Pressable onPress={handleVersionTap}>
                <ThemedText style={{ opacity: 0.8 }}>
                    1.0.0
                </ThemedText>
            </Pressable>
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
        </>
    );
}