import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native-gesture-handler'
import tw from 'twrnc'
import { Entypo } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function FormField({ title, value, placeholder, handleChangeText, otherStyles, ...props}) {

  return (
    <View style={tw`space-y-2`}>
      <Text style={tw`text-base text-black font-semibold`}>{title}</Text>
      <View style={tw`border-2 border-red-600 rounded-xl flex-row`}>
        <TextInput
          style={tw`flex-1 text-black font-semibold text-base`}
          value={value}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
        />

        {title === 'Password' && (
            <TouchableOpacity onPress={() =>
                setShowPassword(!showPassword)}>
                <Image source={!showPassword ? 
                <Entypo name="eye" size={24} color="black" /> : 
                <Entypo name="eye-with-line" size={24} color="black" />} style={tw`w-6 h-6`} 
                resizeMode='contain'/>
            </TouchableOpacity>
        )}

      </View>
    </View>
    )
}