import { Screens } from "@/lib/types";
import useAppStore from "@/stores/useAppStore";
import { useSegments } from "expo-router";
import { useEffect } from "react";


const PathToScreenMap: Record<string, Screens> = {
    "(tabs)": Screens.Home,
    "(tabs)/expenses": Screens.AllExpenses,
    "expense/new": Screens.NewExpense,
    "expense/[id]": Screens.ExpenseInfo,
    "expense/[id]/edit": Screens.EditExpense,
    "(tabs)/incomes": Screens.Incomes,
    "(tabs)/settings": Screens.Settings,
    // Add more mappings as needed
}



export default function useCurrentScreenTracker() {
    const currentScreen = useAppStore((state) => state.currentScreen);
    const setCurrentScreen = useAppStore((state) => state.setCurrentScreen);

    const segments = useSegments();

    useEffect(() => {
        const path_name = segments.join("/");
        const screen = PathToScreenMap[path_name] || null;
        if (screen !== currentScreen) {
            setCurrentScreen(screen);
        }
    }, [segments])
}