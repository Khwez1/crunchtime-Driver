import { View, Text, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'
import FormField from './components/FormField'
import { createUser } from "../../lib/appwrite";
import { useGlobalContext } from '../../context/GlobalProvider'


export default function signUp() {
  const { setUser, setIsLogged } = useGlobalContext();
  const [form, setForm] = useState({
    username:'',
    email:'',
    password:''
  })
  const [isSubmitting, setSubmitting] = useState(false)

  const submit = async() => {
    if (form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
    }

    setSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.username);
      setUser(result);
      setIsLogged(true);

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
              <Text style={tw`text-2xl text-black font-bold mt-10`}>Sign Up</Text>

              <FormField
                title="Username"
                value={form.email}
                handleChangeText={(e) => setForm({ ...form, username: e })}
                otherStyles="mt-10"
              />

              <FormField
                title="Email"
                value={form.email}
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
                       have an account already?
                  </Text>
                  <Link href="/signIn" style={tw`text-red-600 font-bold text-lg`}>Sign in</Link>
              </View>


            </View>
        </ScrollView>
    </SafeAreaView>
  )
}