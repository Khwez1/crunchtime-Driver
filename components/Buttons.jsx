import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import tw from 'twrnc';
import { Link } from 'expo-router';

export default function Buttons() {
  return (
    <View>
        <ScrollView horizontal>
        <Text style={tw`bg-red-600 mr-2 p-3 px-5 text-white rounded-lg`}>
          <Link href='/Room'>
            button
          </Link>
        </Text>
        <Text style={tw`bg-red-600 mr-2 p-3 px-5 text-white rounded-lg`}>
          button
        </Text>
        <Text style={tw`bg-red-600 mr-2 p-3 px-5 text-white rounded-lg`}>
          button
        </Text>
        <Text style={tw`bg-red-600 mr-2 p-3 px-5 text-white rounded-lg`}>
          button
        </Text>
        <Text style={tw`bg-red-600 mr-2 p-3 px-5 text-white rounded-lg`}>
          button
        </Text>
        <Text style={tw`bg-red-600 mr-2 p-3 px-5 text-white rounded-lg`}>
          button
        </Text>
    </ScrollView>
    </View>
  )
}