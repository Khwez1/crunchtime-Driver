import { Link } from 'expo-router';
import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function Buttons() {
  return (
    <View>
      <ScrollView horizontal>
        <Text className="mr-2 rounded-lg bg-red-600 p-3 px-5 text-white">
          <Link href="/Room">button</Link>
        </Text>
        <Text className="mr-2 rounded-lg bg-red-600 p-3 px-5 text-white">button</Text>
        <Text className="mr-2 rounded-lg bg-red-600 p-3 px-5 text-white">button</Text>
        <Text className="mr-2 rounded-lg bg-red-600 p-3 px-5 text-white">button</Text>
        <Text className="mr-2 rounded-lg bg-red-600 p-3 px-5 text-white">button</Text>
        <Text className="mr-2 rounded-lg bg-red-600 p-3 px-5 text-white">button</Text>
      </ScrollView>
    </View>
  );
}
