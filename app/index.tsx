import { Redirect } from "expo-router";
import { ScrollView, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useGlobalContext } from "~/providers/GlobalProvider"; 

export default function App() {
  const { loading, isLogged } = useGlobalContext();

   if (!loading && isLogged) return <Redirect href="/home" />;
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{height: "100%"}}>
        <View className="w-full justify-center items-center h-full px-4">
          <Link href="/signUp" className="text-red-600 font-bold text-lg">Sign Up</Link>
          <View className="relative mt-5">
            <Text className="text-3xl text-black font-bold text-center">
              Great Food At Your Doorstep
            </Text>
          </View>
        </View>
        {/* <Room /> */}
      </ScrollView>
    </SafeAreaView>
  )
}
