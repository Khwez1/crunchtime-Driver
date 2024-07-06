import { View, Text, ScrollView, Image } from 'react-native'
import React from 'react'
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

export default function Cards() {
  return (
    <View>
        <ScrollView horizontal>
            {/* Card */}
            <View style={tw`h-[250px] w-[300px] mr-5 rounded-xl`}>
              <Image 
                source={require('../assets/images/Wimpy.png')}
                style={tw`h-[100%] w-[100%] rounded-xl`}
              />
              <View style={tw`bg-[rgba(000,000,000,0.3)] h-[100%] w-[100%] rounded-xl absolute`}></View>
              <View style={tw`absolute top-5 right-5`}>
                <Ionicons name="heart-outline" size={24} color="white" />
              </View>
              <View style={tw`absolute bottom-5 left-5`}>
                <View style={tw`flex-row`}>
                  <Ionicons name="star-sharp" size={24} color="yellow" />
                  <Ionicons name="star-sharp" size={24} color="yellow" />
                  <Ionicons name="star-sharp" size={24} color="yellow" />
                </View>
                <Text style={tw`text-white font-bold text-xl`}>Wimpy</Text>
                <View style={tw`flex-row`}>
                <Ionicons name="location-outline" size={18} color="white" />
                <Text style={tw`text-white mx-1`}>
                V & A Waterfront
                </Text>
                </View>
              </View>
            </View>
            {/* Card */}
            {/* Card */}
            <View style={tw`h-[250px] w-[300px] mr-5 rounded-xl`}>
              <Image 
                source={require('../assets/images/Wimpy.png')}
                style={tw`h-[100%] w-[100%] rounded-xl`}
              />
              <View style={tw`bg-[rgba(000,000,000,0.3)] h-[100%] w-[100%] rounded-xl absolute`}></View>
              <View style={tw`absolute top-5 right-5`}>
                <Ionicons name="heart-outline" size={24} color="white" />
              </View>
              <View style={tw`absolute bottom-5 left-5`}>
                <View style={tw`flex-row`}>
                  <Ionicons name="star-sharp" size={24} color="yellow" />
                  <Ionicons name="star-sharp" size={24} color="yellow" />
                  <Ionicons name="star-sharp" size={24} color="yellow" />
                </View>
                <Text style={tw`text-white font-bold text-xl`}>Wimpy</Text>
                <View style={tw`flex-row`}>
                <Ionicons name="location-outline" size={18} color="white" />
                <Text style={tw`text-white mx-1`}>
                V & A Waterfront
                </Text>
                </View>
              </View>
            </View>
            {/* Card */}
        </ScrollView>
    </View>
  )
}