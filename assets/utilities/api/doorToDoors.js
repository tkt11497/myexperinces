import setJwtHeaders from "./setJwtHeaders";

const DOORTODOORS_URL = process.env.baseUrl + "/door_to_doors";

export default {
  DOORTODOORS_URL,
  getDoorToDoors: (axios, jwt, URL) => {
    if (URL) {
      return axios.$get(URL, setJwtHeaders(jwt));
    } else {
      return axios.$get(DOORTODOORS_URL, setJwtHeaders(jwt));
    }
  },
  postDoorToDoors: that => {
    const { base_rate, agent_base_rate, salt, agent_salt } = that.door_to_door;
    const route_id = that.door_to_door.route;
    const global_scale_id = that.door_to_door.global_scale;
    const payload = {
      route_id,
      global_scale_id,
      base_rate,
      agent_base_rate,
      salt,
      agent_salt
    };
    return that.$axios.post(DOORTODOORS_URL, payload, setJwtHeaders(that.jwt));
  },
  putDoorToDoors: that => {
    const { base_rate, agent_base_rate, salt, agent_salt } = that.door_to_door;
    const route_id =
      typeof that.door_to_door.route === "object"
        ? that.door_to_door.route.id
        : that.door_to_door.route;
    const global_scale_id =
      typeof that.door_to_door.global_scale === "object"
        ? that.door_to_door.global_scale.id
        : that.door_to_door.global_scale;
    const payload = {
      route_id,
      global_scale_id,
      base_rate,
      agent_base_rate,
      salt,
      agent_salt
    };
    return that.$axios.put(
      `${DOORTODOORS_URL}/${that.door_to_door.id}`,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  deleteDoorToDoors: that => {
    return that.$axios.delete(
      `${DOORTODOORS_URL}/${that.deletingId}`,
      setJwtHeaders(that.jwt)
    );
  }
};
