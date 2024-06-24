import { Redirect } from "expo-router";
import { ScrollView, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from 'twrnc'
import { images } from "../constants/images";

export default function App() {
  return (
    // <Redirect href={'/home'} />
    <SafeAreaView>
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View style={tw`w-full justify-center items-center h-full px-4`}>

          <Image
            source={images.Logo}
            style={tw`w-[130px] h-[84px]`}
            resizeMode="contain"
          />

          <Image
            source={images.Card}
            style={tw`max-w-[380px] w-full h-[300px]`}
            resizeMode="contain"
          />

          <View style={tw`relative mt-5`}>
            <Text style={tw`text-3xl text-black font-bold text-center`}>
              Great Food At Your Doorstep
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
