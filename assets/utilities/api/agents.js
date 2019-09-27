import setJwtHeaders from "./setJwtHeaders";

const AGENTS_URL = process.env.baseUrl + "/agents";

export default {
  AGENTS_URL,
  getAgents: (axios, jwt) => axios.$get(AGENTS_URL, setJwtHeaders(jwt)),
  postAgents: that => {
    const { name, username, password } = that.agent;
    const city_id = that.agent.city;
    const payload = {
      name,
      username,
      password,
      city_id
    };
    return that.$axios.post(AGENTS_URL, payload, setJwtHeaders(that.jwt));
  },
  putAgents: that => {
    const { name, username, password } = that.agent;
    const city_id =
      typeof that.agent.city === "object"
        ? that.agent.city.id
        : that.agent.city;
    const payload = {
      name,
      username,
      password,
      city_id
    };
    return that.$axios.put(
      `${AGENTS_URL}/${that.agent.id}`,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  deleteAgents: that => {
    return that.$axios.delete(
      `${AGENTS_URL}/${that.deletingId}`,
      setJwtHeaders(that.jwt)
    );
  }
};
