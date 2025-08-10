import { StyleSheet, ScrollView, View } from "react-native";
import { List } from "react-native-paper";
import { Href, useRouter } from "expo-router";
import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { ThemedText } from "@/components/base/ThemedText";
import CustomScreenHeader from "@/components/main/CustomScreenHeader";
import { ScreenWrapper } from "@/components/main/ScreenWrapper";
import usePersistentAppStore from "@/stores/usePersistentAppStore";
import Color from "color";

type MenuSection = {
  title: string;
  items: {
    title: string;
    description: string;
    icon: string;
    route: Href; // Use Href type for better type safety of available routes
  }[];
}

export default function MenuScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const showDevOptions = usePersistentAppStore(state => state.showDevOptions);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 12,
    },
    scrollContentContainer: {
      paddingBottom: 32,
    },
    sectionContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.secondary,
      marginBottom: 8,
      marginTop: 16,
      marginLeft: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
  });


  const menuSections: MenuSection[] = [
    {
      title: "Preferences",
      items: [
        {
          title: "Themes",
          description: "Switch light/dark/system",
          icon: "theme-light-dark",
          route: "/menu/themes",
        },
        {
          title: "Settings",
          description: "Configure app preferences",
          icon: "cog",
          route: "/menu/settings",
        },
      ]
    },
    {
      title: "Information",
      items: [
        {
          title: "About",
          description: "App info and version details",
          icon: "information-outline",
          route: "/menu/about",
        },
      ]
    },
    {
      title: "Developer",
      items: [
        {
          title: "Dev Options",
          description: "Seed data and debug tools",
          icon: "tools",
          route: "/menu/dev-options",
        },
      ]
    }
  ];

  const handleItemPress = (route: Href) => {
    router.push(route);
  };

  return (
    <ScreenWrapper
      header={<CustomScreenHeader title="Menu" showBackButton={false} />}
      background="background"
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        {menuSections.map((section, sectionIndex) => {
          if (section.title === "Developer" && !showDevOptions) return null; // Skip if dev options are hidden

          return (
            <View key={section.title}>
              <ThemedText style={styles.sectionTitle}>
                {section.title}
              </ThemedText>
              <View style={styles.sectionContainer}>
                {section.items.map((item, itemIndex) => (
                  <MenuItemComponent
                    key={item.title}
                    item={item}
                    isLast={itemIndex === section.items.length - 1}
                    onPress={handleItemPress}
                  />
                ))}
              </View>
            </View>
          )
        })}
      </ScrollView>
    </ScreenWrapper>
  );
}


type MenuItem = {
  title: string;
  description: string;
  icon: string;
  route: Href;
};

type MenuItemComponentProps = {
  item: MenuItem;
  isLast: boolean;
  onPress: (route: Href) => void;
};

function MenuItemComponent({ item, isLast, onPress }: MenuItemComponentProps) {
  const { colors } = useAppTheme();

  const styles = StyleSheet.create({
    listItem: {
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: 'transparent',
    },
    listItemTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.text,
    },
    listItemDescription: {
      fontSize: 14,
      color: colors.muted,
      marginTop: 2,
    },
    divider: {
      height: 0.5,
      backgroundColor: colors.border,
      marginLeft: 56,
    },
    leftIcon: {
      color: colors.primary,
    },
    rightIcon: {
      color: colors.muted,
    },
    rippleColor: {
      color: Color(colors.primary).alpha(0.12).rgb().string(),
    },
  });

  return (
    <View>
      <List.Item
        title={item.title}
        description={item.description}
        titleStyle={styles.listItemTitle}
        descriptionStyle={styles.listItemDescription}
        style={styles.listItem}
        left={(props) => (
          <List.Icon
            {...props}
            icon={item.icon}
            color={styles.leftIcon.color}
          />
        )}
        right={(props) => (
          <List.Icon
            {...props}
            icon="chevron-right"
            color={styles.rightIcon.color}
          />
        )}
        onPress={() => onPress(item.route)}
        rippleColor={styles.rippleColor.color}
      />
      {!isLast && <View style={styles.divider} />}
    </View>
  );
}
