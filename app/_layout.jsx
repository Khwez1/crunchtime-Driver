import { useEffect } from "react";
// import { useFonts } from "expo-font";
import "react-native-url-polyfill/auto";
import { Stack } from "expo-router";

import GlobalProvider from "../context/GlobalProvider";

export default function RootLayout() {
  
  return (
    <GlobalProvider>
      <Stack 
        screenOptions={{
          headerShown:false
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="search/[query]" />
        <Stack.Screen name="Room" />
      </Stack>
    </GlobalProvider>
  );
}
