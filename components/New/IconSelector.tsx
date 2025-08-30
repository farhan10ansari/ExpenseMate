import React, { useCallback, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import { ICON_COLORS } from '@/lib/constants';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { FlashList } from '@shopify/flash-list';
import { IconWithColor } from '@/lib/types';
import Color from 'color';



interface IconItemProps {
  iconData: IconWithColor;
  isSelected: boolean;
  onSelect: (iconData: IconWithColor) => void;
  disabled?: boolean;
}

const IconItem = React.memo<IconItemProps>(({
  iconData,
  isSelected,
  onSelect,
  disabled = false
}) => {
  const { colors, dark } = useAppTheme();

  const handlePress = useCallback(() => {
    if (!disabled) {
      onSelect(iconData); // Pass the full object
    }
  }, [iconData, onSelect, disabled]);

  const avatarStyle = useMemo(() => [
    styles.avatar,
    {
      backgroundColor: dark ? Color(iconData.color).alpha(0.1).string() : Color(iconData.color).lighten(0.15).alpha(0.2).string(),
      borderWidth: isSelected ? 2 : 1,
      borderColor: isSelected ? colors.primary : dark ? "transparent" : colors.border,
    }
  ], [iconData.color, isSelected, colors.primary]);

  return (
    <Avatar.Icon
      size={48}
      icon={iconData.icon}
      style={avatarStyle}
      color={iconData.color}
      onTouchEnd={handlePress}
    />
  );
});

IconItem.displayName = 'IconItem';

interface IconSelectorProps {
  selectedIcon?: IconSource | null;
  onIconSelect: (iconData: IconWithColor) => void; // Updated to accept full object
  disabled?: boolean;
}

const ItemSeparator = () => <View style={styles.separator} />;

export const IconSelector = React.memo<IconSelectorProps>(({
  selectedIcon,
  onIconSelect,
  disabled = false,
}) => {
  const { colors } = useAppTheme();

  // Restructure icon objects into columns of two for the horizontal FlashList
  const iconColumns = useMemo(() => {
    const columns: typeof ICON_COLORS[number][][] = [];
    for (let i = 0; i < ICON_COLORS.length; i += 2) {
      const column = [ICON_COLORS[i]];
      if (ICON_COLORS[i + 1]) {
        column.push(ICON_COLORS[i + 1]);
      }
      columns.push(column);
    }
    return columns;
  }, []);

  const renderColumn = useCallback(({ item: column }: { item: typeof ICON_COLORS[number][] }) => (
    <View style={styles.column}>
      {column.map((iconData) => (
        <IconItem
          key={iconData.icon as string}
          iconData={iconData} // Pass full object
          isSelected={selectedIcon === iconData.icon}
          onSelect={onIconSelect} // Pass the callback directly
          disabled={disabled}
        />
      ))}
    </View>
  ), [selectedIcon, onIconSelect, disabled]);

  const titleStyle = useMemo(() => [
    styles.title,
    { color: colors.onSurface }
  ], [colors.onSurface]);

  return (
    <View style={styles.container}>
      <Text variant="labelMedium" style={titleStyle}>
        Choose an icon for your category
      </Text>

      <FlashList
        data={iconColumns}
        renderItem={renderColumn}
        keyExtractor={(item) => item[0].icon as string}
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={ItemSeparator}
      />
    </View>
  );
});

IconSelector.displayName = 'IconSelector';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    height: 160,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  column: {
    flexDirection: 'column',
    gap: 12,
  },
  separator: {
    width: 12,
  },
  avatar: {
    borderRadius: 12,
  },
});
