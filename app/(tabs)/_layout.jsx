import { View, Text } from 'react-native'
import React from 'react'
import { Tabs, Redirect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import {Colors} from '../../constants/Colors'


export default function TabLayout() {
  return (
    <Tabs screenOptions={{headerShown:false, tabBarActiveTintColor:Colors.Primary}}>
      <Tabs.Screen name='home'
        options={{
            tabBarLabel:'Home',
            tabBarIcon:({color})=><Ionicons name="home" 
            size={24} color={color} />
        }}/>
      <Tabs.Screen name='history'
        options={{
            tabBarLabel:'History',
            tabBarIcon:({color})=><Ionicons name="time-sharp" 
            size={24} color={color} />
        }}/>
      <Tabs.Screen name='liked'
        options={{
            tabBarLabel:'Liked',
            tabBarIcon:({color})=><Ionicons name="heart-sharp" 
            size={24} color={color} />
        }}/>
      <Tabs.Screen name='profile'
        options={{
            tabBarLabel:'Profile',
            tabBarIcon:({color})=><Ionicons name="person-circle"
            size={24} color={color} />
        }}/>
    </Tabs>
  )
}