import { createMaterialTopTabNavigator, MaterialTopTabNavigationEventMap, MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs"
import { withLayoutContext } from "expo-router";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);

export default function Layout() {
    return (
        <MaterialTopTabs
            backBehavior="none" // Prevent going back to previous tab on back action
        >
            <MaterialTopTabs.Screen
                name="expense-categories"
                options={{
                    title: "Expense Categories",
                }}

            />
            <MaterialTopTabs.Screen
                name="income-sources"
                options={{
                    title: "Income Sources",
                }}
            />
        </MaterialTopTabs>
    )
}