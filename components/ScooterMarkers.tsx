import { ShapeSource, SymbolLayer, Images, CircleLayer } from '@rnmapbox/maps';
import { OnPressEvent } from '@rnmapbox/maps/lib/typescript/src/types/OnPressEvent';
import { featureCollection, point } from '@turf/helpers';

import pin from '~/assets/pin.png';
import { useScooter } from '~/providers/ScooterProvider';
// import scooters from '~/data/scooters.json';

const ScooterMarkers = () => {
  const { setSelectedScooter, nearbyScooters } = useScooter();

  const points = nearbyScooters.map((scooter) => point([scooter.long, scooter.lat], { scooter }));

  const onPointPress = async (event: OnPressEvent) => {
    if (event.features[0].properties?.scooter) {
      setSelectedScooter(event.features[0].properties.scooter);
    }
  };

  return (
    <ShapeSource id="scooter" cluster shape={featureCollection(points)} onPress={onPointPress}>
      <SymbolLayer
        id="clusters-count"
        style={{
          textField: ['get', 'point_count'],
          textSize: 18,
          textColor: '#ffffff',
          textPitchAlignment: 'map',
        }}
      />

      <CircleLayer
        id="clusters"
        belowLayerID="clusters-count"
        filter={['has', 'point_count']}
        style={{
          circlePitchAlignment: 'map',
          circleColor: '#42E100',
          circleRadius: 20,
          circleOpacity: 1,
          circleStrokeWidth: 2,
          circleStrokeColor: 'white',
        }}
      />

      <SymbolLayer
        id="scooter-icons"
        filter={['!', ['has', 'point_count']]}
        style={{
          iconImage: 'pin',
          iconSize: 0.5,
          iconAllowOverlap: false,
          iconAnchor: 'bottom',
        }}
      />

      <Images images={{ pin }} />
    </ShapeSource>
  );
};

export default ScooterMarkers;
