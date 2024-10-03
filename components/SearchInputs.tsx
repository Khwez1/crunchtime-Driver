import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';

const SeachInput = ({ title, value, placeholder, handleChangeText, otherStyles, ...props }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState('');

  return (
    <View className="border-black-200 bg-black-100 h-16 w-full flex-row items-center space-x-4 rounded-2xl border-2 px-4 focus:border-red-600">
      <TextInput
        className="font-pregular mt-0.5 flex-1 text-base text-white"
        value={query}
        placeholder="Search for a video topic"
        placeholderTextColor="#CDCDE0"
        onChangeText={(e) => setQuery(e)}
      />

      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert('please fill request in searchbar');
          }
          if (pathname.startsWith('/search')) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}>
        <Ionicons name="search" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

export default SeachInput;
