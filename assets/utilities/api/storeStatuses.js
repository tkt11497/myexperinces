import setJwtHeaders from "./setJwtHeaders";
import { BASE_API_URL } from "./constants";

const url = BASE_API_URL + "/store_statuses";

export default {
  getStoreStatuses: (axios, jwt) => axios.$get(url, setJwtHeaders(jwt)),
  postStoreStatuses: that => {
    return that.$axios.post(url, { ...that.form }, setJwtHeaders(that.jwt));
  },
  putStoreStatuses: that => {
    return that.$axios.put(
      url + `/${that.editingId}`,
      { ...that.form },
      setJwtHeaders(that.jwt)
    );
  },
  deleteStoreStatuses: that =>
    that.$axios.delete(`${url}/${that.deletingId}`, setJwtHeaders(that.jwt))
};
