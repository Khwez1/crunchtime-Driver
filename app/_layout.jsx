// import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import privateRoutes from './utils/privateRoutes'


export default function RootLayout() {
  // useFonts({
  //   'outfit':require('../assets/fonts/Outfit-Regular.ttf'),
  //   'outfit-medium':require('../assets/fonts/Outfit-Bold.ttf'),
  //   'outfit-bold':require('../assets/fonts/Outfit-Medium.ttf')
  // })
  return (
    <authProvider>
      <privateRoutes>
        <Stack screenOptions={{
          headerShown:false
        }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </privateRoutes>
      <Stack>
        <Stack.Screen name="components" />
      </Stack>
    </authProvider>
  );
}
