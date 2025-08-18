import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { memo } from "react";
import { Pressable, StyleSheet, View } from "react-native";

const CustomBackButton = (({ onPress }: { onPress: () => void }) => {
    const { colors } = useAppTheme();

    const styles = StyleSheet.create({
        container:{
            borderRadius: 50,
            overflow: "hidden",
        },
        backButton: {
            width: 36,
            height: 36,
            borderRadius: 50,
            backgroundColor: colors.surfaceVariant + '30',
            justifyContent: "center",
            alignItems: "center",
            elevation: 1,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
    });

    return (
        <View style={styles.container}>
            <Pressable
                style={styles.backButton}
                onPress={onPress}
                android_ripple={{
                    color: colors.ripplePrimary,
                    borderless: false
                }}
                hitSlop={8}
            >
                <MaterialCommunityIcons
                    name="chevron-left"
                    size={24}
                    color={colors.onSurfaceVariant}
                />
            </Pressable>
        </View>
    );
})

export default memo(CustomBackButton);