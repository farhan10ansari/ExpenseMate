import { StyleSheet, View, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ScrollView } from "react-native";
import { ThemedText } from "@/components/base/ThemedText";
import { tryCatch } from "@/lib/try-catch";
import { seedDummyExpenses, seedDummyIncome } from "@/repositories/dev";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button, TextInput, Snackbar } from "react-native-paper";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { ScreenWrapper } from "@/components/main/ScreenWrapper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import usePersistentAppStore from "@/stores/usePersistentAppStore";
import { useRouter } from "expo-router";
import { useHaptics } from "@/contexts/HapticsProvider";

export default function DevOptionsScreen() {
  const queryClient = useQueryClient();
  const { colors } = useAppTheme();
  const router = useRouter();
  const [numberOfExpenses, setNumberOfExpenses] = useState(0);
  const [numberOfIncomes, setNumberOfIncomes] = useState(0);
  const updateUIFlag = usePersistentAppStore((state) => state.updateUIFlag);
  const { hapticNotify } = useHaptics();

  // Snackbar state
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">("success");

  const styles = StyleSheet.create({
    keyboardAvoidingView: {
      flex: 1,
    },
    container: {
      flex: 1,
      padding: 18,
    },
    scrollContentContainer: {
      paddingBottom: 120,
      flexGrow: 1,
    },
    sectionContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionIcon: {
      marginRight: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.primary,
    },
    inputContainer: {
      marginBottom: 16,
    },
    textInput: {
      backgroundColor: colors.surface,
    },
    button: {
      marginTop: 8,
    },
    warningContainer: {
      backgroundColor: colors.errorContainer,
      borderRadius: 8,
      padding: 12,
      marginBottom: 20,
      flexDirection: "row",
      alignItems: "flex-start",
    },
    warningIcon: {
      marginRight: 8,
      marginTop: 2,
    },
    warningText: {
      flex: 1,
      color: colors.onErrorContainer,
      fontSize: 14,
      lineHeight: 20,
    },
    helperText: {
      color: colors.muted,
      fontSize: 12,
      marginTop: 4,
    },
    disableSection: {
      borderColor: colors.error,
      borderWidth: 1,
    },
    snackbar: {
      marginBottom: 16,
    },
  });

  // Helper function to show snackbar
  const showSnackbar = (message: string, type: "success" | "error" = "success") => {
    setSnackbarMessage(message);
    setSnackbarType(type);
    setSnackbarVisible(true);
  };

  // Helper function to validate and clamp input values
  const validateInput = (value: string): number => {
    const num = Number(value) || 0;
    return Math.max(0, Math.min(1000, num));
  };

  // Check if input is valid (between 1-1000)
  const isValidInput = (value: number): boolean => {
    return value >= 1 && value <= 1000;
  };

  const handleExpenseInputChange = (text: string) => {
    const validatedValue = validateInput(text);
    setNumberOfExpenses(validatedValue);
  };

  const handleIncomeInputChange = (text: string) => {
    const validatedValue = validateInput(text);
    setNumberOfIncomes(validatedValue);
  };

  const handleInsertDummyExpenses = async () => {
    if (!isValidInput(numberOfExpenses)) return;

    const { error } = await tryCatch(seedDummyExpenses(numberOfExpenses));
    if (!error) {
      hapticNotify("success");
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['incomes'] });

      showSnackbar(`Successfully added ${numberOfExpenses} dummy expenses!`);
      setNumberOfExpenses(0);
    } else {
      hapticNotify("error");
      showSnackbar("Failed to add dummy expenses. Please try again.", "error");
    }
    Keyboard.dismiss();
  };

  const handleInsertDummyIncomes = async () => {
    if (!isValidInput(numberOfIncomes)) return;

    const { error } = await tryCatch(seedDummyIncome(numberOfIncomes));
    if (!error) {
      hapticNotify("success");
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });
      queryClient.invalidateQueries({ queryKey: ['incomes'] });

      showSnackbar(`Successfully added ${numberOfIncomes} dummy incomes!`);
      setNumberOfIncomes(0);
      Keyboard.dismiss();
    } else {
      hapticNotify("error");
      showSnackbar("Failed to add dummy incomes. Please try again.", "error");
    }
    Keyboard.dismiss();
  };

  const handleDisableDevOptions = () => {
    updateUIFlag("showDevOptions", false);
    showSnackbar("Developer options disabled successfully!");
    // Delay navigation to allow snackbar to show
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  return (
    <ScreenWrapper
      background="background"
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <ScrollView
              style={styles.container}
              contentContainerStyle={styles.scrollContentContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Warning Section */}
              <View style={styles.warningContainer}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={20}
                  color={colors.onErrorContainer}
                  style={styles.warningIcon}
                />
                <ThemedText style={styles.warningText}>
                  This section is for development purposes only. Use dummy data to test the app functionality.
                </ThemedText>
              </View>

              {/* Dummy Expenses Section */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons
                    name="receipt"
                    size={24}
                    color={colors.primary}
                    style={styles.sectionIcon}
                  />
                  <ThemedText style={styles.sectionTitle}>
                    Add Dummy Expenses
                  </ThemedText>
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    label="Number of Expenses"
                    keyboardType="numeric"
                    style={styles.textInput}
                    onChangeText={handleExpenseInputChange}
                    value={numberOfExpenses.toString()}
                    mode="outlined"
                    right={<TextInput.Icon icon="counter" />}
                    error={numberOfExpenses > 0 && !isValidInput(numberOfExpenses)}
                  />
                  <ThemedText style={styles.helperText}>
                    Enter a number between 1 and 1000
                  </ThemedText>
                </View>

                <Button
                  mode="contained"
                  style={styles.button}
                  onPress={handleInsertDummyExpenses}
                  disabled={!isValidInput(numberOfExpenses)}
                  icon="plus-circle"
                >
                  Insert {numberOfExpenses} Dummy Expenses
                </Button>
              </View>

              {/* Dummy Incomes Section */}
              <View style={styles.sectionContainer}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons
                    name="cash-plus"
                    size={24}
                    color={colors.primary}
                    style={styles.sectionIcon}
                  />
                  <ThemedText style={styles.sectionTitle}>
                    Add Dummy Incomes
                  </ThemedText>
                </View>

                <View style={styles.inputContainer}>
                  <TextInput
                    label="Number of Incomes"
                    keyboardType="numeric"
                    style={styles.textInput}
                    onChangeText={handleIncomeInputChange}
                    value={numberOfIncomes.toString()}
                    mode="outlined"
                    right={<TextInput.Icon icon="counter" />}
                    error={numberOfIncomes > 0 && !isValidInput(numberOfIncomes)}
                  />
                  <ThemedText style={styles.helperText}>
                    Enter a number between 1 and 1000
                  </ThemedText>
                </View>

                <Button
                  mode="contained"
                  style={styles.button}
                  onPress={handleInsertDummyIncomes}
                  disabled={!isValidInput(numberOfIncomes)}
                  icon="plus-circle"
                >
                  Insert {numberOfIncomes} Dummy Incomes
                </Button>
              </View>

              {/* Disable Dev Options Section */}
              <View style={[styles.sectionContainer, styles.disableSection]}>
                <View style={styles.sectionHeader}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={20}
                    color={colors.error}
                    style={styles.sectionIcon}
                  />
                  <ThemedText style={[styles.sectionTitle, { color: colors.error, fontSize: 16 }]}>
                    Disable Dev Options
                  </ThemedText>
                </View>

                <ThemedText style={{ color: colors.muted, marginBottom: 12, fontSize: 13 }}>
                  Hide dev options from menu (re-enable by tapping version 5x from About screen)
                </ThemedText>

                <Button
                  mode="outlined"
                  style={styles.button}
                  onPress={handleDisableDevOptions}
                  icon="close"
                  textColor={colors.error}
                  buttonColor="transparent"
                >
                  Disable
                </Button>
              </View>
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Snackbar for feedback */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={[
          styles.snackbar,
          {
            backgroundColor: snackbarType === "success" ? colors.primary : colors.error,
          },
        ]}
        action={{
          label: 'Dismiss',
          onPress: () => setSnackbarVisible(false),
          textColor: snackbarType === "success" ? colors.onPrimary : colors.onError,
        }}
      >
        <ThemedText style={{
          color: snackbarType === "success" ? colors.onPrimary : colors.onError
        }}>
          {snackbarMessage}
        </ThemedText>
      </Snackbar>
    </ScreenWrapper>
  );
}
