import React from "react";
import { ThemedText } from "@/components/base/ThemedText";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { Pressable, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import useStatsStore from "@/stores/useStatsStore";
import { useQueryClient } from "@tanstack/react-query";
import { getAvailablePeriodsWithData } from "@/repositories/CommonRepo";


const PeriodCard = () => {
    const { colors } = useAppTheme()
    const router = useRouter();
    const period = useStatsStore((state) => state.period);
    const queryClient = useQueryClient();

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

    const handlePress = async () => {
        // Prefetch available periods data so it is ready when screen opens
        await queryClient.prefetchQuery({
            queryKey: ["stats", 'available-periods'],
            queryFn: getAvailablePeriodsWithData,
        });
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
                        {`${period.primaryLabel} ${period.secondaryLabel ? `${period.secondaryLabel}` : ''}`}
                    </ThemedText>
                    <FontAwesome name="chevron-down" size={18} color={colors.primary} />
                </Card.Content>
            </Pressable>
        </Card>
    )
};

export default PeriodCard;