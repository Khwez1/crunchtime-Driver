import { View, Text, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import tw from 'twrnc'

export default function history() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          {/* Title */}
          <Text style={tw``}>History</Text>
          {/* Title */}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}