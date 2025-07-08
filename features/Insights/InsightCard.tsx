import React from "react";
import { ThemedText } from "@/components/base/ThemedText";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { StyleSheet, View } from "react-native";
import { Card } from "react-native-paper";

type InsightCardProps = {
    title: string;
    value: React.ReactNode | string | number;
    icon?: React.ReactNode;
    /** Background color of the card */
    backgroundColor?: string;
    /** Color for all text inside the card */
    textColor?: string;
};

const InsightCard = ({
    title,
    value,
    icon,
    backgroundColor,
    textColor,
}: InsightCardProps) => {
    const { colors } = useAppTheme();

    const styles = StyleSheet.create({
        card: {
            flex: 1,
            overflow: 'hidden',
        },
        cardHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            gap: 8,
            paddingHorizontal: 4,
        },
        cardTitle: {
            fontSize: 16,
        },
        cardValue: {
            fontSize: 20,
            fontWeight: '700',
        },
    });

    // Fallback to theme text color if none provided
    const resolvedTextColor = textColor ?? colors.text;

    return (
        <Card style={[styles.card, backgroundColor && { backgroundColor }]}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    {icon}
                    <ThemedText
                        type="defaultSemiBold"
                        style={[styles.cardTitle, { color: resolvedTextColor }]}
                    >
                        {title}
                    </ThemedText>
                </View>
                <ThemedText style={[styles.cardValue, { color: resolvedTextColor }]}>
                    {value}
                </ThemedText>
            </Card.Content>
        </Card>
    );
};

export default InsightCard;