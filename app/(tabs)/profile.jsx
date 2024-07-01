import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { signOut } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import { userDetails } from '../../lib/appwrite'
import tw from 'twrnc'

export default function profile() {
  const {user} = useGlobalContext()
  const [document_id, setDocument_id] = useState('')

  useEffect(() => {
    setDocument_id(`${user.$id}`)
    const getUserdetails = async () => {
      try {
        userDetails(document_id)
      } catch (error) {
        console.log("User details didn't load!");
      }
    }
    getUserdetails()
  },[])

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