import Mapbox, { Camera, LocationPuck, MapView } from '@rnmapbox/maps';

import LineRoute from '~/components/LineRoute';
import ScooterMarkers from '~/components/ScooterMarkers';
import { useRide } from '~/providers/RideProvider';

import { useScooter } from '~/providers/ScooterProvider';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

const Map = () => {
  const { directionCoordinates, duration } = useScooter();
  const { ride } = useRide();

  const showMarkers = !ride;

  console.log('Time:', duration);

  // return (
    // <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
    //   
    //   {showMarkers && (
    //     <>
    //       <ScooterMarkers />
    //       {directionCoordinates && <LineRoute coordinates={directionCoordinates} />}
    //     </>
    //   )}
    // </MapView>
  // );
};

export default Map;
