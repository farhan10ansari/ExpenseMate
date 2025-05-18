import { ThemedText } from "@/components/base/ThemedText";
import usePersistentAppStore from "@/stores/usePersistentAppStore";
import { View } from "react-native";
import { Button } from "react-native-paper";

export default function SettingsScreen() {
  const theme = usePersistentAppStore(state => state.theme);
  const setTheme = usePersistentAppStore(state => state.setTheme);
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
    </View>
  );
}