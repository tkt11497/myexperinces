import setJwtHeaders from "./setJwtHeaders";

const CUSTOMERS_URL = process.env.baseUrl + "/customers";

export default {
  CUSTOMERS_URL,
  getCustomers: (axios, jwt, URL) => {
    if (URL) {
      return axios.$get(URL, setJwtHeaders(jwt));
    } else {
      return axios.$get(CUSTOMERS_URL, setJwtHeaders(jwt));
    }
  }
};
