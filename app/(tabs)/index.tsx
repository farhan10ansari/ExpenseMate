import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import db from '@/db/client';
import React, { useEffect } from 'react';
import { expensesSchema } from '@/db/schema';
import { Button } from 'react-native-paper';
const test = async () => {
  // console.log("inside test");
  // const a = await db.insert(expensesSchema).values({
  //   id: 1,
  //   amount: 100

  // }).execute()

  // console.log("a", a)
  const x = await db.query.expensesSchema.findMany()
  console.log("x", x)
}

export default function HomeScreen() {

  useEffect(() => {
    (async function () {
      setTimeout(async () => {
        await test()
      }, 10000)
    })()
  }, [])
  return (
    <ThemedView>
      <ThemedText>
        Hello
      </ThemedText>
      {/* <Button
        onPress={h}
        title="Learn More"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      /> */}
      {/* <ThemedText>
        {JSON.stringify(rows)}
      </ThemedText> */}
      <Button icon="camera" mode="contained" onPress={() => console.log('Pressed')}>
        Press me
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
