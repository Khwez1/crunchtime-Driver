import { View, Text, Image, ScrollView } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

export default function Minicards() {
  return (
    <ScrollView>
            {/* MiniCard */}
            <View style={tw`w-full h-[150px] bg-red-400 p-3 mt-2 rounded-xl flex-row justify-between items-center`}>
              <Image
                source={require('../assets/images/Nandos.png')}
                style={tw`h-30 w-30 rounded-xl`}
              />
              <View style={tw`w-[100px] flex-col gap-2`}>
                <Text style={tw`text-xl font-bold text-white`}>
                  Nandos
                </Text>
                <View style={tw`flex gap-3`}>
                  <View style={tw`flex-row items-center gap-2`}>
                    <Ionicons name="star-sharp" size={24} color="yellow" />
                    <Text style={tw`text-white`}>4.5</Text>
                  </View>
                  <View style={tw`flex-row items-center gap-2`}>
                    <Ionicons name="location-outline" size={24} color="white" />
                    <Text style={tw`text-white`}>Milnerton</Text>
                  </View>
                </View>
              </View>
                <Text style={tw`bg-red-500 p-3 px-5 text-white rounded-lg`}>
                  button
                </Text>
            </View>
            {/* MiniCard */}
            {/* MiniCard */}
            <View style={tw`w-full h-[150px] bg-red-400 p-3 mt-2 rounded-xl flex-row justify-between items-center`}>
              <Image
                source={require('../assets/images/Nandos.png')}
                style={tw`h-30 w-30 rounded-xl`}
              />
              <View style={tw`w-[100px] flex-col gap-2`}>
                <Text style={tw`text-xl font-bold text-white`}>
                  Nandos
                </Text>
                <View style={tw`flex gap-3`}>
                  <View style={tw`flex-row items-center gap-2`}>
                    <Ionicons name="star-sharp" size={24} color="yellow" />
                    <Text style={tw`text-white`}>4.5</Text>
                  </View>
                  <View style={tw`flex-row items-center gap-2`}>
                    <Ionicons name="location-outline" size={24} color="white" />
                    <Text style={tw`text-white`}>Milnerton</Text>
                  </View>
                </View>
              </View>
                <Text style={tw`bg-red-500 p-3 px-5 text-white rounded-lg`}>
                  button
                </Text>
            </View>
            {/* MiniCard */}
          </ScrollView>
  )
}