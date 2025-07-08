import React from "react";
import { ThemedText } from "@/components/base/ThemedText";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "react-native-paper";

type InsightCardProps = {
    title: string;
    value: React.ReactNode | string | number;
    icon?: React.ReactNode;
};

const InsightCard = ({ title, value, icon }: InsightCardProps) => {
    const { colors } = useAppTheme()

    const styles = StyleSheet.create({
        card: {
            flex: 1,
            overflow: 'hidden', // Needed for proper elevation rendering on Android
            // margin: 5,
        },
        cardHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            gap: 8,
            paddingHorizontal: 4,
        },
        primaryCardTitle: {
            fontSize: 16,
            color: colors.text,
        },
        primaryCardValue: {
            fontSize: 20,
            fontWeight: '700',
            color: colors.text,
        },
    });

    return (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    {icon}
                    <ThemedText type="defaultSemiBold" style={styles.primaryCardTitle}>{title}</ThemedText>
                </View>
                <Text style={styles.primaryCardValue}>
                    {value}
                </Text>
            </Card.Content>
        </Card>
    )


};

export default InsightCard;