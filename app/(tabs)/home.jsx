import { View, Text, Image, SafeAreaView, ScrollView } from 'react-native';
import React from 'react';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

export default function home() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={tw`flex-col gap-5 p-5`}>
          {/* Title */}
          <Text style={tw`text-3xl font-bold mt-1`}>Home</Text>
          {/* Title */}

          <View style={tw`flex-row gap-3`}>
            <Text style={tw`bg-red-600 p-5 px-5 text-white rounded-xl`}>
              button
            </Text>
            <Text style={tw`bg-red-600 p-5 px-5 text-white rounded-xl`}>
              button
            </Text>
            <Text style={tw`bg-red-600 p-5 px-5 text-white rounded-xl`}>
              button
            </Text>
            <Text style={tw`bg-red-600 p-5 px-5 text-white rounded-xl`}>
              button
            </Text>
            <Text style={tw`bg-red-600 p-5 px-5 text-white rounded-xl`}>
              button
            </Text>
            <Text style={tw`bg-red-600 p-5 px-5 text-white rounded-xl`}>
              button
            </Text>
          </View>

          <Text style={tw`font-bold text-xl `}>
            Nearby Deliveries
          </Text>

          <View>
            {/* Card */}
            <View style={tw`h-[250px] w-3/4 bg-red-300 rounded-xl`}>
              <Image 
                source={require('../../assets/images/Wimpy.png')}
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
          </View>

          <View style={tw`flex-row justify-between items-center`}>
            <Text style={tw`text-lg font-bold`}>
              Recent Deliveries
            </Text>
            <Text style={tw`font-bold text-red-600`}>
              See all
            </Text>
          </View>

          <View>
            {/* MiniCard */}
            <View style={tw`w-full h-[150px] bg-red-400 p-3 rounded-xl flex-row justify-between items-center`}>
              <Image
                source={require('../../assets/images/Nandos.png')}
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
                <Text style={tw`bg-red-500 p-3 px-5 text-white rounded-xl`}>
                  button
                </Text>
            </View>
            {/* MiniCard */}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

