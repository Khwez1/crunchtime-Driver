import getDistance from '@turf/distance';
import { point } from '@turf/helpers';
import * as Location from 'expo-location';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { functions } from '~/lib/appwrite';
import { getDirections } from '~/services/directions';

const ScooterContext = createContext({});

const ScooterProvider = ({ children }: PropsWithChildren) => {
  const [nearbyScooters, setNearbyScooters] = useState([]);
  const [selectedScooter, setSelectedScooter] = useState();
  const [direction, setDirection] = useState();
  const [isNearby, setIsNearby] = useState(false);
  
  // useEffect(() => {
  //   const fetchScooters = async () => {
  //     const location = await Location.getCurrentPositionAsync();
  //     try {
  //       const response = await functions.createExecution(
  //         '66f56c0900179863a190',
  //         JSON.stringify({
  //           long: location.coords.longitude,
  //           lat: location.coords.latitude,
  //         })
  //       );
        
  //       const data = response.responseBody ? JSON.parse(response.responseBody) : {};

  //       if (data.success) {
  //         setNearbyScooters(data.sortedScooters);
  //         console.log('Nearby scooters:', JSON.stringify(data.sortedScooters, null, 3)); // Log sorted scooters
  //       } else {
  //         console.error('Failed to fetch nearby scooters:', data.error);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching nearby objects:', error);
  //     }
  //   };

  //   fetchScooters();
  // }, []);

  useEffect(() => {
    let subscription: Location.LocationSubscription | undefined;

    const watchLocation = async () => {
      subscription = await Location.watchPositionAsync({ distanceInterval: 10 }, (newLocation) => {
        const from = point([newLocation.coords.longitude, newLocation.coords.latitude]);
        const to = point([selectedScooter?.long, selectedScooter?.lat]);
        const distance = getDistance(from, to, { units: 'meters' });
        if (distance < 100) {
          setIsNearby(true);
        } else{
          setIsNearby(false);
        }
      });
    };

    if (selectedScooter) {
      watchLocation();
    }

    // unsubscribe
    return () => {
      subscription?.remove();
    };
  }, [selectedScooter]);

  useEffect(() => {
    const fetchDirections = async () => {
      const myLocation = await Location.getCurrentPositionAsync();

      const newDirections = await getDirections(
        [myLocation.coords.longitude, myLocation.coords.latitude],
        [selectedScooter.long, selectedScooter.lat]
      );
      setDirection(newDirections);
    };

    if (selectedScooter) {
      setIsNearby(false);
      fetchDirections();
    } else {
      setDirection(undefined);
      setIsNearby(false);
    }
  }, [selectedScooter]);

  console.log('Selected: ', selectedScooter);

  return (
    <ScooterContext.Provider
      value={{
        setSelectedScooter,
        selectedScooter,
        direction,
        directionCoordinates: direction?.routes?.[0]?.geometry?.coordinates,
        duration: direction?.routes?.[0]?.duration,
        distance: direction?.routes?.[0]?.distance,
        isNearby,
        nearbyScooters,
      }}>
      {children}
    </ScooterContext.Provider>
  );
};

export default ScooterProvider;

export const useScooter = () => useContext(ScooterContext);
