import setJwtHeaders from "./setJwtHeaders";

const DASHBOARD_URL = process.env.baseUrl + "/dashboard";

export default {
  getDashboard: (axios, jwt, date) => 
    axios.$get(`${DASHBOARD_URL}/?date=${date}`, setJwtHeaders(jwt))
};
