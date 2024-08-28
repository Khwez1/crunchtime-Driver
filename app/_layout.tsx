import '../global.css';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ScooterProvider from '~/providers/ScooterProvider';
import GlobalProvider from '~/providers/GlobalProvider';


export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GlobalProvider>
        <ScooterProvider>
          <Stack screenOptions={{
            headerShown:false
          }}>
            {/* <Stack.Screen name="index" /> */}
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="search/[query]" />
            <Stack.Screen name="Room" />
          </Stack>
        </ScooterProvider>
      </GlobalProvider>
    </GestureHandlerRootView>
  );
}
