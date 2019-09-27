import setJwtHeaders from "./setJwtHeaders";

const MERCHANTSHEET_URL = process.env.baseUrl + "/merchant_sheets";

export default {
  getMerchantSheets: (axios, jwt, date) =>
    axios.$get(MERCHANTSHEET_URL + `?date=${date}`, setJwtHeaders(jwt)),
  getMerchantSheetById: (axios, jwt, id) =>
    axios.$get(MERCHANTSHEET_URL + `/${id}`, setJwtHeaders(jwt)),
  postMerchantSheet: that => {
    const payload = {
      merchant_id: that.merchant,
      qty: that.vouchersId.length,
      voucher_id: that.vouchersId
    };
    return that.$axios.post(
      MERCHANTSHEET_URL,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  // putMerchantSheet: (that, deliveryStatuses) => {
  //   const payload = {
  //     qty: that.deliSheet.qty,
  //     zone_id: that.deliSheet.zone.id,
  //     delivery_id: that.deliSheet.delivery.id,
  //     staff_id: that.deliSheet.staff.id,
  //     note: that.deliSheet.note || '',
  //     priority: that.deliSheet.priority,
  //     vouchers: deliveryStatuses
  //   };
  //   return that.$axios.put(
  //     MERCHANTSHEET_URL + "/" + that.deliSheet.id,
  //     payload,
  //     setJwtHeaders(that.jwt)
  //   );
  // },
  paidMerchantSheet: (that, vouchersId) => {
    const payload = {
      merchant_sheet_id: that.merchantSheet.id,
      vouchers_id: vouchersId
    };
    return that.$axios.post(
      process.env.baseUrl + "/merchant_sheet_finance_confirm",
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  deleteMerchantSheet: that => {
    return that.$axios.delete(
      MERCHANTSHEET_URL + "/" + that.cityDeleteId,
      setJwtHeaders(that.jwt)
    );
  },
  getVouchersDetailsByMerchantSheet: (axios, jwt, id) => {
    return axios.$get(
      process.env.baseUrl + `/voucher_details_by_merchant_sheet/${id}`,
      setJwtHeaders(jwt)
    );
  },
  removeMerchantSheetVoucher: (that, voucherId) => {
    const payload = {
      vouchers: [
        {
          id: voucherId
        }
      ]
    };
    return that.$axios.post(
      `${MERCHANTSHEET_URL}/${that.merchantSheet.id}/remove_vouchers`,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  addMerchantSheetVoucher: (that, voucher) => {
    const payload = {
      vouchers: [
        {
          id: voucher.id
        }
      ]
    };
    return that.$axios.post(
      `${MERCHANTSHEET_URL}/${that.merchantSheet.id}/add_vouchers`,
      payload,
      setJwtHeaders(that.jwt)
    );
  }
};
