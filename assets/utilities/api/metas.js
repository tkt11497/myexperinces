import setJwtHeaders from "./setJwtHeaders";
import { BASE_API_URL } from "./constants";

const url = BASE_API_URL + "/metas";

export default {
  getMetas: (axios, jwt) => axios.$get(url, setJwtHeaders(jwt))
};
