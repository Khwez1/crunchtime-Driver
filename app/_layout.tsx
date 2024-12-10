import '../global.css';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GlobalProvider from '~/providers/GlobalProvider';
import OrderProvider from '~/providers/OrderProvider';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GlobalProvider>
        <OrderProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: true
            }}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="search/[query]" />
            <Stack.Screen name="orderDelivery/[id]" />
            <Stack.Screen name="Room" />
          </Stack>
        </OrderProvider>
      </GlobalProvider>
    </GestureHandlerRootView>
  );
}
