import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';

import Buttons from '../../components/Buttons';
import Cards from '../../components/Cards';
import Minicards from '../../components/Minicards';

export default function home() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex-col gap-5 p-5">
          {/* Title */}
          <Text className="mt-1 text-3xl font-bold">Home</Text>
          {/* Title */}

          <Buttons />

          <Text className="text-xl font-bold">Nearby Deliveries</Text>

          <Cards />

          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-bold">Recent Deliveries</Text>
            <Text className="font-bold text-red-600">See all</Text>
          </View>

          <Minicards />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
