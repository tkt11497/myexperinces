import setJwtHeaders from "./setJwtHeaders";
import { BASE_API_URL } from "./constants";

const url = BASE_API_URL + "/delivery_statuses";

export default {
  getDeliveryStatuses: (axios, jwt) => axios.$get(url, setJwtHeaders(jwt)),
  postDeliveryStatuses: that => {
    return that.$axios.post(url, { ...that.form }, setJwtHeaders(that.jwt));
  },
  putDeliveryStatuses: that => {
    return that.$axios.put(
      url + `/${that.editingId}`,
      { ...that.form },
      setJwtHeaders(that.jwt)
    );
  },
  deleteDeliveryStatuses: that =>
    that.$axios.delete(`${url}/${that.deletingId}`, setJwtHeaders(that.jwt))
};
