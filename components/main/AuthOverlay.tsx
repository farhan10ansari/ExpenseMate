import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { ThemedView } from "../base/ThemedView";
import { Icon, IconButton } from "react-native-paper";
import { View, StyleSheet } from "react-native";

interface AuthOverlayProps {
    isAuthenticating: boolean;
    onAuthenticate: () => void;
}

const AuthOverlay = ({ isAuthenticating, onAuthenticate }: AuthOverlayProps) => {
    const { colors } = useAppTheme();
    return (
        <ThemedView style={styles.authOverlay}>
            <ThemedView style={styles.authContent}>
                <Icon
                    source="lock"
                    size={64}
                    color={colors.onSurfaceVariant}
                />
                {!isAuthenticating && (
                    <View style={styles.actionContainer}>
                        <IconButton
                            icon="fingerprint"
                            mode="contained"
                            size={40}
                            onPress={onAuthenticate}
                            iconColor={colors.primary}
                        />
                    </View>
                )}
            </ThemedView>
        </ThemedView>
    );
};

export default AuthOverlay;

const styles = StyleSheet.create({
    authOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999,
    },
    authContent: {
        padding: 48,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 280,
    },
    actionContainer: {
        marginTop: 24,
        alignItems: 'center'
    }
});