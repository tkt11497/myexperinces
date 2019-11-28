import setJwtHeaders from "./setJwtHeaders";

const DASHBOARD_URL = process.env.baseUrl + "/dashboard";

export default {
  getDashboard_bydate: (axios, jwt, date) => 
    axios.$get(`${DASHBOARD_URL}/?date=${date}`, setJwtHeaders(jwt)),
  getDashboard:(axios,jwt)=>axios.$get(`${DASHBOARD_URL}`, setJwtHeaders(jwt))
};
