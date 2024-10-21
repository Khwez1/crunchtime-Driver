import * as Location from 'expo-location';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { useGlobalContext } from './GlobalProvider';

import { ID, databases, Query } from '~/lib/appwrite';

const RideContext = createContext({});

export default function RideProvider({ children }: PropsWithChildren) {
  const [ride, setRide] = useState();

  const { user } = useGlobalContext();

  useEffect(() => {
    const fetchActiveRide = async () => {
      const response = await databases.listDocuments(
        '669a5a3d003d47ff98c7',
        '66fd52ac0039a5595558',
        [
          Query.equal('driverId', user.$id), 
          Query.equal('status', 'inProgress')
        ]
      );
      if (response.total > 0) {
        setRide(response);
      }else{
        setRide(undefined)
      }
    };

    if (user?.$id) {
      fetchActiveRide();
    }
  }, [user]);

  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;
  
    const watchLocation = async () => {
      try {
        // Start watching the driver's position
        subscription = await Location.watchPositionAsync(
          { distanceInterval: 100, accuracy: Location.Accuracy.High },
          async (location) => {
            const { latitude, longitude } = location.coords;
            try {
              await databases.updateDocument(
                '669a5a3d003d47ff98c7',
                '66fd52ac0039a5595558',
                ride.$id,
                {
                  driverLong: longitude,
                  driverLat: latitude,
                }
              );
            } catch (error) {
              console.error('Error updating driver location:', error);
            }
          }
        );
      } catch (error) {
        console.error('Error starting location tracking:', error);
      }
    };
  
    if (ride) {
      watchLocation();
    }
  
    // Clean up the location tracking when the ride ends or if the component unmounts
    return () => {
      subscription?.remove();
    };
  }, [ride]);

  const startDelivery = async (scooterId: string) => {
    if (ride) {
      Alert.alert('ride already in progress');
    } else
      try {
        const response = await databases.createDocument(
          '669a5a3d003d47ff98c7',
          '66fd52ac0039a5595558',
          ID.unique(),
          {
            status: 'inProgress',
            createdAt: new Date().toISOString(),
            driverId: user.$id,
            scooterId,
          }
        );
        console.warn('Ride started');
        setRide(response);
      } catch (error) {
        // Check if error contains a message, otherwise use a fallback message
        const errorMessage = error.message || JSON.stringify(error) || 'An unknown error occurred';
        Alert.alert('Failed to start the ride:', errorMessage);
        console.error(error); // Log the full error for debugging
      }
  };

  const finishRide = async () => {
    if (!ride) {
      return;
    }
    try {
      const response = await databases.updateDocument(
        '669a5a3d003d47ff98c7',
        '66fd52ac0039a5595558',
        ride.$id,
        {
          status: 'Delivered',
          finishedAt: new Date().toISOString()
        }
      );
      setRide(undefined);
    } catch (error) {
      Alert.alert('Failed to finish the ride');
      console.error(error); // Log the error for debugging
    }
  };

  console.log('Current ride: ', ride);

  return ( 
    <RideContext.Provider value={{ startDelivery, finishRide, ride }}>
      {children}
    </RideContext.Provider>
  );
}

export const useRide = () => useContext(RideContext);
