import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function search() {
  const { query } = useLocalSearchParams();

  return (
    <SafeAreaView>
      <View>
        <Text className="text-3xl text-black">{query}</Text>
      </View>
    </SafeAreaView>
  );
}
