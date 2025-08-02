import { useAppTheme } from "@/themes/providers/AppThemeProviders";
import { Platform, StyleSheet, View } from "react-native";

const SheetGrabber = () => {
  const { colors } = useAppTheme();
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingTop: 10,
    },
    grabber: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.muted,
      opacity: 0.6,
    },
  });

  return (
    Platform.OS === 'android' && (
      <View style={styles.container}>
        <View
          style={styles.grabber}
        />
      </View>
    )
  )
}

export default SheetGrabber;