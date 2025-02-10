import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import * as Location from 'expo-location';
import { Callout, Camera, LocationPuck, MapView, PointAnnotation } from '@rnmapbox/maps';
import { point } from '@turf/helpers';
import getDistance from '@turf/distance';
import { getDirections } from '~/services/directions';
import LineRoute from '~/components/LineRoute';
import { useOrderContext } from '~/providers/OrderProvider';
import BottomSheetDetails from '~/components/BottomSheetDetails';
import { databases } from '~/lib/appwrite';
import { useGlobalContext } from '~/providers/GlobalProvider';
import { Fontisto, MaterialIcons } from '@expo/vector-icons';

const OrderDelivery = () => {
  console.log('OrderDelivery component rendered');

  // Context and route params
  const { order: rawOrder, fetchOrder } = useOrderContext();
  const { profile } = useGlobalContext();
  const { id } = useLocalSearchParams();

  // States
  const [driverLocation, setDriverLocation] = useState(null);
  const [direction, setDirection] = useState(null);
  const [isNearby, setIsNearby] = useState(false);

  // Refs
  const mapRef = useRef(null);
  const lastDistanceRef = useRef(null);

  const { height, width } = useWindowDimensions();

  // Memoized values
  const order = useMemo(() => {
    if (!rawOrder) return null;
  
    try {
      const restaurant = typeof rawOrder.restaurant === "string"
        ? JSON.parse(rawOrder.restaurant)
        : rawOrder.restaurant;
      const user = typeof rawOrder.user === "string"
        ? JSON.parse(rawOrder.user)
        : rawOrder.user;        
      return { ...rawOrder, restaurant, user };
    } catch (error) {
      console.error("Error parsing order:", error);
      return null;
    }
  }, [rawOrder]); // Only re-calculate when `rawOrder` changes
  

  const restaurantLocation = useMemo(
    () => order?.restaurant && { lat: order.restaurant.lat, lng: order.restaurant.lng },
    [order?.restaurant]
  );

  const userLocation = useMemo(
    () => order?.user && { lat: order.user.lat, lng: order.user.lng },
    [order?.user]
  );

  // Fetch order on mount
  useEffect(() => {
    if (!id || rawOrder?.$id === id) return; // Skip if order is already fetched
    // console.log("Fetching order with ID:", id);
    fetchOrder(id);
  }, [id, rawOrder?.$id, fetchOrder]);
  

  // Optimized location update handler
  const updateLocationHandler = useCallback(async (newLocation) => {
    if (!restaurantLocation) return;

    const from = point([newLocation.longitude, newLocation.latitude]);
    const to = point([restaurantLocation.lng, restaurantLocation.lat]);
    const distanceToRestaurant = getDistance(from, to, { units: 'meters' });

    if (lastDistanceRef.current === null || Math.abs(distanceToRestaurant - lastDistanceRef.current) > 100) {
      lastDistanceRef.current = distanceToRestaurant;
      setDriverLocation(newLocation);
      setIsNearby(distanceToRestaurant < 10000);

      try {
        await databases.updateDocument(
          '669a5a3d003d47ff98c7',
          '66bc885a002d237e96b9',
          profile.$id,
          {
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
          }
        );
        console.log('Driver location updated successfully');
      } catch (error) {
        console.error('Error updating driver location:', error);
      }
    }
  }, [restaurantLocation, profile?.$id]);

  // Watch driver location
  useEffect(() => {
    let locationSubscription;
    const watchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (locationUpdate) => {
          const newLocation = {
            latitude: locationUpdate.coords.latitude,
            longitude: locationUpdate.coords.longitude,
          };
          updateLocationHandler(newLocation);
        }
      );
    };

    if (order) {
      watchLocation();
    }

    return () => locationSubscription?.remove();
  }, [order, updateLocationHandler]);

  // Fetch directions
  useEffect(() => {
    const fetchDirections = async () => {
      if (driverLocation && restaurantLocation && userLocation) {
        try {
          const newDirections = await getDirections(
            [driverLocation?.longitude, driverLocation?.latitude],
            [restaurantLocation.lng, restaurantLocation.lat],
            [userLocation.lng, userLocation.lat]
          );
          console.log('Directions API Response:', newDirections);
          setDirection(newDirections);
        } catch (error) {
          console.error('Error fetching directions:', error);
        }
      }
    };

    fetchDirections();
  }, [driverLocation, restaurantLocation, userLocation]);

  // Zoom in on driver
  const zoomInOnDriver = useCallback(() => {
    if (driverLocation) {
      mapRef?.current?.animateToRegion({
        latitude: driverLocation.latitude,
        longitude: driverLocation.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [driverLocation]);

  // Loading state
  if (!driverLocation || !direction) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Render
  return (
    <View style={{ flex: 1 }}>
      <MapView ref={mapRef} style={{ height, width }}>
        <Camera followZoomLevel={14} followUserLocation />
        <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />

        {direction?.routes?.[0]?.geometry?.coordinates && (
          <LineRoute coordinates={direction.routes[0].geometry.coordinates} />
        )}

        {order?.restaurant && (
          <PointAnnotation
            id="restaurant-marker"
            coordinate={[order.restaurant.lng, order.restaurant.lat]}
          >
            <View style={{ backgroundColor: 'red', padding: 5, borderRadius: 20 }}>
              <Fontisto name="shopping-store" size={20} color="white" />
            </View>
            <Callout title={order.restaurant.name} />
          </PointAnnotation>
        )}

        {order?.user && (
          <PointAnnotation
            id="user-marker"
            coordinate={[order.user.lng, order.user.lat]}
          >
            <View style={{ backgroundColor: 'blue', padding: 5, borderRadius: 20 }}>
              <MaterialIcons name="restaurant" size={20} color="white" />
            </View>
            <Callout title={order.user.username} />
          </PointAnnotation>
        )}
      </MapView>

      <BottomSheetDetails
        distance={direction.routes[0].distance}
        duration={direction.routes[0].duration}
        isNearby={isNearby}
        onAccepted={() => zoomInOnDriver()}
      />
    </View>
  );
};

export default OrderDelivery;
