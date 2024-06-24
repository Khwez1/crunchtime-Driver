import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'
import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated'
export default function signIn() {
  return (
    <SafeAreaView >
        <ScrollView>
            <View style={tw`w-full justify-center py-5`}>
                signIn
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}