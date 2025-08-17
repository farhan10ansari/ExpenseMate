import React from "react";
import { ThemedText } from "@/components/base/ThemedText";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { Pressable, StyleSheet, View } from "react-native";
import { Card } from "react-native-paper";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import useStatsStore from "@/stores/useStatsStore";

type PeriodCardProps = {

};

const PeriodCard = ({ }: PeriodCardProps) => {
    const { colors, dark } = useAppTheme()
    const router = useRouter();
    const period = useStatsStore((state) => state.period);

    const styles = StyleSheet.create({
        card: {
            backgroundColor: colors.onSecondary,
            overflow: 'hidden', // to ensure the android ripple effect doesn't overflow
        },
        cardContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
        },
    });

    const handlePress = () => {
        // Navigate to the period selection screen
        router.push("/helper-screens/select-insights-period");
    };

    return (
        <Card style={styles.card}>
            <Pressable
                onPress={handlePress}
                android_ripple={{ color: colors.ripplePrimary }}
            >
                <Card.Content style={styles.cardContent}>
                    <ThemedText type="defaultSemiBold">
                        {period.label}
                    </ThemedText>
                    <FontAwesome name="chevron-down" size={18} color={colors.primary} />
                </Card.Content>
            </Pressable>
        </Card>
    )
};

export default PeriodCard;