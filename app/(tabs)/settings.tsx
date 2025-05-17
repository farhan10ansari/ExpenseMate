import { ThemedText } from "@/components/base/ThemedText";
import useAppStore from "@/stores/useAppStore";
import { View } from "react-native";
import { Button } from "react-native-paper";

export default function SettingsScreen() {
  const theme = useAppStore(state => state.theme);
  const setTheme = useAppStore(state => state.setTheme);
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