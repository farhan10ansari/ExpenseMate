import { ThemedText } from '@/components/base/ThemedText';
import { ThemedView } from '@/components/base/ThemedView';
import { useAppTheme } from '@/themes/providers/AppThemeProviders';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  const { colors } = useAppTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    amountContainer: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      color: colors.text,
      backgroundColor: "transparent",
      borderRadius: 5,
      // height: 100,
      fontSize: 60,
    }
  });

  return (
    <ThemedView style={styles.container}>
      <ThemedText type='title'>
        Home
      </ThemedText>
      {/* <ThemedView style={styles.amountContainer}>
        <ThemedText type='defaultSemiBold' style={{ color: colors.muted }}>
          Amount
        </ThemedText>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FontAwesome name="rupee" size={20} color={colors.text} />
          <TextInput
            style={styles.input}
            placeholderTextColor={colors.muted}
            keyboardType="numeric"
            onChangeText={(text) => {
              // Handle text change
              console.log('Amount:', text);
            }}
            placeholder="0"
            maxLength={12}
          // allowFontScaling={false}
          />
        </View>
      </ThemedView>
      <ThemedView>

      </ThemedView> */}
    </ThemedView>
  );
}