import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, ScrollView } from 'react-native';
import { useGlobalContext } from '~/providers/GlobalProvider';
import OtpInput from '~/components/OTPInput';

const MFAScreen = () => {
  const { completeMfa } = useGlobalContext();
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const handleCompleteMFA = async () => {
    try {
      const response = await completeMfa(otp);
      router.push('/home'); // Navigate to home on success
    } catch (error) {
      Alert.alert('MFA Failed', error.message);
    }
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center px-4 my-6">
          <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 }}>
            Verify Account
          </Text>
          <Text style={{ textAlign: 'center', marginBottom: 20 }}>
            Please enter the OTP number sent to your email to reset your password
          </Text>
          <OtpInput setOtp={setOtp} />
          <TouchableOpacity onPress={handleCompleteMFA} style={{ backgroundColor: 'red', padding: 15, borderRadius: 5, marginTop: 20 }}>
            <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
              Confirm
            </Text>
          </TouchableOpacity>
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Didn't receive code? <Text style={{ color: 'red', fontWeight: 'bold' }}>Request again</Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MFAScreen;
