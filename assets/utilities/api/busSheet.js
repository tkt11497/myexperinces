import setJwtHeaders from "./setJwtHeaders";

const BUS_SHEETS_URL = process.env.baseUrl + "/bus_sheets";
const BUS_SHEET_VOUCHERS_URL = process.env.baseUrl + "/bus_sheet_vouchers";
const BUS_SHEET_FINANCE_URL =
  process.env.baseUrl + "/bus_sheet_finance_confirm";

export default {
  bus_sheet_vouchers_url: BUS_SHEET_VOUCHERS_URL,
  getBusSheets: ({
      axios,
      jwt,
      date
    }) =>
    axios.get(`${BUS_SHEETS_URL}?date=${date}`, setJwtHeaders(jwt)),
  getBusSheetVouchers: ({
    axios,
    jwt,
    URL
  }) => {
    if (URL) {
      return axios.get(`${URL}&paginate=25`, setJwtHeaders(jwt))
    } else {
      return axios.get(
        BUS_SHEET_VOUCHERS_URL,
        setJwtHeaders(jwt)
      )
    }
  },
  postBusSheet: ({
      axios,
      jwt,
      payload
    }) =>
    axios.post(BUS_SHEETS_URL, payload, setJwtHeaders(jwt)),
  getBusSheet: ({
      axios,
      jwt,
      id
    }) =>
    axios.get(BUS_SHEETS_URL + "/" + id, setJwtHeaders(jwt)),
  putBusSheet: ({
      axios,
      jwt,
      id,
      payload
    }) =>
    axios.put(BUS_SHEETS_URL + "/" + id, payload, setJwtHeaders(jwt)),
  receivePaymentBusSheet: ({
      $axios,
      jwt,
      payload
    }) =>
    $axios.post(BUS_SHEET_FINANCE_URL, payload, setJwtHeaders(jwt)),
  removeBusSheetVoucher: (that, voucherId) => {
    const payload = {
      vouchers: [{
        id: voucherId
      }]
    };
    return that.$axios.post(`${BUS_SHEETS_URL}/${that.id}/remove_vouchers`, payload, setJwtHeaders(that.jwt));
  },
  addBusSheetVoucher: (that, voucher) => {
    const payload = {
      vouchers: [{
        id: voucher.id,
        bus_sheet_voucher_priority: voucher.bus_sheet_voucher_priority
      }]
    };
    return that.$axios.post(`${BUS_SHEETS_URL}/${that.id}/add_vouchers`, payload, setJwtHeaders(that.jwt));
  },
};