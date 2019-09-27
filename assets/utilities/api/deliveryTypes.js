import setJwtHeaders from "./setJwtHeaders";
import { BASE_API_URL } from "./constants";

const DELIVERY_TYPES_URL = BASE_API_URL + "/courier_types";

export default {
  getDeliveryTypes: (axios, jwt) =>
    axios.$get(DELIVERY_TYPES_URL, setJwtHeaders(jwt)),
  postDeliveryTypes: that => {
    const { name, cbm, weight, rate } = that.form;
    const payload = { name, rate, cbm, weight };
    return that.$axios.post(
      DELIVERY_TYPES_URL,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  putDeliveryTypes: that => {
    const { name, cbm, weight, rate } = that.form;
    const payload = { name, rate, cbm, weight };
    return that.$axios.put(
      DELIVERY_TYPES_URL + `/${that.editingId}`,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  deleteDeliveryTypes: that =>
    that.$axios.delete(
      `${DELIVERY_TYPES_URL}/${that.deletingId}`,
      setJwtHeaders(that.jwt)
    )
};
