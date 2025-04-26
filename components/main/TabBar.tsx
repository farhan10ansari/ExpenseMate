import { View, StyleSheet } from 'react-native';
import { NavigationHelpers, NavigationRoute, ParamListBase, useLinkBuilder } from '@react-navigation/native';
import { PlatformPressable } from '@react-navigation/elements';
import { BottomTabBarProps, BottomTabNavigationEventMap, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { useAppTheme } from '@/themes/providers/AppThemeProvider';
import { ThemedText } from '../base/ThemedText';

export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { colors } = useAppTheme();

    const styles = StyleSheet.create({
        tabBar: {
            position: 'absolute',
            bottom: 25,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.card,
            marginHorizontal: 20,
            borderRadius: 25,
            borderCurve: "continuous",
            shadowColor: 'black',
            shadowOffset: {
                width: 0,
                height: 10,
            },
            shadowRadius: 10,
            shadowOpacity: 0.1,
            minHeight: 80,
        }
    })

    return (
        <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;
                const Icon = options.tabBarIcon;

                return (
                    <TabBarItem
                        key={route.key}
                        route={route}
                        options={options}
                        isFocused={isFocused}
                        navigation={navigation}
                    />
                );
            })}
        </View>
    );
}

type TabBarItemProps = {
    route: NavigationRoute<ParamListBase, string>
    options: BottomTabNavigationOptions
    isFocused: boolean,
    navigation: NavigationHelpers<ParamListBase, BottomTabNavigationEventMap>
}

function TabBarItem({ route, options, isFocused, navigation }: TabBarItemProps) {
    const { colors, dark } = useAppTheme();
    const { buildHref } = useLinkBuilder();

    const label = options.title !== undefined
        ? options.title
        : route.name;

    const onPress = () => {
        const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
        }
    };

    const onLongPress = () => {
        navigation.emit({
            type: 'tabLongPress',
            target: route.key,
        });
    };

    const Icon = options.tabBarIcon;

    const styles = StyleSheet.create({
        tabBarItem: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 60,
        }
    })

    return (
        <PlatformPressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
            android_ripple={{
                color: dark ? colors.primary100 : colors.primary10,
                borderless: true
            }}
        >
            {
                Icon && Icon({ color: isFocused ? colors.primary : colors.text, focused: isFocused, size: 28 })
            }
            <ThemedText type="default" style={{ color: isFocused ? colors.primary : colors.text }}>
                {label}
            </ThemedText>
        </PlatformPressable>
    );

}
