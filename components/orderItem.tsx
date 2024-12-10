import { Entypo } from '@expo/vector-icons'
import { View, Text, Image, Pressable } from 'react-native'
import { router } from 'expo-router';

const OrderItem = ({ order }) => {
  // Access the first element of the restaurant array
  const restaurant = Array.isArray(order.restaurant) ? order.restaurant[0] : order.restaurant;

  return (
    <Pressable 
      style={{ margin: 10 }} 
      className="flex-row rounded-2xl border-2 border-[#3FC060]" 
      onPress={() => router.push({ 
        pathname:'/orderDelivery/[id]', 
        params: { id: order.$id } 
      })}
    >
      {restaurant && restaurant.image && (
        <Image 
          source={{ uri: restaurant.image }} 
          className="h-[100%] w-[25%] rounded-l-xl" 
          style={{ resizeMode: 'cover' }}
        />
      )}
      <View className="flex-1 ml-2">
        <Text className="text-lg font-bold">
          {restaurant ? restaurant.name : 'No Restaurant Name'}
        </Text>
        <Text className="text-gray-500">
          {restaurant?.address || 'No address'}
        </Text>
        <Text className="mt-2 font-bold">Delivery Details:</Text>
        <Text className="text-gray-500">
          {order.user?.username || order.user?.name || 'Unknown User'}
        </Text>
        <Text className="text-gray-500">
          {order.user?.address || 'No address'}
        </Text>
      </View>
      <View className="justify-center rounded-r-xl bg-[#3FC060] align-middle">
        <Entypo name="check" className="ml-auto" size={30} color="white" />
      </View>
    </Pressable>
  );
}

export default OrderItem