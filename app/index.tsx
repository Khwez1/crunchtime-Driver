import { Redirect } from "expo-router";
import { TouchableOpacity, ScrollView, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { useGlobalContext } from "~/providers/GlobalProvider"; 

export default function App() {
  const { loading, isLogged } = useGlobalContext();

   if (!loading && isLogged) return <Redirect href="/home" />;
  return (
    <SafeAreaView className="h-full">
      <ScrollView contentContainerStyle={{height: "100%"}}>
        <View className="w-full justify-center px-4 my-6">
          <View className="w-full justify-center items-center px-4">
            <Image source={require('assets/welcome.png')} className="mt-10" />
            <View className="justify-center text-center">
              <Text className="text-5xl text-center text-black font-bold mt-5">
                Welcome
              </Text>
              <Text className="mt-3 text-center text-lg">
                Register now and begin your CrunchTime Deliveries
              </Text>

                <View className="justify-center">
                  <TouchableOpacity 
                    className="w-full mt-7 p-4 bg-red-500 text-black font-semibold rounded-xl"
                  >
                    <Link href="/signUp" className="text-center text-white font-bold">Create account</Link>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    className="w-full mt-7 p-4 !border-red-500 border-2 font-semibold rounded-xl"
                  >
                    <Link href="/signIn" className="text-center text-red-500 font-bold">Login</Link>
                  </TouchableOpacity>
                </View>

              <Text className="mt-5 text-center">
                By Logging In Or Registering. You Have Agreed To <Text className="text-red-500">The Terms And Conditions</Text> And <Text className="text-red-500">Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
