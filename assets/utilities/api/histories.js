import setJwtHeaders from "./setJwtHeaders";
import { BASE_API_URL } from "./constants";

export const url = BASE_API_URL + "/histories";

export default {
  getVoucherHistories: ({ axios, jwt, id }) => {
    return axios.$get(url + "/vouchers/" + id, setJwtHeaders(jwt));
  },

  getPickupDetailsHistories: ({ axios, jwt, id }) => {
    return axios.$get(url + "/pickups/" + id, setJwtHeaders(jwt));
  }
};
