import { ThemedText } from '@/components/base/ThemedText';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomTabBarProps, BottomTabNavigationEventMap, BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { NavigationHelpers, NavigationRoute, ParamListBase, useLinkBuilder } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { Keyboard, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { colors } = useAppTheme();
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const insets = useSafeAreaInsets()

    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
        const showSub = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
        const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const styles = StyleSheet.create({
        container: {
            height: insets.bottom,
            position: "relative",
            backgroundColor: colors.card
        },
        tabBar: {
            position: 'absolute',
            bottom: insets.bottom,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
            minHeight: 80,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            elevation: 0.01
        },
    })

    if (keyboardVisible) return null;

    return (
        <View style={styles.container}>
            <View style={styles.tabBar}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

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
                <TabBarItem
                    key="payment"
                    route={{ key: 'transaction/new', name: 'transaction/new', params: {} }}
                    options={{
                        title: 'Transaction',
                        tabBarIcon: ({ color }) => <MaterialIcons size={28} name="add" color={color} />,
                        tabBarButtonTestID: 'new-transaction-tab-button',
                    }}
                    isFocused={false}
                    navigation={navigation}
                />
            </View>
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
                borderless: true,
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
