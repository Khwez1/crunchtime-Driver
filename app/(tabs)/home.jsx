import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import Buttons from '../../components/Buttons';
import Cards from '../../components/Cards';
import Minicards from '../../components/Minicards';

export default function home() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={tw`flex-col gap-5 p-5`}>
          {/* Title */}
          <Text style={tw`text-3xl font-bold mt-1`}>Home</Text>
          {/* Title */}

          <Buttons />

          <Text style={tw`font-bold text-xl `}>
            Nearby Deliveries
          </Text>

          <Cards />

          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-lg font-bold`}>
              Recent Deliveries
            </Text>
            <Text style={tw`font-bold text-red-600`}>
              See all
            </Text>
          </View>

          <Minicards />

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

