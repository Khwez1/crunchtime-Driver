import { useRef, useMemo, useEffect } from 'react'
import { View, Text, Pressable } from 'react-native'
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { FontAwesome5, Fontisto, MaterialIcons } from '@expo/vector-icons';
import { useOrderContext } from "~/providers/OrderProvider";
import { router } from 'expo-router';

const STATUS_TO_TITLE = {
  READY_FOR_PICKUP: "READY_FOR_PICKUP",
  ACCEPTED: "ACCEPTED",
  PICKED_UP: "PICKED_UP",
};

const BottomSheetDetails = (props) => {
  const { distance, duration, isNearby, onAccepted } = props;
    
  const { order, acceptOrder, completeOrder, pickUpOrder } = useOrderContext()
  const bottomSheetRef = useRef<BottomSheet>(null);
  
  // useEffect(() => {
  //   console.log('Order items:', order?.items);
  // }, [order]);
  
  const snapPoints = useMemo(() => ['12%', '95%'], []);

  const onButtonPressed = async () => {
    const { orderStatus } = order;
      if (orderStatus === "READY_FOR_PICKUP") {
      bottomSheetRef.current?.collapse();
      await acceptOrder();
      onAccepted();
      } else if (orderStatus === "ACCEPTED") {
        bottomSheetRef.current?.collapse();
        await pickUpOrder();
      } else if (orderStatus === "PICKED_UP") {
        await completeOrder();
        bottomSheetRef.current?.collapse();
        router.push('/home')
      }
    };

    const isButtonDisabled = () => {
      const { orderStatus } = order;
      if(orderStatus === "READY_FOR_PICKUP") {
        return false;
      }
      if((orderStatus === "ACCEPTED" || orderStatus === "PICKED_UP") && isNearby) {
        return false;
      }
      return true;
    }

    return(
      <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      handleIndicatorStyle={{ backgroundColor: 'grey', width: 100 }}>
      <View className="mb-[20px] mt-4 flex-row justify-center align-middle">
        <Text className="text-[25px]">{duration?.toFixed()} secs</Text>
        <FontAwesome5
          name="shopping-bag"
          size={30}
          color="#3FC060"
          style={{ marginHorizontal: 10 }}
        />
        <Text className="text-[25px]">{distance?.toFixed(2)} m</Text>
      </View>

      <View className="border-t-[1px] border-gray-500 px-[20px]">
        <Text className="py-[20px] text-[25px]">{order?.restaurant?.name}</Text>
        <View className="mb-[20px] flex-row align-middle">
          <Fontisto name="shopping-store" size={22} color="grey" />
          <Text className="ml-[15px] text-xl font-bold text-gray-500">
            {order?.restaurant?.address}
          </Text>
        </View>
        <View className="mb-[20px] ml-[2.5px] flex-row align-middle">
          <FontAwesome5 name="map-marker-alt" size={26} color="grey" />
          <Text className="ml-[20px] text-xl font-bold text-gray-500">{order?.user?.address}</Text>
        </View>
        <View className="border-t-[1px] border-gray-500 pt-[20px]">
          <BottomSheetFlatList 
            data={typeof order.items === 'string' ? JSON.parse(JSON.parse(order.items)) : order.items}
            keyExtractor={(item, index) => `${item.dishId}-${index}`}
            renderItem={({ item }) => (
              <View className="flex-row justify-between mb-5">
                <Text className="text-[18px] font-bold text-gray-500">
                  {item.name}
                </Text>
                <Text className="text-[18px] font-bold text-gray-500">
                  x{item.quantity}
                </Text>
              </View>
            )}
          />
        </View>
      </View>

      <Pressable
        onPress={() => onButtonPressed()}
        disabled={isButtonDisabled()} // Disable the button based on logic
        style={{
          justifyContent: 'center',
          alignContent: 'center',
          marginHorizontal: 10,
          marginVertical: 30,
          marginTop: 'auto',
          borderRadius: 10,
          backgroundColor: isButtonDisabled() ? 'gray' : '#3FC060',
          opacity: isButtonDisabled() ? 0.6 : 1, // Optional: dim the button when disabled
        }}
      >
        <Text style={{ paddingVertical: 15, textAlign: 'center', fontSize: 25, fontWeight: 'bold', color: 'white' }}>
          {STATUS_TO_TITLE[order?.orderStatus]} {/* Display appropriate button title */}
        </Text>
      </Pressable>

      </BottomSheet>
    )
}

export default BottomSheetDetails