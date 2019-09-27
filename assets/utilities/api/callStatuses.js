import setJwtHeaders from "./setJwtHeaders";
import { BASE_API_URL } from "./constants";

const url = BASE_API_URL + "/call_statuses";

export default {
  getCallStatuses: (axios, jwt) => axios.$get(url, setJwtHeaders(jwt)),
  postCallStatuses: that => {
    return that.$axios.post(url, { ...that.form }, setJwtHeaders(that.jwt));
  },
  putCallStatuses: that => {
    return that.$axios.put(
      url + `/${that.editingId}`,
      { ...that.form },
      setJwtHeaders(that.jwt)
    );
  },
  deleteCallStatuses: that =>
    that.$axios.delete(`${url}/${that.deletingId}`, setJwtHeaders(that.jwt))
};
