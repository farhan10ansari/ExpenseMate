// import React from 'react';
// import { CurvedBottomBarExpo } from 'react-native-curved-bottom-bar';
// import MaterialIcons from '@expo/vector-icons/MaterialIcons';
// import { StyleSheet, Animated, Pressable, View } from 'react-native';
// import { useAppTheme } from '@/themes/providers/AppThemeProviders';
// import { ThemedText } from '@/components/base/ThemedText';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import HomeScreen from '@/app/(tabs)';
// import ExpensesScreen from '@/app/(tabs)/expenses';
// import IncomesScreen from '@/app/(tabs)/incomes';
// import MenuScreen from '@/app/(tabs)/menu';

// type RouteNames = 'index' | 'expenses' | 'incomes' | 'menu';

// type IconNames = 'home' | 'money' | 'currency-rupee' | 'menu' | 'add';

// interface TabBarProps {
//   routeName: RouteNames;
//   selectedTab: RouteNames;
//   navigate: (routeName: string) => void;
// }

// interface CircleProps {
//   selectedTab: RouteNames;
//   navigate: (routeName: string) => void;
// }


// const getIconName = (routeName: RouteNames): IconNames => {
//   switch (routeName) {
//     case 'index':
//       return 'home';
//     case 'expenses':
//       return 'money';
//     case 'incomes':
//       return 'currency-rupee';
//     case 'menu':
//       return 'menu';
//     default:
//       return 'home';
//   }
// };

// const getTitle = (routeName: RouteNames): string => {
//   switch (routeName) {
//     case 'index':
//       return 'Home';
//     case 'expenses':
//       return 'Expenses';
//     case 'incomes':
//       return 'Incomes';
//     case 'menu':
//       return 'Menu';
//     default:
//       return routeName;
//   }
// };


// export default function TabLayoutV2() {
//   const { colors } = useAppTheme();
//   const insets = useSafeAreaInsets()



//   const styles = StyleSheet.create({
//     tabbarItem: {
//       flex: 1,
//       alignItems: 'center',
//       justifyContent: 'center',
//       paddingVertical: 10,
//       borderRadius: 20,
//       marginHorizontal: 5,
//     },
//     btnCircleUp: {
//       width: 60,
//       height: 60,
//       borderRadius: 30,
//       alignItems: 'center',
//       justifyContent: 'center',
//       bottom: 18,
//       shadowColor: colors.shadow,
//       shadowOffset: {
//         width: 0,
//         height: 1,
//       },
//       shadowOpacity: 0.2,
//       shadowRadius: 1.41,
//       elevation: 1,
//     },
//     button: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       width: '100%',
//       height: '100%',
//       borderRadius: 30,  // Add this line
//     },
//   });


//   const renderTabBar = ({ routeName, selectedTab, navigate }: TabBarProps) => {
//     const isSelected: boolean = selectedTab === routeName;
//     const iconColor: string = isSelected ? colors.primary : colors.text;
//     const textColor: string = isSelected ? colors.primary : colors.text;

//     return (
//       <Pressable
//         onPress={() => navigate(routeName)}
//         style={[
//           styles.tabbarItem,
//         ]}

//         android_ripple={{
//           color: colors.inverseOnSurface,
//           radius: 40,
//         }}
//         accessibilityRole="tab"
//         accessibilityState={{ selected: isSelected }}
//         accessibilityLabel={getTitle(routeName)}
//       >
//         <MaterialIcons
//           name={getIconName(routeName)}
//           size={25}
//           color={iconColor}
//         />
//         <ThemedText
//           style={{
//             color: textColor,
//             fontSize: 12,
//             marginTop: 4
//           }}
//         >
//           {getTitle(routeName)}
//         </ThemedText>
//       </Pressable>
//     );
//   };

//   const renderCircle = ({ navigate }: CircleProps) => (
//     <Animated.View style={[styles.btnCircleUp, { backgroundColor: colors.primary }]}>
//       <Pressable
//         style={styles.button}
//         onPress={() => navigate('transaction/new')}
//         accessibilityRole="button"
//         accessibilityLabel="Add new transaction"
//         android_ripple={{
//           color: 'rgba(255,255,255,0.3)',
//           radius: 30,
//           borderless: true
//         }}
//       >
//         <MaterialIcons name="add" size={25} color="white" />
//       </Pressable>
//     </Animated.View>
//   );




//   return (
//     <>
//       <CurvedBottomBarExpo.Navigator
//         type="DOWN"
//         style={{
//         }}
//         shadowStyle={{}}
//         height={70}
//         width={undefined}
//         circleWidth={50}
//         bgColor={colors.card}
//         initialRouteName="index"
//         borderTopLeftRight
//         renderCircle={renderCircle}
//         tabBar={renderTabBar}
//         id="bottom-bar"
//         borderColor={colors.border}
//         borderWidth={1}
//         circlePosition="CENTER"
//         backBehavior="none"
//         screenListeners={{}}
//         defaultScreenOptions={{}}
//         screenOptions={{
//           headerShown: false,
//         }}
//       >
//         <CurvedBottomBarExpo.Screen
//           name="index"
//           component={HomeScreen}
//           position="LEFT"
//         />
//         <CurvedBottomBarExpo.Screen
//           name="expenses"
//           component={ExpensesScreen}
//           position="LEFT"
//         />
//         <CurvedBottomBarExpo.Screen
//           name="incomes"
//           component={IncomesScreen}
//           position="RIGHT"
//         />
//         <CurvedBottomBarExpo.Screen
//           name="menu"
//           component={MenuScreen}
//           position="RIGHT"
//         />
//       </CurvedBottomBarExpo.Navigator>
//       <View style={{
//         // position: "fixed",
//         // bottom: 0,
//         height: insets.bottom,
//         backgroundColor: colors.card
//       }}>
//       </View>
//     </>
//   );
// }
