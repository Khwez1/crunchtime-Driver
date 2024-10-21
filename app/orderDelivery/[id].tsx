import { View, Text, Pressable, useWindowDimensions } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { FontAwesome5, Fontisto, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import orders from '~/data/orders.json';
import * as Location from 'expo-location';
import { Callout, Camera, LocationPuck, MapView, PointAnnotation } from '@rnmapbox/maps';
import { point } from '@turf/helpers'
import  getDistance  from '@turf/distance'
import { getDirections } from '~/services/directions';
import LineRoute from '~/components/LineRoute';

const OrderDelivery = () => {
  const [driverLocation, setDriverLocation] = useState(null);
  const [direction, setDirection] = useState(null);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isNearby, setIsNearby] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const mapRef = useRef(null)

  const { id } = useLocalSearchParams();
  const { height, width } = useWindowDimensions();
  
  const snapPoints = useMemo(() => ['12%', '95%'], []);

  const directionCoordinates = direction?.routes?.[0]?.geometry?.coordinates;
  const duration = direction?.routes?.[0]?.duration;
  const distance = direction?.routes?.[0]?.distance;

  const order = useMemo(() => orders.find((o) => o.id === id), [id]);

  const ORDER_STATUSES = {
    READY_FOR_PICKUP: "READY_FOR_PICKUP",
    ACCEPTED: "ACCEPTED",
    PICKED_UP: "PICKED_UP",
  }

  const [deliveryStatus, setDeliveryStatus] = useState(ORDER_STATUSES.READY_FOR_PICKUP);

  // Fetch the driver's location
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.error('Permission to access location was denied');
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setDriverLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        const foregroundSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            distanceInterval: 100,
          },
          (updatedLocation) => {
            setDriverLocation({
              latitude: updatedLocation.coords.latitude,
              longitude: updatedLocation.coords.longitude,
            });
          }
        );

        // Return a cleanup function to remove the subscription
        return () => {
          foregroundSubscription.remove();
        };
      } catch (error) {
        console.error('Error getting location:', error);
      }
    };

    fetchLocation();
  }, []);

  useEffect(() => {
    let subscription;
  
    const watchLocation = async () => {
      subscription = await Location.watchPositionAsync(
        { distanceInterval: 10, accuracy: Location.Accuracy.High },
        (newLocation) => {
          if (order?.Restaurant?.lng && order?.Restaurant?.lat) {
            const from = point([newLocation.coords.longitude, newLocation.coords.latitude]);
            const to = point([order.Restaurant.lng, order.Restaurant.lat]);
            const distance = getDistance(from, to, { units: 'meters' });
  
            if (distance < 100) {
              setIsNearby(true);
            } else {
              setIsNearby(false);
            }
          }
        }
      );
    };
  
    if (order?.Restaurant) {
      watchLocation();
    }
  
    // Cleanup subscription when component unmounts
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [order?.Restaurant]);
  
  useEffect(() => {
    if (driverLocation && order) {
      setIsDataReady(true);
      const fetchDirections = async () => {
        try {
          const waypoint = [order.Restaurant.lng, order.Restaurant.lat]; // waypoint coordinates
          const newDirections = await getDirections(
            [driverLocation.longitude, driverLocation.latitude],
            waypoint,
            [order.User.lng, order.User.lat ]
          );
          console.log('Fetched directions:', newDirections);
          setDirection(newDirections);
        } catch (error) {
          console.error('Error fetching directions:', error);
        }
      };
      fetchDirections();
    }
  }, [driverLocation, order]);

  if (!driverLocation || !isDataReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const onButtonPressed = () => {
    if (deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP) {
      bottomSheetRef.current?.collapse();
      setDeliveryStatus(ORDER_STATUSES.ACCEPTED);
    } else if (deliveryStatus === ORDER_STATUSES.ACCEPTED) {
      setDeliveryStatus(ORDER_STATUSES.PICKED_UP);
    } else if (deliveryStatus === ORDER_STATUSES.PICKED_UP) {
      console.warn('Delivery finished');
    }
  };

  const renderButtonTitle = () => {
    switch (deliveryStatus) {
      case ORDER_STATUSES.READY_FOR_PICKUP:
        return 'Accept Order';
      case ORDER_STATUSES.ACCEPTED:
        return 'Pick-up Order';
      case ORDER_STATUSES.PICKED_UP:
        return 'Complete Delivery';
      default:
        return 'Accept Order';
    }
  };

  const isButtonDisabled = () => {
    if(deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP) {
      return false;
    }
    if(deliveryStatus === ORDER_STATUSES.ACCEPTED && isNearby) {
      return false;
    }
    if(deliveryStatus === ORDER_STATUSES.PICKED_UP && isNearby) {
      return false;
    }
    return true;
  }

  return (
    <View className="flex-1">
      <MapView ref={mapRef} style={{ height, width }}>
        <Camera followZoomLevel={14} followUserLocation />
        <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />
        { directionCoordinates && <LineRoute coordinates={directionCoordinates} />}
        { deliveryStatus === ORDER_STATUSES.ACCEPTED ?
        <PointAnnotation
          id="restaurant-marker"
          coordinate={[order.Restaurant.lng, order.Restaurant.lat]} // Ensure correct order
          onSelected={() => console.log('Restaurant marker clicked!')}>
          <View style={{ backgroundColor: 'red', padding: 5, borderRadius: 20 }}>
            <Fontisto name="shopping-store" size={20} color="white" />
          </View>
          <Callout title={order?.Restaurant.name} />
        </PointAnnotation> 
          : 
        <PointAnnotation
        id="user-marker"
          coordinate={[order.User.lng, order.User.lat]} // Ensure correct order
          onSelected={() => console.log('User marker clicked!')}>
          <View style={{ backgroundColor: 'red', padding: 5, borderRadius: 20 }}>
            <MaterialIcons name="restaurant" size={20} color="white" />
          </View>
          <Callout title={order?.User.name} />
        </PointAnnotation>
        }
        { deliveryStatus === ORDER_STATUSES.READY_FOR_PICKUP ?
        <PointAnnotation
          id="restaurant-marker"
          coordinate={[order.Restaurant.lng, order.Restaurant.lat]} // Ensure correct order
          onSelected={() => console.log('Restaurant marker clicked!')}>
          <View style={{ backgroundColor: 'red', padding: 5, borderRadius: 20 }}>
            <Fontisto name="shopping-store" size={20} color="white" />
          </View>
          <Callout title={order?.Restaurant.name} />
        </PointAnnotation> 
        : 
        <></>
        }
      </MapView>
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
          <Text className="py-[20px] text-[25px]">{order.Restaurant.name}</Text>
          <View className="mb-[20px] flex-row align-middle">
            <Fontisto name="shopping-store" size={22} color="grey" />
            <Text className="ml-[15px] text-xl font-bold text-gray-500">
              {order.Restaurant.address}
            </Text>
          </View>
          <View className="mb-[20px] ml-[2.5px] flex-row align-middle">
            <FontAwesome5 name="map-marker-alt" size={26} color="grey" />
            <Text className="ml-[20px] text-xl font-bold text-gray-500">{order.User.address}</Text>
          </View>
          <View className="border-t-[1px] border-gray-500 pt-[20px]">
            <Text className="mb-5 text-[18px] font-bold text-gray-500">Onion Rings x1</Text>
            <Text className="mb-5 text-[18px] font-bold text-gray-500">Big Mac x3</Text>
            <Text className="mb-5 text-[18px] font-bold text-gray-500">Big Tasty x2</Text>
            <Text className="mb-5 text-[18px] font-bold text-gray-500">Coca-cola x1</Text>
          </View>
        </View>

        <Pressable
          onPress={onButtonPressed}
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
            {renderButtonTitle()} {/* Display appropriate button title */}
          </Text>
        </Pressable>

      </BottomSheet>
    </View>
  );
};

export default OrderDelivery;
