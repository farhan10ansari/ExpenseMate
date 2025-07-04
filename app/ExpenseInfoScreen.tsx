import { ThemedText } from "@/components/base/ThemedText";
import { ThemedView } from "@/components/base/ThemedView";
import CustomChip from "@/components/ui/CustomChip";
import SheetGrabber from "@/components/ui/SheetGrabber";
import { useLocalization } from "@/hooks/useLocalization";
import { paymentMethodsMapping } from "@/lib/constants";
import { extractDateLabel, extractTimeString } from "@/lib/functions";
import { softDeleteExpenseById, getExpenseById } from "@/repositories/expenses";
import useCategoriesStore from "@/stores/useCategoriesStore";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { ScrollView as GestureScrollView } from "react-native-gesture-handler";
import { tryCatch } from "@/lib/try-catch";
import useAppStore from "@/stores/useAppStore";

export default function ExpenseInfoScreen() {
    const { colors } = useAppTheme();
    const { id } = useLocalSearchParams<{ id: string }>();
    const categoryMapping = useCategoriesStore((state) => state.categoryMapping);
    const { uses24HourClock } = useLocalization();
    const queryClient = useQueryClient();
    const navigation = useNavigation()
    const setGlobalSnackbar = useAppStore((state) => state.setGlobalSnackbar);

    const { data: expense, isLoading, isError, error } = useQuery({
        queryKey: ['expense', id],
        queryFn: async () => getExpenseById(id),
        enabled: !!id,
        staleTime: Infinity,
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
        editButton: {
        },
        editBUttonText: {
        },
        deleteButton: {
            backgroundColor: colors.error,
        },
        deleteButtonText: {
            color: colors.onError,
        },
    });

    const handleDelete = async () => {
        const { error } = await tryCatch(softDeleteExpenseById(id))
        if (error) {
            setGlobalSnackbar({
                message: 'Error in deleting expense',
                duration: 2000,
                actionLabel: 'Dismiss',
                actionIcon: 'close',
                type: 'error',
                position: 'bottom',
                offset: 80,
            });
        }
        else {
            queryClient.invalidateQueries({ queryKey: ['expenses'] });
            navigation.goBack()
            setGlobalSnackbar({
                message: 'Successfully deleted expense',
                duration: 2000,
                actionLabel: 'Dismiss',
                actionIcon: 'close',
                type: 'success',
                position: 'bottom',
                offset: 80,
            });
        }
    }

    if (isError) {
        return (
            <ThemedView style={[styles.container, { minHeight: 200 }]}>
                <ThemedText type="title" style={styles.title} color={colors.error}>Error</ThemedText>
                <ThemedText>{error instanceof Error ? error.message : "An unexpected error occurred."}</ThemedText>
            </ThemedView>
        );
    }

    const timeString = expense?.dateTime ? extractTimeString(expense?.dateTime, uses24HourClock) : "";
    const dateLabel = expense?.dateTime ? extractDateLabel(expense?.dateTime) : ""
    const formattedDateTime = expense?.dateTime ? `${dateLabel} at ${timeString}` : "Not Provided";

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
                    layout={expense?.description ? "vertical" : "horizontal"}
                    scrollable
                    height={100}
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
                    <Button
                        mode="elevated"
                        style={[styles.button, styles.editButton]}
                        labelStyle={styles.editBUttonText}
                        rippleColor={colors.primary}
                    >
                        Edit
                    </Button>
                    <Button
                        mode="elevated"
                        style={[styles.button, styles.deleteButton]}
                        labelStyle={styles.deleteButtonText}
                        onPress={handleDelete}
                    >
                        Delete
                    </Button>
                </View>
            </View>
        </ThemedView>
    );
}


const InfoRow = ({ label, content, layout = "horizontal", scrollable = false, height }: {
    label: string,
    content: React.ReactNode | string,
    layout?: "horizontal" | "vertical",
    scrollable?: boolean,
    height?: number
}) => {
    const { colors } = useAppTheme();
    const styles = StyleSheet.create({
        infoRow: {
            flexDirection: layout === "vertical" ? "column" : 'row',
            justifyContent: 'space-between',
            paddingVertical: 10,
            borderBottomWidth: 1,
            borderColor: colors.border,
        },
        label: {
            fontSize: 16,
            fontWeight: '600',
            width: layout === "vertical" ? "100%" : '50%', // Adjust width as needed
        },
        textContent: {
            color: colors.text,
            width: layout === "vertical" ? "100%" : '50%',
            textAlign: layout === "vertical" ? "left" : "right",
        },
        contentContainer: {
            flexDirection: "row",
            width: layout === "vertical" ? "100%" : '50%',
            justifyContent: layout === "vertical" ? 'flex-start' : 'flex-end',
        },
        scrollableContentContainer: {
            // flexDirection: "row",
            // width: layout === "vertical" ? "100%" : '50%',
            // justifyContent: layout === "vertical" ? 'flex-start' : 'flex-end',
            maxHeight: height
        },


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
                ) : scrollable ? (
                    // Using React Native Gesture handler ScrollView to fix formsheet close on scroll
                    <GestureScrollView
                        keyboardShouldPersistTaps="handled"
                        style={styles.scrollableContentContainer}
                    >
                        {content}
                    </GestureScrollView>
                )
                    : (
                        <View style={styles.contentContainer}>
                            {content}
                        </View>
                    )
            }
        </View>
    )
};

