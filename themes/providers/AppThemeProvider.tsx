import { createContext, useContext } from "react";
import { colors } from "@/themes";
import { useColorScheme } from "react-native";

type AppTheme = {
    dark: boolean,
    colors: typeof colors & {
        background: string,
        card: string,
        text: string,
        border: string,
        muted: string,
    },
}

export const DefaultTheme: AppTheme = {
    dark: false,
    colors: {
        ...colors,
        background: 'rgb(242, 242, 242)',
        card: 'rgb(255, 255, 255)',
        text: 'rgb(28, 28, 30)',
        border: 'rgb(216, 216, 216)',
        muted: 'rgb(142, 142, 147)',
    },
};


export const DarkTheme: AppTheme = {
    dark: true,
    colors: {
        ...colors,
        background: 'rgb(1, 1, 1)',
        card: 'rgb(34, 34, 34)',
        text: 'rgb(229, 229, 231)',
        border: 'rgb(39, 39, 41)',
        muted: 'rgb(142, 142, 147)',
    },
};

const ThemeContext = createContext<AppTheme | null>(null)

function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const colorScheme = useColorScheme();

    const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

    return (
        <ThemeContext.Provider value={theme}>
            {children}
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