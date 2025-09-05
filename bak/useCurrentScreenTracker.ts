// import { Screens } from "@/lib/types";
// import useAppStore from "@/stores/useAppStore";
// import { useSegments } from "expo-router";
// import { useEffect } from "react";


// const PathToScreenMap: Record<string, Screens> = {
//     "(tabs)": Screens.Home,
//     "(tabs)/expenses": Screens.AllExpenses,
//     "(tabs)/incomes": Screens.AllIncomes,
//     "expense/[id]": Screens.ExpenseInfo,
//     "income/[id]": Screens.IncomeInfo,
//     "expense/[id]/edit": Screens.EditExpense,
//     "income/[id]/edit": Screens.EditIncome,
//     "transaction/new": Screens.NewTransaction,
//     "(tabs)/menu": Screens.Menu,
//     "menu/settings": Screens.Settings,
//     "menu/themes": Screens.Themes,
//     "menu/dev-options": Screens.DevOptions,
//     "menu/about": Screens.About,
//     // Add more mappings as needed
// }



// export default function useCurrentScreenTracker() {
//     const currentScreen = useAppStore((state) => state.currentScreen);
//     const setCurrentScreen = useAppStore((state) => state.setCurrentScreen);

//     const segments = useSegments();

//     useEffect(() => {
//         const path_name = segments.join("/");
//         const screen = PathToScreenMap[path_name] || null;
//         if (screen !== currentScreen) {
//             setCurrentScreen(screen);
//         }
//     }, [segments])
// }



// export enum Screens {
//   Home = "Home",
//   AllExpenses = "AllExpenses",
//   AllIncomes = "AllIncomes",
//   ExpenseInfo = "ExpenseInfo",
//   IncomeInfo = "IncomeInfo",
//   EditExpense = "EditExpense",
//   EditIncome = "EditIncome",
//   NewTransaction = "NewTransaction",
//   Menu = "Menu",
//   Settings = "Settings",
//   Themes = "Themes",
//   DevOptions = "DevOptions",
//   About = "About",
// }
