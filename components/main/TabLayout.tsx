import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';

function TabLayout() {
  const router = useRouter();
  const { colors } = useAppTheme();

  const handleNavigateToNewTransaction = () => {
    router.push('/transaction/new');
  };
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          borderTopEndRadius: 24,
          borderTopStartRadius: 24,
          position: 'absolute',
        },
        tabBarItemStyle: {
          backgroundColor: 'transparent',
        },
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="money" color={color} />,
        }}
      />
      <Tabs.Screen
        name="circle"
        options={{
          title: 'Transaction',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="add" color={color} />,
          tabBarButton: (props) => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <IconButton
                icon="plus"
                mode='contained'
                size={48}
                style={{
                  borderColor: colors.border,
                  borderWidth: 1,
                  elevation: 5,
                  top: -12,
                }}
                onPress={handleNavigateToNewTransaction}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="incomes"
        options={{
          title: 'Incomes',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="currency-rupee" color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="menu" color={color} />,
        }}
      />
    </Tabs>
  );
}


export default TabLayout;