import { BASE_API_URL } from "./constants";
const AUTH_LOGIN_URL = BASE_API_URL + "/auth/login";

export default {
  postLogin: (axios, jwt, payload) => axios.$post(AUTH_LOGIN_URL, payload)
};
