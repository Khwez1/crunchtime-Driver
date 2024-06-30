import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import { signOut } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import tw from 'twrnc'
export default function profile() {
  const {user} = useGlobalContext()
  return (
    <SafeAreaView>
      <ScrollView>
      {user ? (
        <View>
          <Text style={tw`text-3xl font-bold mt-1`}>
            Welcome {user.name}
          </Text>
          <TouchableOpacity
          style={tw`bg-red-600 p-5 px-5 text-white rounded-xl`}
          onPress={() => signOut('current')}
          >
            <Text>
              LogOut
            </Text>
          </TouchableOpacity>
        </View>
      ):(
        <Text>
          Login
        </Text>
      )}
      <View>
        <Text>
          Profile
        </Text>
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}