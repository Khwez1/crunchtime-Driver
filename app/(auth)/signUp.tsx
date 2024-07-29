import { View, Text, ScrollView, Alert, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Link } from "expo-router";
import { Register } from "../../lib/appwrite";

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSignUp = async () => {
    setSubmitting(true);
    try {
      await Register(email, password, username);
      Alert.alert('Success', 'Account created successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full justify-center px-4 my-6">
          <Text className="text-2xl text-black font-bold mt-10">Sign Up</Text>

          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            className="mt-10 border border-gray-300 p-4 rounded-lg"
          />

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            className="mt-7 border border-gray-300 p-4 rounded-lg"
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            className="mt-7 border border-gray-300 p-4 rounded-lg"
            secureTextEntry
          />

          <TouchableOpacity 
            className="w-full mt-7 p-4 bg-red-600 text-black font-semibold rounded-xl"
            onPress={handleSignUp}
            disabled={isSubmitting}
          >
            {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text className="text-center text-white">Sign Up</Text>}
          </TouchableOpacity>

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg">Already have an account?</Text>
            <Link href="/signIn" className="text-red-600 font-bold text-lg">Sign in</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
