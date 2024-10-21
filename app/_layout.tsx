import '../global.css';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import GlobalProvider from '~/providers/GlobalProvider';
import RideProvider from '~/providers/RideProvider';
import ScooterProvider from '~/providers/ScooterProvider';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GlobalProvider>
        <ScooterProvider>
          <RideProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}>
              {/* <Stack.Screen name="index" /> */}
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="search/[query]" />
              <Stack.Screen name="orderDelivery/[id]" />
              <Stack.Screen name="Room" />
            </Stack>
          </RideProvider>
        </ScooterProvider>
      </GlobalProvider>
    </GestureHandlerRootView>
  );
}
