import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Image, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { fetchProfile, updateProfile } from '../../lib/appwrite'
import { useGlobalContext } from '~/providers/GlobalProvider'

export default function Profile() {
  const { user, signOut } = useGlobalContext()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [newUsername, setNewUsername] = useState('')

  useEffect(() => {
    if (user && user.$id) {
      getProfile(user.$id)
    } else {
      setLoading(false)
    }
  }, [user])

  const getProfile = async (userId: string) => {
    try {
      const fetchedProfile = await fetchProfile(userId)
      setProfile(fetchedProfile)
      setNewUsername(fetchedProfile.username)
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async () => {
    if (!profile) return;

    try {
      const updatedData = { username: newUsername };
      const response = await updateProfile(profile.$id, updatedData);
      setProfile(response);
      setEditMode(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error("Failed to update profile:", error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    )
  }

  if (!user || !profile) {
    return (
      <SafeAreaView>
        <ScrollView>
          <Text>Please log in to view your profile</Text>
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="p-4">
          <Image 
            source={{ uri: `https://cloud.appwrite.io/v1/avatars/initials?name=${encodeURIComponent(profile.username)}&project=66694f2c003d7561352e` }} 
            className="w-24 h-24 rounded-full mb-4"
          />
          <Text className="text-3xl font-bold mb-4">👋Welcome! {profile.username}</Text>
          
          {editMode ? (
            <View className="mb-4">
              <TextInput
                className="border p-2 rounded-md mb-2"
                value={newUsername}
                onChangeText={setNewUsername}
                placeholder="New username"
              />
              <TouchableOpacity
                className="bg-blue-500 p-3 rounded-md mb-2"
                onPress={handleUpdateProfile}
              >
                <Text className="text-white text-center">Save Changes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-gray-300 p-3 rounded-md"
                onPress={() => setEditMode(false)}
              >
                <Text className="text-center">Cancel</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              className="bg-green-500 p-3 rounded-md mb-4"
              onPress={() => setEditMode(true)}
            >
              <Text className="text-white text-center">Edit Profile</Text>
            </TouchableOpacity>
          )}
          
          <View className="mb-4">
            <Text className="text-lg font-semibold">Username:</Text>
            <Text>{profile.username}</Text>
          </View>
          
          <View className="mb-4">
            <Text className="text-lg font-semibold">Email:</Text>
            <Text>{profile.email}</Text>
          </View>
          
          <View className="mb-4">
            <Text className="text-lg font-semibold">Account ID:</Text>
            <Text>{profile.accountId}</Text>
          </View>
          
          <TouchableOpacity
            className="bg-red-600 p-4 rounded-xl mt-4"
            onPress={() => signOut()}
          >
            <Text className="text-white text-center font-bold">
              Log Out
            </Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}