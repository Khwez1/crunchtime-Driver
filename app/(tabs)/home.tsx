import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';
import Buttons from '../../components/Buttons';
import Cards from '../../components/Cards';
import Minicards from '../../components/Minicards';
import Map from '../../components/Map';
export default function home() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View className="flex-col gap-5 p-5">
          {/* Title */}
          <Text className="text-3xl font-bold mt-1">Home</Text>
          {/* Title */}

          <Buttons />

          <Text className="font-bold text-xl">
            Nearby Deliveries
          </Text>

          <Cards />

          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold">
              Recent Deliveries
            </Text>
            <Text className="font-bold text-red-600">
              See all
            </Text>
          </View>

          <Minicards />
          
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

