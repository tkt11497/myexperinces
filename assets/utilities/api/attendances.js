import setJwtHeaders from "./setJwtHeaders";
import {
  BASE_API_URL
} from "./constants";

export default {
  generateAttendanceCode: (axios, jwt) =>
    axios.$post(`${BASE_API_URL}/generate_attendance_code`, {}, setJwtHeaders(jwt))
};