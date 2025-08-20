import React, { useState } from "react";
import { ThemedText } from "@/components/base/ThemedText";
import { ThemedView } from "@/components/base/ThemedView";
import CustomChip from "@/components/ui/CustomChip";
import { useLocalization } from "@/hooks/useLocalization";
import { extractDateLabel, extractTimeString } from "@/lib/functions";
import { softDeleteIncomeById, getIncomeById } from "@/repositories/IncomeRepo";
import { DefaultIncomeSources } from "@/lib/constants";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { FontAwesome } from "@expo/vector-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Button, Dialog, Portal } from "react-native-paper";
import { ScrollView as GestureScrollView } from "react-native-gesture-handler";
import { tryCatch } from "@/lib/try-catch";
import useAppStore from "@/stores/useAppStore";
import FormSheetHeader from "@/components/main/FormSheetHeader";
import { hapticImpact, hapticNotify } from "@/features/Haptics/HapticsEngine";

// Build source mapping for icons/labels/colors
const sourceMapping = Object.fromEntries(DefaultIncomeSources.map(cat => [cat.name, cat]));

export default function IncomeInfoScreen() {
    const { colors } = useAppTheme();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { uses24HourClock } = useLocalization();
    const queryClient = useQueryClient();
    const navigation = useNavigation();
    const setGlobalSnackbar = useAppStore((state) => state.setGlobalSnackbar);
    const [showDeleteConfirmationDialog, setShowDeleteConfirmationDialog] = useState(false);
    const router = useRouter();

    const { data: income, isLoading, isError, error } = useQuery({
        queryKey: ['income', id],
        queryFn: async () => getIncomeById(id),
        enabled: !!id,
        staleTime: Infinity,
    });

    const styles = StyleSheet.create({
        container: {
            backgroundColor: colors.card,
        },
        mainContainer: {
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: 20,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
            color: colors.tertiary
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
        editButton: {},
        editButtonText: {},
        deleteButton: {
            backgroundColor: colors.error,
        },
        deleteButtonText: {
            color: colors.onError,
        },
    });

    const handleDelete = async () => {
        const { error } = await tryCatch(softDeleteIncomeById(id));
        if (error) {
            hapticNotify("error");
            setGlobalSnackbar({
                message: 'Error in deleting income',
                duration: 2000,
                actionLabel: 'Dismiss',
                actionIcon: 'close',
                type: 'error',
                position: 'bottom',
                offset: 80,
            });
        } else {
            hapticNotify("success");
            queryClient.invalidateQueries({ queryKey: ['incomes'] });
            queryClient.invalidateQueries({ queryKey: ['stats', 'income'] });
            navigation.goBack();
            setGlobalSnackbar({
                message: 'Successfully deleted income',
                duration: 2000,
                actionLabel: 'Dismiss',
                actionIcon: 'close',
                type: 'success',
                position: 'bottom',
                offset: 80,
            });
        }
    }

    const handleEdit = () => {
        hapticImpact("light");
        router.push(`/income/${id}/edit`);
    }

    if (isError) {
        return (
            <ThemedView style={[styles.mainContainer, { minHeight: 200 }]}>
                <ThemedText type="title" style={styles.title} color={colors.error}>Error</ThemedText>
                <ThemedText>{error instanceof Error ? error.message : "An unexpected error occurred."}</ThemedText>
            </ThemedView>
        );
    }

    const timeString = income?.dateTime ? extractTimeString(income?.dateTime, uses24HourClock) : "";
    const dateLabel = income?.dateTime ? extractDateLabel(income?.dateTime) : "";
    const formattedDateTime = income?.dateTime ? `${dateLabel} at ${timeString}` : "Not Provided";
    const sourceDef = income?.source ? sourceMapping[income.source] || sourceMapping["other"] : null;

    return (
        <ThemedView style={styles.container}>
            <FormSheetHeader
                title="Income Info"
                onClose={() => navigation.goBack()}
            />
            <View style={styles.mainContainer}>
                <View>
                    {/* Amount */}
                    <InfoRow
                        label="Amount"
                        content={
                            <View style={styles.amountContentContainer}>
                                <FontAwesome name="rupee" size={24} color={colors.tertiary || colors.primary} />
                                <ThemedText type="defaultSemiBold" color={colors.tertiary || colors.primary} fontSize={24}>
                                    {income?.amount ? income.amount.toLocaleString() : "Not Provided"}
                                </ThemedText>
                            </View>
                        }
                    />
                    {/* Source */}
                    <InfoRow
                        label="Source"
                        content={income?.source ?
                            <CustomChip
                                size="default"
                                variant="primary"
                                icon={sourceDef?.icon}
                                label={sourceDef?.label ?? ""}
                            // color={sourceDef?.color}
                            /> : "Not Provided"}
                    />
                    {/* Description */}
                    <InfoRow
                        label="Description"
                        content={income?.description ? <ThemedText>{income?.description}</ThemedText> : "Not Provided"}
                        layout={income?.description ? "vertical" : "horizontal"}
                        scrollable
                        height={100}
                    />
                    {/* Recurring */}
                    <InfoRow
                        label="Recurring"
                        content={income?.recurring ? (
                            <CustomChip size="default" variant="secondary" icon="repeat" label="Recurring" />
                        ) : "No"}
                    />
                    {/* Currency */}
                    <InfoRow
                        label="Currency"
                        content={income?.currency || "INR"}
                    />
                    {/* Date & Time */}
                    <InfoRow
                        label="Date & Time"
                        content={formattedDateTime}
                    />
                    {/* Action */}
                    <View style={styles.buttonContainer}>
                        <Button
                            mode="elevated"
                            style={[styles.button, styles.editButton]}
                            labelStyle={styles.editButtonText}
                            rippleColor={colors.rippleTertiary}
                            onPress={handleEdit}
                        >
                            Edit
                        </Button>
                        <Button
                            mode="elevated"
                            style={[styles.button, styles.deleteButton]}
                            labelStyle={styles.deleteButtonText}
                            onPress={() => {
                                hapticImpact("light");
                                setShowDeleteConfirmationDialog(true);
                            }}
                        >
                            Delete
                        </Button>
                    </View>
                </View>
                <Portal>
                    <Dialog visible={showDeleteConfirmationDialog} onDismiss={() => setShowDeleteConfirmationDialog(false)}>
                        <Dialog.Title>Delete Income?</Dialog.Title>
                        <Dialog.Content>
                            <ThemedText>Are you sure you want to delete this income? This action cannot be undone.</ThemedText>
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setShowDeleteConfirmationDialog(false)}>Cancel</Button>
                            <Button onPress={handleDelete} textColor={colors.error}>Delete</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
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
            width: layout === "vertical" ? "100%" : '50%',
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
                    <GestureScrollView
                        keyboardShouldPersistTaps="handled"
                        style={styles.scrollableContentContainer}
                    >
                        {content}
                    </GestureScrollView>
                ) : (
                    <View style={styles.contentContainer}>
                        {content}
                    </View>
                )
            }
        </View>
    )
};
