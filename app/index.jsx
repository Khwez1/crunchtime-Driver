import { Redirect } from "expo-router";
import { ScrollView, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from 'twrnc'
import { Link } from "expo-router";
import Room from "../components/Room";
// import { useGlobalContext } from "../context/GlobalProvider"; 

export default function App() {
  // const { loading, isLogged } = useGlobalContext();

  //  if (!loading && isLogged) return <Redirect href="/home" />;
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View style={tw`w-full justify-center items-center h-full px-4`}>
          <Link href='/signUp'>Sign Up</Link>
          <View style={tw`relative mt-5`}>
            <Text style={tw`text-3xl text-black font-bold text-center`}>
              Great Food At Your Doorstep
            </Text>
          </View>
        </View>
        {/* <Room /> */}
      </ScrollView>
    </SafeAreaView>
  )
}
