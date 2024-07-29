import React from 'react';
import Mapbox, {
  Camera,
  LocationPuck,
  MapView,
} from '@rnmapbox/maps';
import { useScooter } from '~/providers/ScooterProvider';
import LineRoute from '~/components/LineRoute';
import ScooterMarkers from '~/components/ScooterMarkers';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_KEY || '');

const Map = () => {
  const { directionCoordinates, duration } = useScooter();
  console.log('Time:', duration);
  
  return (
    <MapView style={{ flex: 1 }} styleURL="mapbox://styles/mapbox/dark-v11">
      <Camera followZoomLevel={14} followUserLocation />
      <LocationPuck puckBearingEnabled puckBearing="heading" pulsing={{ isEnabled: true }} />

      <ScooterMarkers />

      {directionCoordinates && <LineRoute coordinates={directionCoordinates} />}
    </MapView>
  );
};

export default Map;
