import { StyleSheet, TextInput, View } from 'react-native';
import { ThemedText } from '@/components/base/ThemedText';
import { ThemedView } from '@/components/base/ThemedView';
import React, { useEffect } from 'react';
import { useAppTheme } from '@/themes/providers/AppThemeProvider';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Button } from 'react-native-paper';

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
      <ThemedView style={styles.amountContainer}>
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

      </ThemedView>
    </ThemedView>
  );
}