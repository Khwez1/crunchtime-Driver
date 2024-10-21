import { Entypo } from '@expo/vector-icons'
import { View, Text, Image, Pressable } from 'react-native'
import { router } from 'expo-router';

const orderItem = ({ order }) => {
  return (
        <Pressable style={{ margin: 10 }} className="flex-row rounded-2xl border-2 border-[#3FC060]" onPress={() => router.push({pathname:'/orderDelivery/[id]', params: { id: order.id },})}>
            <Image source={{ uri: order.Restaurant.image }} className="h-[100%] w-[25%] rounded-l-xl" />
            <View className="flex-1 ml-2">
                <Text className="text-lg font-bold">{order.Restaurant.name}</Text>
                <Text className="text-gray-500">{order.Restaurant.address}</Text>
                <Text className="mt-2 font-bold">Delivery Details:</Text>
                <Text className="text-gray-500">{order.User.name}</Text>
                <Text className="text-gray-500">{order.User.address}</Text>
            </View>
            <View className="justify-center rounded-r-xl bg-[#3FC060] align-middle">
                <Entypo name="check" className="ml-auto" size={30} color="white" />
            </View>
        </Pressable>
    );
}

export default orderItem