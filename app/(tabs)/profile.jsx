// profile.jsx

import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { signOut, Profile, updateProfile } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import tw from 'twrnc'

export default function ProfileScreen() {
  const { user, setUser, isLogged, loading } = useGlobalContext()
  const [userDetails, setUserDetails] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [updatedUsername, setUpdatedUsername] = useState('')

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isLogged && user) {
        try {
          const details = await Profile(user.$id);
          setUserDetails(details);
          setUpdatedUsername(details.username);
        } catch (error) {
          console.log("Failed to fetch user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, [isLogged, user]);

  const handleUpdateProfile = async () => {
    if (!userDetails) return;

    try {
      const updatedData = { username: updatedUsername };
      const updatedDoc = await updateProfile(userDetails.$id, updatedData);
      setUserDetails(updatedDoc);
      setEditMode(false);
      // Update the global user state if necessary
      setUser(prevUser => ({ ...prevUser, name: updatedUsername }));
    } catch (error) {
      console.log("Failed to update profile:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // The global state will be updated in the GlobalProvider
    } catch (error) {
      console.log("Failed to sign out:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center`}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!isLogged) {
    return (
      <SafeAreaView style={tw`flex-1 justify-center items-center`}>
        <Text>Please log in to view your profile</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1`}>
      <ScrollView contentContainerStyle={tw`p-4`}>
        {userDetails ? (
          <View>
            <Text style={tw`text-3xl font-bold mb-4`}>
              Welcome {userDetails.username}
            </Text>
            {editMode ? (
              <View style={tw`mb-4`}>
                <TextInput
                  style={tw`border p-2 rounded-md mb-2`}
                  value={updatedUsername}
                  onChangeText={setUpdatedUsername}
                  placeholder="New username"
                />
                <TouchableOpacity
                  style={tw`bg-blue-500 p-3 rounded-md mb-2`}
                  onPress={handleUpdateProfile}
                >
                  <Text style={tw`text-white text-center`}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`bg-gray-300 p-3 rounded-md`}
                  onPress={() => setEditMode(false)}
                >
                  <Text style={tw`text-center`}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={tw`bg-green-500 p-3 rounded-md mb-4`}
                onPress={() => setEditMode(true)}
              >
                <Text style={tw`text-white text-center`}>Edit Profile</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={tw`bg-red-600 p-3 rounded-md`}
              onPress={handleSignOut}
            >
              <Text style={tw`text-white text-center`}>Logout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={tw`text-xl`}>Loading user details...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}