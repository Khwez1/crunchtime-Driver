import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'

import { useLocalSearchParams } from 'expo-router'

export default function search() {
  const { query } = useLocalSearchParams();

  return (
    <SafeAreaView>
      <View>
        <Text className="text-3xl text-black">{query}</Text>
      </View>
    </SafeAreaView>
  )
}