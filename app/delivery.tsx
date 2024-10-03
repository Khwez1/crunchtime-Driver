import Map from '~/components/Map';
import SelectedScooterSheet from '~/components/SelectedScooterSheet';
import ActiveRideSheet from '~/components/ActiveRideSheet';

const delivery = () => {
  return (
    <>
      <Map />
      <SelectedScooterSheet />
      <ActiveRideSheet />
    </>
  );
};

export default delivery;
