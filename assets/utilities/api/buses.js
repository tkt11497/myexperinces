import setJwtHeaders from "./setJwtHeaders";

const BUSES_URL = process.env.baseUrl + "/buses";

export default {
  getBuses: (axios, jwt) => axios.$get(BUSES_URL, setJwtHeaders(jwt)),
  postBuses: that => {
    const { name } = that.bus;
    const payload = { name };
    return that.$axios.post(BUSES_URL, payload, setJwtHeaders(that.jwt));
  },
  putBuses: that => {
    const { name } = that.bus;
    const payload = { name };
    return that.$axios.put(
      `${BUSES_URL}/${that.bus.id}`,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  deleteBuses: that => {
    return that.$axios.delete(
      `${BUSES_URL}/${that.deletingId}`,
      setJwtHeaders(that.jwt)
    );
  }
};
