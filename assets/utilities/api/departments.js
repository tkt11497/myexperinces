import setJwtHeaders from "./setJwtHeaders";
import { BASE_API_URL } from "./constants";

const url = BASE_API_URL + "/departments";

export default {
  getDepartments: (axios, jwt) => axios.$get(url, setJwtHeaders(jwt)),
  postDepartments: that => {
    return that.$axios.post(url, { ...that.form }, setJwtHeaders(that.jwt));
  },
  putDepartments: that => {
    return that.$axios.put(
      url + `/${that.editingId}`,
      { ...that.form },
      setJwtHeaders(that.jwt)
    );
  },
  deleteDepartments: that =>
    that.$axios.delete(`${url}/${that.deletingId}`, setJwtHeaders(that.jwt))
};
