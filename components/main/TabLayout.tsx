import TabBar from '@/components/main/TabBar';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';
import React from 'react';

function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={props => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="expenses"
        options={{
          title: 'Expenses',
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="money" color={color} />,
        }}
      />
      <Tabs.Screen
        name="incomes"
        options={{
          title: 'Incomes',
          headerShown: false,
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="currency-rupee" color={color} />,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          headerShown: false,
          title: 'Menu',
          tabBarIcon: ({ color }) => <MaterialIcons size={28} name="menu" color={color} />,
        }}
      />
    </Tabs>
  );
}


export default TabLayout;