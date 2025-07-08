import React from "react";
import { ThemedText } from "@/components/base/ThemedText";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { Pressable, StyleSheet } from "react-native";
import { Card } from "react-native-paper";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import useInsightsStore from "@/stores/useInsightsStore";

type PeriodCardProps = {

};

const PeriodCard = ({ }: PeriodCardProps) => {
    const { colors } = useAppTheme()
    const router = useRouter();
    const period = useInsightsStore((state) => state.period);

    const styles = StyleSheet.create({
        card: {
            backgroundColor: colors.onSecondary,
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
        <Pressable
            onPress={handlePress}
        >
            <Card style={styles.card}>
                <Card.Content style={styles.cardContent}>
                    <ThemedText type="defaultSemiBold">
                        {period.label}
                    </ThemedText>
                    <FontAwesome name="chevron-down" size={18} color={colors.primary} />
                </Card.Content>
            </Card>
        </Pressable>
    )
};

export default PeriodCard;