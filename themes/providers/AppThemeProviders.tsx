import usePersistentAppStore from "@/stores/usePersistentAppStore";
import { ThemeProvider } from "@react-navigation/native";
import { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import { customDarkTheme, customLightTheme } from "../theme";

const ThemeContext = createContext(customLightTheme);

function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const colorScheme = useColorScheme();
    const appliedTheme = usePersistentAppStore((state) => state.theme);

    const theme = useMemo(() => {
        if (appliedTheme === "system") {
            return colorScheme === 'dark' ? customDarkTheme : customLightTheme;
        }
        return appliedTheme === "dark" ? customDarkTheme : customLightTheme;
    }, [appliedTheme, colorScheme]);

    // ✅ Memoize context value to prevent provider re-renders
    const contextValue = useMemo(() => theme, [theme]);

    return (
        <ThemeContext.Provider value={contextValue}>
            <ThemeProvider value={theme}>
                <PaperProvider theme={theme}>
                    {children}
                </PaperProvider>
            </ThemeProvider>
        </ThemeContext.Provider>
    );
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
