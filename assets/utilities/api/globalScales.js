import setJwtHeaders from "./setJwtHeaders";

const GLOBALSCALES_URL = process.env.baseUrl + "/global_scales";

export default {
  getGlobalScales: (axios, jwt) =>
    axios.$get(GLOBALSCALES_URL, setJwtHeaders(jwt)),
  postGlobalScales: that => {
    const {
      cbm,
      support_weight,
      max_weight,
      description,
      description_mm
    } = that.global_scale;
    const payload = {
      cbm,
      support_weight,
      max_weight,
      description,
      description_mm
    };
    return that.$axios.post(GLOBALSCALES_URL, payload, setJwtHeaders(that.jwt));
  },
  putGlobalScales: that => {
    const {
      cbm,
      support_weight,
      max_weight,
      description,
      description_mm
    } = that.global_scale;
    const payload = {
      cbm,
      support_weight,
      max_weight,
      description,
      description_mm
    };
    return that.$axios.put(
      `${GLOBALSCALES_URL}/${that.global_scale.id}`,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  deleteGlobalScales: that => {
    return that.$axios.delete(
      `${GLOBALSCALES_URL}/${that.deletingId}`,
      setJwtHeaders(that.jwt)
    );
  }
};
