import { StyleSheet, TextInput, View, Platform, Pressable } from 'react-native';
import { ThemedText } from '@/components/base/ThemedText';
import React, { useRef, useState } from 'react';
import { useAppTheme } from '@/themes/providers/AppThemeProvider';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import usePaymentStore from '@/stores/usePaymentStore';
import useCategoriesStore from '@/stores/useCategoriesStore';
import { Button } from 'react-native-paper';

export default function PaymentScreen() {
  const { colors } = useAppTheme();
  const inputRef = useRef<TextInput>(null);
  // payment store 
  const amount = usePaymentStore((state) => state.amount);
  const setAmount = usePaymentStore((state) => state.setAmount);
  const category = usePaymentStore((state) => state.category);
  const setCategory = usePaymentStore((state) => state.setCategory);

  // categories store
  const categories = useCategoriesStore((state) => state.categories);

  const styles = StyleSheet.create({
    container: {
      padding: 10,
    },
    amountContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: colors.primary,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    input: {
      color: colors.text,
      backgroundColor: "transparent",
      borderRadius: 5,
      fontSize: 60,
    },
    categoriesContainer:{
      marginTop: 20,
      gap:2,
    },
    categories: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      // justifyContent: 'space-between',
      // marginTop: 20,
    }
  });

  console.log("amount", amount);
  return (
    <View style={styles.container}>
      <SheetGrabber />
      {/* Amount */}
      <Pressable style={styles.amountContainer} onPress={() => inputRef.current?.focus()}>
        <ThemedText type='defaultSemiBold' style={{ color: colors.muted }}>
          Amount
        </ThemedText>
        <View style={styles.inputContainer}>
          <FontAwesome name="rupee" size={20} color={colors.text} />
          <TextInput
            // autoFocus
            ref={inputRef}
            style={styles.input}
            placeholderTextColor={colors.muted}
            keyboardType="numeric"
            value={amount === 0 ? "" : amount.toString()}
            onChangeText={(text) => {
              if (text === '') {
                setAmount(0);
                return;
              }
              const parsedAmount = parseFloat(text);
              setAmount(parsedAmount);
            }}
            placeholder="0"
            maxLength={8}
          />
        </View>
      </Pressable>
      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ThemedText type='defaultSemiBold' style={{ color: colors.muted }}>
          Categories
        </ThemedText>
        <View style={styles.categories}>
          {categories.map((c) => (
            <Button
              key={c.name}
              icon={c.icon}
              mode={c.name === category ? "contained" : "outlined"}
              style={{
                borderRadius: 5,
                borderColor: colors.primary,
              }}
              onPress={() => {
                console.log("Category pressed", c.name);
                setCategory(c.name);
              }}
            >
              {c.name}
            </Button>
          ))}
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