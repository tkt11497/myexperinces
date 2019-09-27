import setJwtHeaders from "./setJwtHeaders";

// const GATES_URL = process.env.baseUrl + "/gates?page=1";
const GATES_URL = process.env.baseUrl + "/gates";

export default {
  GATES_URL,
  getGates: (axios, jwt, URL) => {
    if (URL) {
      return axios.$get(URL, setJwtHeaders(jwt));
    } else {
      return axios.$get(GATES_URL, setJwtHeaders(jwt));
    }
  },
  postGates: that => {
    const {
      gate_debit
    } = that.gate;
    const bus_station_id = that.gate.bus_station;
    const bus_id = that.gate.bus.id;
    const name = that.gate.bus.name;
    const payload = {
      name,
      gate_debit,
      bus_station_id,
      bus_id
    };
    return that.$axios.post(GATES_URL, payload, setJwtHeaders(that.jwt));
  },
  putGates: that => {
    const {
      gate_debit
    } = that.gate;
    const bus_station_id =
      typeof that.gate.bus_station === "object" ?
      that.gate.bus_station.id :
      that.gate.bus_station;
    const bus_id = that.gate.bus.id;
    const name = that.gate.bus.name;
    const payload = {
      name,
      gate_debit,
      bus_station_id,
      bus_id
    };
    return that.$axios.put(
      `${GATES_URL}/${that.gate.id}`,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  deleteGates: that => {
    return that.$axios.delete(
      `${GATES_URL}/${that.deletingId}`,
      setJwtHeaders(that.jwt)
    );
  }
};