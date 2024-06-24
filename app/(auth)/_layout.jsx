import React from 'react'
import { Redirect, Stack } from 'expo-router'

export default function AuthLayout() {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/home" />;
  
  return (
    <>
        <Stack>
            <Stack.Screen
                name='signIn'
                options={{ 
                headerShown:false
                }}
            />
            <Stack.Screen
                name='signUp'
                options={{ 
                headerShown:false
                }}
            />
        </Stack>
    </>
  )
}