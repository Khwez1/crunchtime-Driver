import { View, Image, Text, ScrollView, Alert, SafeAreaView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Link } from "expo-router";
import { router } from 'expo-router';
import { useGlobalContext } from '~/providers/GlobalProvider';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [phone, setphone] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const { Register } = useGlobalContext();
  
  const handleSignUp = async () => {
    setSubmitting(true);
    try {
      await Register(email, password, username, phone);
      Alert.alert('Success', 'Account created successfully!');
      router.push('/verify')
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
          <View className="w-full justify-center items-center mt-5 px-4">
            <Image source={require('assets/header.png')} className="mt-5" resizeMode='contain'/>
          </View>
          <Text className="text-5xl text-center text-black font-bold mt-5">Create Account</Text>
          <Text className="text-center mt-3 text-xl"> Welcome to Crunchtime halaal food delivery. Signup to create a free delivery. Signup to create an account to start delivering</Text>

          <TextInput
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
            className="mt-10 border border-gray-300 p-4 rounded-lg"
          />

          <TextInput
            placeholder="Phone"
            value={phone}
            onChangeText={setphone}
            className="mt-7 border border-gray-300 p-4 rounded-lg"
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
            className="w-full mt-7 p-4 bg-red-500 text-black font-semibold rounded-xl"
            onPress={handleSignUp}
            disabled={isSubmitting}
          >
            {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text className="text-center text-white">Sign Up</Text>}
          </TouchableOpacity>

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg">Already have an account?</Text>
            <Link href="/signIn" className="text-red-500 font-bold text-lg">Sign in</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
