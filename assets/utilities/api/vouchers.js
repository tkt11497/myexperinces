import axios from "axios";
import setJwtHeaders from "./setJwtHeaders";
import { BASE_API_URL } from "./constants";

const url = BASE_API_URL + "/vouchers";
const VOUCHER_URL = url;
const deli_sheet_url = BASE_API_URL + "/deli_sheet_vouchers";
const merchant_sheet_url = BASE_API_URL + "/merchant_sheet_vouchers";
const return_sheet_url = BASE_API_URL + "/return_sheet_vouchers";

export default {
  VOUCHER_URL,
  deli_sheet_url,
  delVoucher: ({ axios, jwt, id }) => {
    return axios.delete(url + "/" + id, setJwtHeaders(jwt));
  },
  getVouchersDetails: (axios, jwt, id) => {
    return axios.$get(`${url}/${id}`, setJwtHeaders(jwt));
  },
  getDeliSheetVouchers: (axios, jwt, URL) => {
    if (URL) {
      return axios.$get(`${URL}&paginate=25`, setJwtHeaders(jwt));
    } else {
      return axios.$get(deli_sheet_url, setJwtHeaders(jwt));
    }
  },
  getMerchantSheetVouchers: (axios, jwt, merchant_id) =>
    axios.$get(
      merchant_sheet_url + `?merchant_id=${merchant_id}`,
      setJwtHeaders(jwt)
    ),
  getReturnSheetVouchers: (axios, jwt, merchant_id) =>
    axios.$get(
      return_sheet_url + `?merchant_id=${merchant_id}`,
      setJwtHeaders(jwt)
    ),
  getVouchers: (axios, jwt, URL) => {
    if (URL) {
      return axios.$get(`${URL}&paginate=25`, setJwtHeaders(jwt));
    } else {
      return axios.$get(url, setJwtHeaders(jwt));
    }
  },
  createUpdateVoucher: (that, { payload }) => {
    if (payload.id) {
      return that.$axios.put(
        `${url}/${payload.id}`,
        {
          ...payload
        },
        setJwtHeaders(that.jwt)
      );
    } else {
      return that.$axios.post(
        url,
        {
          ...payload
        },
        setJwtHeaders(that.jwt)
      );
    }
  },
  createUpdateVoucherDetails: (that, { payload, id }) => {
    if (id) {
      return that.$axios.put(
        `${url}/${id}`,
        {
          ...payload
        },
        setJwtHeaders(that.jwt)
      );
    } else {
      return that.$axios.post(
        `${url}`,
        {
          ...payload
        },
        setJwtHeaders(that.jwt)
      );
    }
  },
  closeVoucher: async ({ id, jwt }) => {
    return (await axios.post(`${url}/${id}/closed`, {}, setJwtHeaders(jwt)))
      .data;
  },
  showImage: async ({ id, jwt }) => {
    return (await axios.post(
      `${url}/attachments/${id}/show_merchant`,
      {},
      setJwtHeaders(jwt)
    )).data;
  },
  HideImage: async ({ id, jwt }) => {
    return (await axios.post(
      `${url}/attachments/${id}/unshow_merchant`,
      {},
      setJwtHeaders(jwt)
    )).data;
  },
  returnVoucher: async ({ id, jwt }) => {
    return (await axios.post(`${url}/${id}/return`, {}, setJwtHeaders(jwt)))
      .data;
  },
  updateVoucherStatus: async ({ $axios, jwt, payload, id }) => {
    return (await $axios.post(
      `${url}/${id}/update_status`,
      payload,
      setJwtHeaders(jwt)
    )).data;
  },
  updateWaybillVoucherStatus: async ({ $axios, jwt, payload, id }) => {
    return (await $axios.post(
      `${url}/${id}/update_waybill_voucher`,
      payload,
      setJwtHeaders(jwt)
    )).data;
  },
  deleteVouchers: that => {
    return that.$axios.delete(
      `${VOUCHER_URL}/${that.deletingId}`,
      setJwtHeaders(that.jwt)
    );
  },
  importVouchers: async ({ $axios, jwt, vouchers }) => {
    return (await $axios.post(
      `${BASE_API_URL}/import_vouchers`,
      { vouchers },
      setJwtHeaders(jwt)
    )).data;
  }
};
