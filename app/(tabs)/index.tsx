import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/base/ThemedText';
import { ThemedView } from '@/components/base/ThemedView';
import React, { useEffect } from 'react';
import { Button } from 'react-native-paper';


export default function HomeScreen() {
  return (
    <ThemedView>
      <ThemedText>
        Hello
      </ThemedText>
    </ThemedView>
  );
}