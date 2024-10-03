import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';

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
        [Query.equal('driverId', user.$id), Query.equal('status', 'inProgress')]
      );
      if (response.total > 0) {
        setRide(response);
      }else{
        setRide(null)
      }
    };

    if (user?.$id) {
      fetchActiveRide();
    }
  }, [user]);

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
    if(!ride) {
      return;
    }
    const response = await databases.updateDocument(
      '669a5a3d003d47ff98c7',
      '66fd52ac0039a5595558',
      ride.$id,
      {
        status: 'Delivered',
        finishedAt: new Date().toISOString()
      }
    )
    if(error) {
      Alert.alert('Failed to finish the ride')
    } else {
      setRide(null);
    }
  }

  console.log('Current ride: ', ride);

  return <RideContext.Provider value={{ startDelivery, finishRide, ride }}>{children}</RideContext.Provider>;
}

export const useRide = () => useContext(RideContext);
