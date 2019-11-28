import axios from "axios";
import setJwtHeaders from "./setJwtHeaders";
import { BASE_API_URL } from "./constants";

const voucher_url = BASE_API_URL + "/vouchers";
export default {
  voucher_url,
  getallvoucher: (axios, jwt) => {
    return axios.$get(voucher_url, setJwtHeaders(jwt));
  },
  getvoucherbydate: (axios, jwt, date) => {
    return axios.$get(`${voucher_url}/?date=${date}`, setJwtHeaders(jwt));
  }
};
