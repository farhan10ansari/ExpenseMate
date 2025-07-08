import React from "react";
import { ThemedText } from "@/components/base/ThemedText";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { Animated, StyleProp, StyleSheet, Text, TextProps, View, ViewStyle } from "react-native";
import { Card } from "react-native-paper";

type InsightCardProps = {
    title: string;
    value: React.ReactNode | string | number;
    icon?: React.ReactNode;
    cardStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
    textStyle?: TextProps["style"]
};

const InsightCard = ({ title, value, icon, cardStyle, textStyle }: InsightCardProps) => {
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
        cardTitle: {
            fontSize: 16,
        },
        cardValue: {
            fontSize: 20,
            fontWeight: '700',
            color: colors.text,
        },
    });

    return (
        <Card style={[styles.card, cardStyle]}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    {icon}
                    <ThemedText type="defaultSemiBold" style={[styles.cardTitle, textStyle]}>{title}</ThemedText>
                </View>
                <ThemedText style={[styles.cardValue, textStyle]}>
                    {value}
                </ThemedText>
            </Card.Content>
        </Card>
    )


};

export default InsightCard;