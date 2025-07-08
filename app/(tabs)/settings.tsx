import { ThemedText } from "@/components/base/ThemedText";
import { tryCatch } from "@/lib/try-catch";
import { seedDummyExpenses } from "@/repositories/dev";
import usePersistentAppStore from "@/stores/usePersistentAppStore";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function SettingsScreen() {
  const queryClient = useQueryClient()
  const theme = usePersistentAppStore(state => state.theme);
  const setTheme = usePersistentAppStore(state => state.setTheme);
  const [numberOfExpenses, setNumberOfExpenses] = useState(0);

  const handleInsertDummyExpenses = async () => {
    // This function should handle the logic to insert dummy expenses
    // For now, we will just log the number of expenses
    const { data, error } = await tryCatch(
      seedDummyExpenses(numberOfExpenses)
    )
    if(error) {
      console.error("Error inserting dummy expenses:", error);
    }
    else {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      setNumberOfExpenses(0); // Reset the input field
      console.log(`Inserted ${data} dummy expenses`);
    }
  };
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title" >Theme</ThemedText>
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
              if (!isNaN(value)) {
                setNumberOfExpenses(value);
              } else {
                setNumberOfExpenses(0);
              }
            }}
            value={numberOfExpenses.toString()}
          />
          <Button
            mode="contained"
            style={{ marginTop: 16 }}
            onPress={() => {
              handleInsertDummyExpenses();
            }}
          >
            Insert Dummy Expenses
          </Button>

        </View>
      </View>
    </View>
  );
}