import setJwtHeaders from "./setJwtHeaders";

const WAYBILL_URL = process.env.baseUrl + "/waybills";
const WAYBILL_VOUCHER_URL = process.env.baseUrl + "/way_bill_vouchers";
const WAYBILL_FINANCE_URL = process.env.baseUrl + "/waybill_finance_confirm";

export default {
  waybill_url: WAYBILL_VOUCHER_URL,
  getWaybillVouchers: (axios, jwt, URL) => {
    if (URL) {
      return axios.$get(`${URL}&paginate=25`, setJwtHeaders(jwt));
    } else {
      return axios.$get(WAYBILL_VOUCHER_URL, setJwtHeaders(jwt));
    }
  },
  getWaybills: (axios, jwt, date) =>
    axios.$get(WAYBILL_URL + `?date=${date}`, setJwtHeaders(jwt)),
  getWaybillById: (axios, jwt, id) =>
    axios.$get(WAYBILL_URL + `/${id}`, setJwtHeaders(jwt)),
  getWaybillDeliveryById: (axios, jwt, id) =>
    axios.$get(WAYBILL_URL + `/delivery/${id}`, setJwtHeaders(jwt)),
  getPickupsDeliveryById: (axios, jwt, id) =>
    axios.$get(WAYBILL_URL + `/delivery_pickups/${id}`, setJwtHeaders(jwt)),
  postWaybill: that => {
    const {
      senderStation,
      receiverStation,
      receiverGate,
      receiverCity,
      staff,
      user,
      note
    } = that;
    const vouchers_qty = that.vouchersData.length;

    const payload = {
      vouchers_qty,
      from_bus_station_id: senderStation,
      to_bus_station_id: receiverStation,
      gate_id: receiverGate,
      to_city_id: receiverCity,
      delivery_id: staff,
      staff_id: user.id,
      note: note,
      vouchers: that.vouchersData
    };
    return that.$axios.post(WAYBILL_URL, payload, setJwtHeaders(that.jwt));
  },
  putWaybill: that => {
    const voucher_id = that.vouchers.map(voucher => voucher.id);

    const payload = {
      actual_bus_fee: that.actual_bus_fee,
      voucher_id
    };
    return that.$axios.put(
      WAYBILL_URL + "/" + that.$route.params.id,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  agentConfirmWaybill: ({ $axios, jwt, payload, id }) => {
    return $axios.post(
      `${WAYBILL_URL}/${id}/agent_confirm`,
      payload,
      setJwtHeaders(jwt)
    );
  },
  confirmWaybillFinance: ({ axios, jwt, payload }) => {
    return axios.post(WAYBILL_FINANCE_URL, payload, setJwtHeaders(jwt));
  },
  removeWayBillVoucher: (that, voucherId) => {
    const payload = {
      vouchers: [
        {
          id: voucherId
        }
      ]
    };
    return that.$axios.post(
      `${WAYBILL_URL}/${that.id}/remove_vouchers`,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  addWayBillVoucher: (that, voucher) => {
    const payload = {
      vouchers: [
        {
          id: voucher.id,
          waybill_voucher_priority: voucher.waybill_voucher_priority
        }
      ]
    };
    return that.$axios.post(
      `${WAYBILL_URL}/${that.id}/add_vouchers`,
      payload,
      setJwtHeaders(that.jwt)
    );
  }
};
