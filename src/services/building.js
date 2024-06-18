import routes from "@/routes";
import errAxiosRes from "@/utils/serviceError";

export const fetchGeoGraphicContextService = ({ axios }) =>
  async () => {
    try {
      const { data } = await axios.get(routes.api.geoGraphicContext());

      return { data };
    } catch (err) {
      return errAxiosRes(err);
    }
}