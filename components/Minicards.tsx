import { View, Text, Image, ScrollView } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Minicards() {
  return (
        <ScrollView>
          {/* MiniCard */}
          <View className="w-full h-[150px] bg-red-400 p-3 mt-2 rounded-xl flex-row justify-between items-center">
            <Image
              source={require('~/assets/Nandos.png')}
              className="max-w-[135] max-h-full rounded-xl"
            />
            <View className="w-[100px] flex-col gap-2">
              <Text className="text-xl font-bold text-white">
                Nandos
              </Text>
              <View className="flex gap-3">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="star-sharp" size={24} color="yellow" />
                    <Text className="text-white">4.5</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Ionicons name="location-outline" size={24} color="white" />
                  <Text className="text-white">Milnerton</Text>
                </View>
              </View>
            </View>
              <Text className="bg-red-500 p-3 px-5 text-white rounded-lg">
                button
              </Text>
          </View>
          {/* MiniCard */}
          {/* MiniCard */}
          <View className="w-full h-[150px] bg-red-400 p-3 mt-2 rounded-xl flex-row justify-between items-center">
            <Image
              source={require('~/assets/Nandos.png')}
              className="max-w-[135] max-h-full rounded-xl"
            />
            <View className="w-[100px] flex-col gap-2">
              <Text className="text-xl font-bold text-white">
                  Nandos
                </Text>
                <View className="flex gap-3">
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="star-sharp" size={24} color="yellow" />
                    <Text className="text-white">4.5</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Ionicons name="location-outline" size={24} color="white" />
                    <Text className="text-white">Milnerton</Text>
                  </View>
                </View>
              </View>
                <Text className="bg-red-500 p-3 px-5 text-white rounded-lg">
                  button
                </Text>
            </View>
            {/* MiniCard */}
          </ScrollView>
  )
}