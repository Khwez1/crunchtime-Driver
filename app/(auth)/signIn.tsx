import { View, Image, Text, TextInput, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Link } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useGlobalContext } from '~/providers/GlobalProvider';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useGlobalContext()

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await signIn(email, password);
      Alert.alert('Success', 'Signed in successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="w-full justify-center px-4 my-6">
          <View className="w-full justify-center items-center px-4">
            <Image source={require('assets/header.png')} className="mt-5" resizeMode='contain'/>
          </View>
          <Text className="text-5xl text-black text-center font-bold mt-7">Sign In</Text>
          <Text className="text-xl text-center mt-2">Welcome to Crunchtime halaal food delivery. Login to Start</Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            className="mt-7 border border-gray-300 p-4 rounded-lg"
            keyboardType="email-address"
          />

          <View className="mt-7 relative">
            <TextInput
              className="border border-gray-300 rounded-lg p-4 pr-12"
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              onPress={togglePasswordVisibility}
              className="absolute right-3 top-0 bottom-0 justify-center"
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="w-full mt-7 p-4 bg-red-600 text-black font-semibold rounded-xl"
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text className="text-center text-white">Sign In</Text>}
          </TouchableOpacity>

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg">Don't have an account?</Text>
            <Link href="/signUp" className="text-red-600 font-bold text-lg">Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
