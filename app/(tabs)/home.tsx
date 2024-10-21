import React, { useEffect, useMemo, useRef } from 'react';
import { Image, View, Text, Dimensions, useWindowDimensions, FlatList } from 'react-native';
import Buttons from '../../components/Buttons';
import Cards from '../../components/Cards';
import Minicards from '../../components/Minicards';
import OrderItem from '~/components/orderItem';
import orders from '~/data/orders.json'
import BottomSheet from '@gorhom/bottom-sheet';
import { MapView, Camera, LocationPuck, PointAnnotation, Callout } from '@rnmapbox/maps';
import { Fontisto } from '@expo/vector-icons';
export default function home() {
  const bottomSheetRef = useRef<BottomSheet>(null)
  const {width, height} = useWindowDimensions();

  const snapPoints = useMemo(() => ["12%","95%"],[])

  return (
    <View className="flex-1">
      <MapView style={{height, width}}>
        <Camera followZoomLevel={14} followUserLocation />
        <LocationPuck puckBearingEnabled puckBearing="course" pulsing={{ isEnabled: true }} />
        {orders.map((order) => (
          <PointAnnotation 
            key={order.id} // Ensure each order has a unique key
            id={`order-${order.id}`} 
            coordinate={[order.Restaurant.lng, order.Restaurant.lat]} // Replace with marker's actual coordinates
            onSelected={() => console.log('PointAnnotation clicked!')}
          >
            <View style={{ backgroundColor: 'red', padding: 5, borderRadius: 20 }}>
              <Fontisto name="shopping-store" size={20} color="white" />
            </View>
            <Callout title={order.Restaurant.name} >
              {/* <Text>{order.Restaurant.address}</Text> */}
            </Callout>
          </PointAnnotation>
        ))}
      </MapView>
      <BottomSheet containerStyle={{ flex: 1 }} ref={bottomSheetRef} snapPoints={snapPoints}>
        <View style={{ alignItems: 'center', marginBottom: 10 }}>
          <Text className='text-[20px] font-bold'>You're Online</Text>
          <Text className='text-gray-500 mt-2'>Available Orders: {orders.length}</Text>
        </View>
        <FlatList 
          scrollEnabled
          scrollToOverflowEnabled
          data={orders}
          renderItem={({item}) => <OrderItem order={item} />}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      </BottomSheet>
    </View>
  )
}
