import setJwtHeaders from "./setJwtHeaders";
import { BASE_API_URL } from "./constants";

const CITIES_URL = BASE_API_URL + "/cities";

export default {
  getCities: (axios, jwt) => axios.$get(CITIES_URL, setJwtHeaders(jwt)),
  getCitiesById: (axios, jwt, id) =>
    axios.$get(CITIES_URL + `/${id}`, setJwtHeaders(jwt)),
  postCities: that => {
    const payload = {
      name: that.cityEdit.name,
      is_collect_only: that.cityEdit.is_collect_only,
      is_on_demand: that.cityEdit.is_on_demand,
      is_available_d2d: that.cityEdit.is_available_d2d
    };
    return that.$axios.post(CITIES_URL, payload, setJwtHeaders(that.jwt));
  },
  putCities: that => {
    const payload = {
      name: that.cityEdit.name,
      is_collect_only: that.cityEdit.is_collect_only,
      is_on_demand: that.cityEdit.is_on_demand,
      is_available_d2d: that.cityEdit.is_available_d2d
    };
    return that.$axios.put(
      CITIES_URL + "/" + that.cityEdit.id,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  deleteCities: that => {
    return that.$axios.delete(
      CITIES_URL + "/" + that.cityDeleteId,
      setJwtHeaders(that.jwt)
    );
  }
};
