import { View, Text, TextInput, ScrollView, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { Link } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import { signIn } from "../../lib/appwrite";

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isSubmitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const user = await signIn(email, password);
      setUser(user);
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
        <View style={tw`w-full justify-center px-4 my-6`}>
          <Text style={tw`text-2xl text-black font-bold mt-10`}>Log In</Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={tw`mt-7 border border-gray-300 p-4 rounded-lg`}
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={tw`mt-7 border border-gray-300 p-4 rounded-lg`}
            secureTextEntry
          />

          <TouchableOpacity
            style={tw`w-full mt-7 p-4 bg-red-600 text-black font-semibold rounded-xl`}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={tw`text-center text-white`}>Sign In</Text>}
          </TouchableOpacity>

          <View style={tw`justify-center pt-5 flex-row gap-2`}>
            <Text style={tw`text-lg`}>Don't have an account?</Text>
            <Link href="/signUp" style={tw`text-red-600 font-bold text-lg`}>Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
