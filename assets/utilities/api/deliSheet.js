import setJwtHeaders from "./setJwtHeaders";

const DELISHEET_URL = process.env.baseUrl + "/deli_sheets";

export default {
  getDeliSheets: (axios, jwt, date) =>
    axios.$get(DELISHEET_URL + `?date=${date}`, setJwtHeaders(jwt)),
  getDeliSheetById: (axios, jwt, id) =>
    axios.$get(DELISHEET_URL + `/${id}`, setJwtHeaders(jwt)),
  getDeliSheetByDeliveryId: (axios, jwt, id) =>
    axios.$get(DELISHEET_URL + `/delivery/${id}`, setJwtHeaders(jwt)),
  getDeliveryPickups: (axios, jwt, date) =>
    axios.$get(
      DELISHEET_URL + `/delivery_pickups?date=${date}`,
      setJwtHeaders(jwt)
    ),
  postDeliSheet: that => {
    const payload = {
      qty: that.vouchersData.length,
      zone_id: that.staff.zone.id,
      delivery_id: that.staff.id,
      staff_id: that.user.id,
      vouchers: that.vouchersData,
      note: that.note
    };
    return that.$axios.post(DELISHEET_URL, payload, setJwtHeaders(that.jwt));
  },
  putDeliSheet: (that, deliveryStatuses) => {
    const payload = {
      qty: that.deliSheet.qty,
      zone_id: that.deliSheet.zone.id,
      delivery_id: that.deliSheet.delivery.id,
      staff_id: that.deliSheet.staff.id,
      vouchers: deliveryStatuses
    };
    return that.$axios.put(
      DELISHEET_URL + "/" + that.deliSheet.id,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  paidDeliSheet: (that, vouchersId) => {
    const payload = {
      delisheet_id: that.deliSheet.id,
      vouchers_id: vouchersId
    };
    return that.$axios.post(
      process.env.baseUrl + "/delisheet_finance_confirm",
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  paidPickup: (that, vouchersId) => {
    const payload = {
      pickup_id: that.pickup.id,
      prepaid_vouchers_id: vouchersId
    };
    return that.$axios.post(
      process.env.baseUrl + "/pickup_finance_confirm",
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  deleteDeliSheet: that => {
    return that.$axios.delete(
      DELISHEET_URL + "/" + that.cityDeleteId,
      setJwtHeaders(that.jwt)
    );
  },
  removeVoucher: (that, voucherId) => {
    const payload = {
      vouchers: [
        {
          id: voucherId
        }
      ]
    };
    return that.$axios.post(
      `${DELISHEET_URL}/${that.deliSheet.id}/remove_vouchers`,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  addVoucher: (that, voucher) => {
    const payload = {
      vouchers: [
        {
          id: voucher.id,
          deli_sheet_voucher_priority: voucher.deli_sheet_voucher_priority
        }
      ]
    };
    return that.$axios.post(
      `${DELISHEET_URL}/${that.deliSheet.id}/add_vouchers`,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  changeDelivery: that => {
    const payload = {
      deli_sheet_id: that.deliSheet.id,
      delivery_id: that.deliSheet.delivery.id
    };
    return that.$axios.post(
      `${DELISHEET_URL}/change_delivery`,
      payload,
      setJwtHeaders(that.jwt)
    );
  }
};
