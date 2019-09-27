import setJwtHeaders from "./setJwtHeaders";

const BUSDROPOFFS_URL = process.env.baseUrl + "/bus_drop_offs";

export default {
  BUSDROPOFFS_URL,
  getBusDropOffs: (axios, jwt) =>
    axios.$get(BUSDROPOFFS_URL, setJwtHeaders(jwt)),
  postBusDropOffs: that => {
    const { base_rate, agent_base_rate, salt } = that.bus_drop_off;
    const route_id = that.bus_drop_off.route;
    const gate_id = that.bus_drop_off.gate;
    const global_scale_id = that.bus_drop_off.global_scale;
    const payload = {
      route_id,
      gate_id,
      global_scale_id,
      base_rate,
      agent_base_rate,
      salt
    };
    return that.$axios.post(BUSDROPOFFS_URL, payload, setJwtHeaders(that.jwt));
  },
  putBusDropOffs: that => {
    const { base_rate, agent_base_rate, salt } = that.bus_drop_off;
    const route_id =
      typeof that.bus_drop_off.route === "object"
        ? that.bus_drop_off.route.id
        : that.bus_drop_off.route;
    const gate_id =
      typeof that.bus_drop_off.gate === "object"
        ? that.bus_drop_off.gate.id
        : that.bus_drop_off.gate;
    const global_scale_id =
      typeof that.bus_drop_off.global_scale === "object"
        ? that.bus_drop_off.global_scale.id
        : that.bus_drop_off.global_scale;
    const payload = {
      route_id,
      gate_id,
      global_scale_id,
      base_rate,
      agent_base_rate,
      salt
    };
    return that.$axios.put(
      `${BUSDROPOFFS_URL}/${that.bus_drop_off.id}`,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  deleteBusDropOffs: that => {
    return that.$axios.delete(
      `${BUSDROPOFFS_URL}/${that.deletingId}`,
      setJwtHeaders(that.jwt)
    );
  }
};
