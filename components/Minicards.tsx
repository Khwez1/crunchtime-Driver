import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';

export default function Minicards() {
  return (
    <ScrollView>
      {/* MiniCard */}
      <View className="mt-2 h-[150px] w-full flex-row items-center justify-between rounded-xl bg-red-400 p-3">
        <Image
          source={require('~/assets/Nandos.png')}
          className="max-h-full max-w-[135] rounded-xl"
        />
        <View className="w-[100px] flex-col gap-2">
          <Text className="text-xl font-bold text-white">Nandos</Text>
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
        <Text className="rounded-lg bg-red-500 p-3 px-5 text-white">
          <Link href="/delivery">button</Link>
        </Text>
      </View>
      {/* MiniCard */}
      {/* MiniCard */}
      <View className="mt-2 h-[150px] w-full flex-row items-center justify-between rounded-xl bg-red-400 p-3">
        <Image
          source={require('~/assets/Nandos.png')}
          className="max-h-full max-w-[135] rounded-xl"
        />
        <View className="w-[100px] flex-col gap-2">
          <Text className="text-xl font-bold text-white">Nandos</Text>
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
        <Text className="rounded-lg bg-red-500 p-3 px-5 text-white">button</Text>
      </View>
      {/* MiniCard */}
    </ScrollView>
  );
}
