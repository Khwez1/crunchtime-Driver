import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import * as Location from 'expo-location'
const ScooterContext = createContext({});
import { getDirections } from "~/services/directions";

const ScooterProvider = ({children}: PropsWithChildren) => {
  const [selectedScooter, setSelectedScooter] = useState();
  const [direction, setDirection] = useState();

  useEffect(() => {
    const fetchDirections = async () => {
      const myLocation = await Location.getCurrentPositionAsync();

      const newDirections = await getDirections(
        [myLocation.coords.longitude, myLocation.coords.latitude],
        [selectedScooter.long, selectedScooter.lat]
      );
      setDirection(newDirections);
    };

    if(selectedScooter) {
        fetchDirections();
    }
  }, [selectedScooter]);

  console.log('Selected: ', selectedScooter);

  return (
    <ScooterContext.Provider
      value={{
        selectedScooter,
        setSelectedScooter,
        direction,
        directionCoordinates: direction?.routes?.[0]?.geometry?.coordinates,
        duration: direction?.routes?.[0]?.duration,
        distance: direction?.routes?.[0]?.distance
      }}>
      {children}
    </ScooterContext.Provider>
  );
}

export default ScooterProvider

export const useScooter = () => useContext(ScooterContext)