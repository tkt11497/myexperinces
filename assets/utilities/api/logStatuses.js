import setJwtHeaders from "./setJwtHeaders";
import { BASE_API_URL } from "./constants";

export const url = BASE_API_URL + "/log_statuses";

export default {
  getLogStatuses: (axios, jwt) => {
    return axios.$get(url, setJwtHeaders(jwt));
  }
};
