import { ThemedText } from "@/components/base/ThemedText";
import { ThemedView } from "@/components/base/ThemedView";
import CustomChip from "@/components/ui/CustomChip";
import SheetGrabber from "@/components/ui/SheetGrabber";
import { paymentMethodsMapping } from "@/lib/constants";
import { getExpenseById } from "@/repositories/expenses";
import useCategoriesStore from "@/stores/useCategoriesStore";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";


export default function ExpenseInfoScreen() {
    const { colors } = useAppTheme();
    const { id } = useLocalSearchParams<{ id: string }>();
    const categoryMapping = useCategoriesStore((state) => state.categoryMapping);

    const { data: expense, isLoading, isError, error } = useQuery({
        queryKey: ['expense', id],
        queryFn: async () => getExpenseById(id),
        enabled: !!id,
    });

    const formattedDateTime = new Date(expense?.dateTime ?? "").toLocaleString(undefined, {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
    });

    const styles = StyleSheet.create({
        container: {
            // flex: 1,
            backgroundColor: colors.card,
            paddingHorizontal: 20,
            paddingTop: 10, // Adjusted padding for SheetGrabber
            paddingBottom: 20, // Space at the bottom
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
            color: colors.primary
        },
        amountContentContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
        },
        buttonContainer: {
            paddingVertical: 30,
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
        },
        button: {
            width: '45%',
            maxWidth: 200,
        },
    });
    
    if (isError) {
        return (
            <ThemedView style={[styles.container, { minHeight: 200 }]}>
                <ThemedText type="title" style={styles.title} color={colors.error}>Error</ThemedText>
                <ThemedText>{error instanceof Error ? error.message : "An unexpected error occurred."}</ThemedText>
            </ThemedView>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <SheetGrabber />
            <View>
                <ThemedText type="title" style={styles.title}>Expense Details</ThemedText>
                {/* Amount */}
                <InfoRow
                    label="Amount"
                    content={
                        <View style={styles.amountContentContainer}>
                            <FontAwesome name="rupee" size={24} color={colors.primary} />
                            <ThemedText type="defaultSemiBold" color={colors.primary} fontSize={24}>
                                {expense?.amount ? expense.amount.toLocaleString() : "Not Provided"}
                            </ThemedText>
                        </View>
                    }
                />
                {/* Category */}
                <InfoRow
                    label="Category"
                    content={expense?.category ?
                        <CustomChip
                            size="default"
                            variant="primary"
                            icon={categoryMapping?.[expense.category]?.icon ?? undefined}
                            label={categoryMapping?.[expense.category]?.label}
                        /> : "Not Provided"}
                />
                {/* Notes */}
                <InfoRow
                    label="Notes"
                    content={expense?.description ? <ThemedText>
                        {expense?.description}
                    </ThemedText> : "Not Provided"}
                    fullWidthContent={expense?.description ? true : false}
                />

                {/* Payment Method */}
                <InfoRow label="Payment Method" content={expense?.paymentMethod ?
                    <CustomChip
                        size="default"
                        variant="tertiary"
                        icon={paymentMethodsMapping?.[expense.paymentMethod]?.icon}
                        label={paymentMethodsMapping?.[expense.paymentMethod]?.label}
                    /> : "Not Provided"
                } />
                {/* Date & Time */}
                <InfoRow label="Date & Time" content={formattedDateTime} />
                {/* Action */}
                <View style={styles.buttonContainer}>
                    <Button mode="elevated" style={styles.button}>Edit</Button>
                    <Button mode="elevated" style={styles.button}>Delete</Button>
                </View>
            </View>
        </ThemedView>
    );
}


const InfoRow = ({ label, content, fullWidthContent = false }: {
    label: string,
    content: React.ReactNode | string,
    fullWidthContent?: boolean
}) => {
    const { colors } = useAppTheme();
    const styles = StyleSheet.create({
        infoRow: {
            flexDirection: fullWidthContent ? "column" : 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderColor: colors.border,
        },
        label: {
            fontSize: 16,
            fontWeight: '500',
            width: fullWidthContent ? "100%" : '50%', // Adjust width as needed
        },
        textContent: {
            color: colors.text,
            width: fullWidthContent ? "100%" : '50%',
            textAlign: fullWidthContent ? "left" : "right",
        },
        contentContainer: {
            flexDirection: "row",
            width: fullWidthContent ? "100%" : '50%',
            justifyContent: fullWidthContent ? 'flex-start' : 'flex-end',
        }

    });

    const isStringContent = typeof content === 'string';

    return (
        <View style={styles.infoRow}>
            <ThemedText style={styles.label} color={colors.text}>{label}:</ThemedText>
            {
                isStringContent ? (
                    <ThemedText style={styles.textContent}>
                        {content}
                    </ThemedText>
                ) : (
                    <View style={styles.contentContainer}>
                        {content}
                    </View>
                )
            }
        </View>
    )
};

