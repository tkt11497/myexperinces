import axios from "axios";
import setJwtHeaders from "./setJwtHeaders";
import { BASE_API_URL } from "./constants";
const return_url = BASE_API_URL + "/return_sheets";
export default {
    return_url,
    get_all_returnsheet: (axios, jwt) => {
      return axios.$get(return_url, setJwtHeaders(jwt));
    },
    get_all_returnsheet_bydate: (axios, jwt, date) => {
      return axios.$get(`${return_url}/?date=${date}`, setJwtHeaders(jwt));
    },
    get_returnsheet_detail:(axios,jwt,id)=>{
        return axios.$get(`${return_url}/${id}`,setJwtHeaders(jwt))
    }
  };