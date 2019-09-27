import setJwtHeaders from "./setJwtHeaders";

const ROUTES_URL = process.env.baseUrl + "/routes";

export default {
  ROUTES_URL,
  getRoutes: (axios, jwt, URL) => {
    if (URL) {
      return axios.$get(URL, setJwtHeaders(jwt));
    } else {
      return axios.$get(ROUTES_URL, setJwtHeaders(jwt));
    }
  },
  postRoutes: that => {
    const { travel_day } = that.route;
    const origin_id = that.route.origin_city;
    const destination_id = that.route.destination_city;
    const payload = { travel_day, origin_id, destination_id };
    return that.$axios.post(ROUTES_URL, payload, setJwtHeaders(that.jwt));
  },
  putRoutes: that => {
    const { travel_day } = that.route;
    const origin_id =
      typeof that.route.origin_city === "object"
        ? that.route.origin_city.id
        : that.route.origin_city;
    const destination_id =
      typeof that.route.destination_city === "object"
        ? that.route.destination_city.id
        : that.route.destination_city;
    const payload = { travel_day, origin_id, destination_id };
    return that.$axios.put(
      `${ROUTES_URL}/${that.route.id}`,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  deleteRoutes: that => {
    return that.$axios.delete(
      `${ROUTES_URL}/${that.deletingId}`,
      setJwtHeaders(that.jwt)
    );
  }
};
