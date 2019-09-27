import setJwtHeaders from "./setJwtHeaders";
import { BASE_API_URL } from "./constants";

const PAYMENT_TYPES_URL = BASE_API_URL + "/payment_types";

export default {
  getPaymentTypes: (axios, jwt) =>
    axios.$get(PAYMENT_TYPES_URL, setJwtHeaders(jwt))
};
