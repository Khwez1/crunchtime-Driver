import { View, Text, ScrollView, Alert  } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'
import FormField from './components/FormField'
import { useGlobalContext } from '../../context/GlobalProvider'
import { getCurrentUser, signIn } from "../../lib/appwrite";


export default function signIn() {
  const [form, setForm] = useState({
    email:'',
    password:''
  })
  const [isSubmitting, setSubmitting] = useState(false)
  const { setUser, setIsLogged } = useGlobalContext();


  const submit = async() => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);

    try {
      await signIn(form.email, form.password);
      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      Alert.alert("Success", "User signed in successfully");
      router.replace("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView >
        <ScrollView>
            <View style={tw`w-full justify-center min-h-[82vh] px-4 my-6`}>
              <Text style={tw`text-2xl text-black font-bold mt-10`}>Log In</Text>

              <FormField
                title="Email"
                value={form.username}
                handleChangeText={(e) => setForm({ ...form, email: e })}
                otherStyles="mt-7"
                keyboardType="email-address"
              />

              <FormField
                title="Password"
                value={form.password}
                handleChangeText={(e) => setForm({ ...form, pasword: e })}
                otherStyles="mt-7"
              />

              <button 
                style={tw`w-full mt-7 p-4 bg-red-600 text-black font-semibold rounded-xl`}
                handlePress={submit}
                isLoading={isSubmitting}
              >
                Sign In
              </button>

              <View style={tw`justify-center pt-5 flex-row gap-2`}>
                  <Text style={tw`text-lg`}>
                      Don't have an account?
                  </Text>
                  <Link href="/signUp" style={tw`text-red-600 font-bold text-lg`}>Sign Up</Link>
              </View>

            </View>
        </ScrollView>
    </SafeAreaView>
  )
}