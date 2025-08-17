import React from "react";
import { ThemedText } from "@/components/base/ThemedText";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { StyleProp, StyleSheet, TextStyle, View } from "react-native";
import { Card } from "react-native-paper";

type StatsCardProps = {
    title: string;
    value: React.ReactNode | string | number;
    icon?: React.ReactNode;
    /** Prefix to display before the value (can be text or icon) */
    prefix?: React.ReactNode;
    /** Suffix to display after the value (can be text or icon) */
    suffix?: React.ReactNode;
    /** Background color of the card */
    backgroundColor?: string;
    /** Color for all text inside the card */
    textColor?: string;
    titleStyle?: StyleProp<TextStyle>;
};


const StatsCard = ({
    title,
    value,
    icon,
    prefix,
    suffix,
    backgroundColor,
    textColor,
    titleStyle
}: StatsCardProps) => {
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
        cardValueContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        cardValue: {
            fontSize: 20,
            fontWeight: '700',
        },
    });


    // Fallback to theme text color if none provided
    const resolvedTextColor = textColor ?? colors.text;

    // Helper function to render prefix/suffix
    const renderTextOrNode = (item: React.ReactNode) => {
        if (typeof item === 'string') {
            return (
                <ThemedText style={[styles.cardValue, { color: resolvedTextColor }]}>
                    {item}
                </ThemedText>
            );
        }
        return item;
    };


    return (
        <Card style={[styles.card, backgroundColor && { backgroundColor }]}>
            <Card.Content>
                <View style={styles.cardHeader}>
                    {icon}
                    <ThemedText
                        type="defaultSemiBold"
                        style={[styles.cardTitle, { color: resolvedTextColor }, titleStyle]}
                    >
                        {title}
                    </ThemedText>
                </View>
                <View style={styles.cardValueContainer}>
                    {prefix && renderTextOrNode(prefix)}
                    <ThemedText style={[styles.cardValue, { color: resolvedTextColor }]}>
                        {value}
                    </ThemedText>
                    {suffix && renderTextOrNode(suffix)}
                </View>
            </Card.Content>
        </Card>
    );
};

export default StatsCard;