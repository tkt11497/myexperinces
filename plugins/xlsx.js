import Vue from "vue";
import XLSX from "xlsx";

Vue.prototype.$XLSX = XLSX;

export default ({ app }) => {
  app.$XLSX = XLSX;
};
