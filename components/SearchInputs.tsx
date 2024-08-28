import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname } from 'expo-router'

const SeachInput = ({
    title, value, placeholder, handleChangeText, otherStyles, ...props
    }) => {

    const pathname = usePathname();
    const [query, setQuery] = useState('')

    return (
        <View className='border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-red-600 items-center flex-row space-x-4'>
            <TextInput 
            className='text-base mt-0.5 text-white flex-1 font-pregular'
            value={query}
            placeholder='Search for a video topic'
            placeholderTextColor='#CDCDE0'
            onChangeText={(e) => setQuery(e)}
            />

            <TouchableOpacity
            onPress={() => {
                if (!query) {
                    return Alert.alert('please fill request in searchbar')
                }
                if(pathname.startsWith('/search')) router.setParams({ query })
                    else router.push(`/search/${query}`)
            }}
            >
                <Ionicons name="search" size={24} color="black" />
            </TouchableOpacity>
        </View>
    )
}

export default SeachInput