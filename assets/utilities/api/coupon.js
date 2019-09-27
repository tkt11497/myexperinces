import setJwtHeaders from "./setJwtHeaders";
import { BASE_API_URL } from "./constants";

const url = BASE_API_URL + "/check_coupon_code";

export default {
  checkValidCoupon: ({ coupon, axios, jwt }) =>
    axios.$get(url + "?coupon_code=" + coupon, setJwtHeaders(jwt))
};
