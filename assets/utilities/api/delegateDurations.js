import setJwtHeaders from "./setJwtHeaders";
import { BASE_API_URL } from "./constants";

const url = BASE_API_URL + "/delegate_durations";

export default {
  getDelegateDurations: (axios, jwt) => axios.$get(url, setJwtHeaders(jwt))
};
