import axios from "axios";
import setJwtHeaders from "./setJwtHeaders";
import { BASE_API_URL } from "./constants";
const merchantsheet_url = BASE_API_URL + "/merchant_sheets";
export default {
  merchantsheet_url,
  get_all_merchantsheets: (axios, jwt) => {
    return axios.$get(merchantsheet_url, setJwtHeaders(jwt));
  },
  get_merchantsheet_bydate: (axios, jwt, date) => {
    return axios.$get(`${merchantsheet_url}/?date=${date}`, setJwtHeaders(jwt));
  },
  get_merchantsheet_detail: (axios, jwt, id) => {
    return axios.$get(`${merchantsheet_url}/${id}`, setJwtHeaders(jwt));
  }
};
