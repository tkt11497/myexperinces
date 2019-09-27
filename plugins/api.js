import Vue from "vue";
import api from "@/assets/utilities/api";

Vue.prototype.$api = api;

export default ({ app }) => {
  app.$api = api;
};
