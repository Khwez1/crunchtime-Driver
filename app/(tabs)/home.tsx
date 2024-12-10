import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import OrderItem from '~/components/OrderItem';
import BottomSheet, {BottomSheetFlatList} from '@gorhom/bottom-sheet';
import Mapbox, { MapView, Camera, LocationPuck, PointAnnotation, Callout } from '@rnmapbox/maps';
import { Fontisto } from '@expo/vector-icons';
import { getOrders } from '~/lib/appwrite';
Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

export default function home() {
  const [ orders, setOrders ] = useState([]);
  const bottomSheetRef = useRef<BottomSheet>(null)
  const { width, height } = useWindowDimensions();

  const snapPoints = useMemo(() => ["12%","95%"],[])

  useEffect(() => {
    getOrders().then((fetchedOrders) => {
      console.log('Fetched Orders in Component:', JSON.stringify(fetchedOrders, null, 2));
      setOrders(fetchedOrders);
    }).catch((error) => {
      console.error('Error in fetching orders:', error);
    });
  }, [])

  // Add more logging in the rendering
  useEffect(() => {
    console.log('Current Orders State:', JSON.stringify(orders, null, 2));
  }, [orders]);

  return (
    <View className="flex-1">
      <MapView style={{height, width}}>
        <Camera followZoomLevel={14} followUserLocation />
        <LocationPuck puckBearingEnabled puckBearing="course" pulsing={{ isEnabled: true }} />
        {orders.map((order) => {
          // Extract the first restaurant from the array
          const restaurant = Array.isArray(order.restaurant) 
            ? order.restaurant[0] 
            : order.restaurant;

          // Ensure restaurant exists and has valid coordinates
          if (!restaurant || 
              typeof restaurant.lng !== 'number' || 
              typeof restaurant.lat !== 'number') {
            console.warn(`Invalid restaurant for order ${order.$id}`, restaurant);
            return null;
          }

          return (
            <PointAnnotation 
              key={order.$id}
              id={`order-${order.$id}`}
              coordinate={[restaurant.lng, restaurant.lat]}
              onSelected={() => console.log('PointAnnotation clicked!')}
            >
              <View style={{ backgroundColor: 'red', padding: 5, borderRadius: 20 }}>
                <Fontisto name="shopping-store" size={20} color="white" />
              </View>
              <Callout title={restaurant.name}>
                <Text>{restaurant.name}</Text>
              </Callout>
            </PointAnnotation>
          );
        })}
      </MapView>
      <BottomSheet containerStyle={{ flex: 1 }} ref={bottomSheetRef} snapPoints={snapPoints}>
        <View style={{ alignItems: 'center', marginBottom: 10 }}>
          <Text className='text-[20px] font-bold'>You're Online</Text>
          <Text className='text-gray-500 mt-2'>Available Orders: {orders.length}</Text>
        </View>
        <BottomSheetFlatList 
          scrollEnabled
          scrollToOverflowEnabled
          data={orders}
          keyExtractor={(item) => item.$id}
          renderItem={({item}) => <OrderItem order={item} />}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </BottomSheet>
    </View>
  )
}
