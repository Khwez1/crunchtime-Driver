import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Cards() {
  return (
    <View>
      <ScrollView horizontal>
        {/* Card */}
        <View className="mr-5 h-[250px] w-[300px] rounded-xl">
            <Image
              source={require('~/assets/Wimpy.png')}
              className="h-[100%] w-[100%] rounded-xl"
            />
          <View className="absolute h-[100%] w-[100%] rounded-xl bg-[rgba(000,000,000,0.3)]"></View>
          <View className="absolute right-5 top-5">
            <Ionicons name="heart-outline" size={24} color="white" />
          </View>
          <View className="absolute bottom-5 left-5">
            <View className="flex-row">
              <Ionicons name="star-sharp" size={24} color="yellow" />
              <Ionicons name="star-sharp" size={24} color="yellow" />
              <Ionicons name="star-sharp" size={24} color="yellow" />
            </View>
            <Text className="text-xl font-bold text-white">Wimpy</Text>
            <View className="flex-row">
              <Ionicons name="location-outline" size={18} color="white" />
              <Text className="mx-1 text-white">V & A Waterfront</Text>
            </View>
          </View>
        </View>
        {/* Card */}
        {/* Card */}
        <View className="mr-5 h-[250px] w-[300px] rounded-xl">
          <Image
            source={require('~/assets/Wimpy.png')}
            className="h-[100%] w-[100%] rounded-xl"
          />
          <View className="absolute h-[100%] w-[100%] rounded-xl bg-[rgba(000,000,000,0.3)]"></View>
          <View className="absolute right-5 top-5">
            <Ionicons name="heart-outline" size={24} color="white" />
          </View>
          <View className="absolute bottom-5 left-5">
            <View className="flex-row">
              <Ionicons name="star-sharp" size={24} color="yellow" />
              <Ionicons name="star-sharp" size={24} color="yellow" />
              <Ionicons name="star-sharp" size={24} color="yellow" />
            </View>
            <Text className="text-xl font-bold text-white">Wimpy</Text>
            <View className="flex-row">
              <Ionicons name="location-outline" size={18} color="white" />
              <Text className="mx-1 text-white">V & A Waterfront</Text>
            </View>
          </View>
        </View>
        {/* Card */}
      </ScrollView>
    </View>
  );
}