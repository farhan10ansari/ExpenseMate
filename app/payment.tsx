import { StyleSheet, TextInput, View, Platform } from 'react-native';
import { ThemedText } from '@/components/base/ThemedText';
import { ThemedView } from '@/components/base/ThemedView';
import React, { useEffect } from 'react';
import { useAppTheme } from '@/themes/providers/AppThemeProvider';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentScreen() {
  const { colors } = useAppTheme();

  const styles = StyleSheet.create({
    container: {
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
    <View style={styles.container}>
      <SheetGrabber />
      <View style={styles.amountContainer}>
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
          />
        </View>
      </View>
    </View>
  );
}

const SheetGrabber = () => {
  return (
    Platform.OS === 'android' && (
      <View style={{ alignItems: 'center', marginBottom: 12 }}>
        <View
          style={{
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: '#ccc',
            opacity: 0.6,
          }}
        />
      </View>
    )
  )
} 