import { roomSchemaValidator } from "@/libs/validateModules";
import validator from '@/middlewares/validator';
import routes from "@/routes";
import errAxiosRes from "@/utils/serviceError";

export const fetchRoomDataService = ({ axios }) =>
  async (id) => {
    try {
      validator(roomSchemaValidator, { id })
      const {data} = await axios.get(routes.api.roomData(id));
      return { data };
    } catch (err) {
      return errAxiosRes(err);
    }
}