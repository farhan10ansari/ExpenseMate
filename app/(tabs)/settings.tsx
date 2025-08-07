import { ThemedText } from "@/components/base/ThemedText";
import { tryCatch } from "@/lib/try-catch";
import { seedDummyExpenses, seedDummyIncome } from "@/repositories/dev"; // <-- Import your seeders
import usePersistentAppStore from "@/stores/usePersistentAppStore";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function SettingsScreen() {
  const queryClient = useQueryClient()
  const theme = usePersistentAppStore(state => state.theme);
  const setTheme = usePersistentAppStore(state => state.setTheme);

  // Local state for each input
  const [numberOfExpenses, setNumberOfExpenses] = useState(0);
  const [numberOfIncomes, setNumberOfIncomes] = useState(0);

  // Insert dummy expenses logic
  const handleInsertDummyExpenses = async () => {
    const { data, error } = await tryCatch(
      seedDummyExpenses(numberOfExpenses)
    )
    if(error) {
      console.error("Error inserting dummy expenses:", error);
    }
    else {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setNumberOfExpenses(0); // Reset the input field
      console.log(`Inserted ${numberOfExpenses} dummy expenses`);
    }
  };

  // Insert dummy incomes logic
  const handleInsertDummyIncomes = async () => {
    const { data, error } = await tryCatch(
      seedDummyIncome(numberOfIncomes)
    )
    if(error) {
      console.error("Error inserting dummy incomes:", error);
    }
    else {
      queryClient.invalidateQueries({ queryKey: ['incomes'] });
      setNumberOfIncomes(0); // Reset the input field
      console.log(`Inserted ${numberOfIncomes} dummy incomes`);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title">Theme</ThemedText>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 16, gap: 8 }}>
        <Button
          mode={theme === "light" ? "contained" : "outlined"}
          style={{ flex: 1 }}
          onPress={() => setTheme("light")}
        >
          Light
        </Button>
        <Button
          mode={theme === "dark" ? "contained" : "outlined"}
          style={{ flex: 1 }}
          onPress={() => setTheme("dark")}
        >
          Dark
        </Button>
        <Button
          mode={theme === "system" ? "contained" : "outlined"}
          style={{ flex: 1 }}
          onPress={() => setTheme("system")}
        >
          System
        </Button>
      </View>
      <View style={{ marginTop: 32 }}>
        <ThemedText type="title">Add Dummy Expense</ThemedText>
        <View style={{ marginTop: 16 }}>
          <TextInput
            label="No. of Expenses"
            keyboardType="numeric"
            style={{ marginTop: 16 }}
            onChangeText={(text) => {
              const value = parseInt(text, 10);
              setNumberOfExpenses(isNaN(value) ? 0 : value);
            }}
            value={numberOfExpenses.toString()}
          />
          <Button
            mode="contained"
            style={{ marginTop: 16 }}
            onPress={handleInsertDummyExpenses}
          >
            Insert Dummy Expenses
          </Button>
        </View>
      </View>

      <View style={{ marginTop: 32 }}>
        <ThemedText type="title">Add Dummy Income</ThemedText>
        <View style={{ marginTop: 16 }}>
          <TextInput
            label="No. of Incomes"
            keyboardType="numeric"
            style={{ marginTop: 16 }}
            onChangeText={(text) => {
              const value = parseInt(text, 10);
              setNumberOfIncomes(isNaN(value) ? 0 : value);
            }}
            value={numberOfIncomes.toString()}
          />
          <Button
            mode="contained"
            style={{ marginTop: 16 }}
            onPress={handleInsertDummyIncomes}
          >
            Insert Dummy Incomes
          </Button>
        </View>
      </View>
    </View>
  );
}
