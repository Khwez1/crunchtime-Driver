import { Redirect } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from 'twrnc'
import { Images } from "../assets/images";

export default function App() {
  return (
    // <Redirect href={'/home'} />
    <SafeAreaView>
      <ScrollView contentContainerStyle={{height: '100%'}}>
        <View style={tw`w-full justify-center items-center h-full px-4`}>
          <Image 
            source={Images.cru}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
