import { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import OrderItem from '~/components/OrderItem';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import Mapbox, { MapView, Camera, LocationPuck, PointAnnotation, Callout } from '@rnmapbox/maps';
import { Fontisto } from '@expo/vector-icons';
import { getOrders, client } from '~/lib/appwrite';
import { Redirect } from 'expo-router';
import { useOrderContext } from '~/providers/OrderProvider';
Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

export default function home() {
  const [orders, setOrders] = useState([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { width, height } = useWindowDimensions();
  const { order } = useOrderContext();

  const snapPoints = useMemo(() => ["12%", "95%"], []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const fetchedOrders = await getOrders();
        setOrders(fetchedOrders);
      } catch (error) {
        console.error('Error in fetching orders:', error);
      }
    };

    fetchOrders();

    const unsubscribe = client.subscribe(
      `databases.${'669a5a3d003d47ff98c7'}.collections.${'6731ec1a001ab4994c0c'}.documents`,
      (response) => {
        if (response.events.includes('databases.*.collections.*.documents.*.create') ||
            response.events.includes('databases.*.collections.*.documents.*.update')
          ) {
          fetchOrders();
        }
      }
    );

    return () => unsubscribe();
  }, []);

  if (order) return <Redirect href={`/orderDelivery/${order.$id}`} />;
  return (
    <View className="flex-1">
      <MapView style={{ height, width }}>
        <Camera followZoomLevel={14} followUserLocation />
        <LocationPuck puckBearingEnabled puckBearing="course" pulsing={{ isEnabled: true }} />
        {orders.map((order) => {
          const restaurant = Array.isArray(order.restaurant) ? order.restaurant[0] : order.restaurant;
          if (!restaurant || typeof restaurant.lng !== 'number' || typeof restaurant.lat !== 'number') {
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
          renderItem={({ item }) => <OrderItem order={item} />}
        />
      </BottomSheet>
    </View>
  );
}