import { fetchGeoGraphicContextService } from '@/services/building';
import { fetchRoomDataService } from '@/services/rooms';
import AxiosInstance from '@/utils/axios';

const prepareServices = () => {
  const axios = AxiosInstance();

  return {
    getGeoGraphicContext: fetchGeoGraphicContextService({ axios }),
    getRoomData: fetchRoomDataService({ axios }),
  };
};

export default prepareServices;
