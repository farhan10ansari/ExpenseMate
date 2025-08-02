import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/base/ThemedText';
import { ThemedView } from '@/components/base/ThemedView';
import { FAB, Portal } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';

export default function IncomeScreen() {
  const router = useRouter();
  const isFocused = useIsFocused();

  const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 100
    },
  })



  return (
    <ThemedView>
      <ThemedText>Tab Two</ThemedText>
      {
        isFocused && (
          <Portal>
            <FAB
              onPress={() => router.push('/income/new')}
              icon="plus"
              style={styles.fab}
            />
          </Portal>
        )
      }
    </ThemedView>
  );
}