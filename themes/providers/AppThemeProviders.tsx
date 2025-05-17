import { ThemeProvider } from "@react-navigation/native";
import { createContext, useContext } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { customDarkTheme, customLightTheme } from "../theme";
import useAppStore from "@/stores/useAppStore";

const ThemeContext = createContext(customLightTheme)

function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const colorScheme = useColorScheme();
    const appliedTheme = useAppStore((state) => state.theme);

    const theme = appliedTheme === "system" ? (colorScheme === 'dark' ? customDarkTheme : customLightTheme) :
        (appliedTheme === "dark" ? customDarkTheme : customLightTheme)

    return (
        <ThemeContext.Provider value={theme}>
            <ThemeProvider value={theme}>
                <PaperProvider theme={theme}>
                    {children}
                </PaperProvider>
            </ThemeProvider>
        </ThemeContext.Provider>
    )
}

function useAppTheme() {
    const theme = useContext(ThemeContext);

    if (theme == null) {
        throw new Error(
            "Couldn't find a theme. Is your component inside AppThemeProvider or does it have a theme?"
        );
    }

    return theme;
}

export { AppThemeProvider, useAppTheme };