import setJwtHeaders from "./setJwtHeaders";

const RETURNSHEET_URL = process.env.baseUrl + "/return_sheets";

export default {
  getReturnSheets: (axios, jwt, date) =>
    axios.$get(RETURNSHEET_URL + `?date=${date}`, setJwtHeaders(jwt)),
  getReturnSheetById: (axios, jwt, id) =>
    axios.$get(RETURNSHEET_URL + `/${id}`, setJwtHeaders(jwt)),
  postReturnSheet: that => {
    const payload = {
      merchant_id: that.merchant,
      delivery_id: that.staff,
      qty: that.vouchersData.length,
      vouchers: that.vouchersData
    };
    return that.$axios.post(RETURNSHEET_URL, payload, setJwtHeaders(that.jwt));
  },
  deleteReturnSheet: that => {
    return that.$axios.delete(
      RETURNSHEET_URL + "/" + that.cityDeleteId,
      setJwtHeaders(that.jwt)
    );
  },
  removeReturnSheetVoucher: (that, voucherId) => {
    const payload = {
      vouchers: [
        {
          id: voucherId
        }
      ]
    };
    return that.$axios.post(
      `${RETURNSHEET_URL}/${that.returnSheet.id}/remove_vouchers`,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  addReturnSheetVoucher: (that, voucher) => {
    const payload = {
      vouchers: [
        {
          id: voucher.id,
          return_sheet_voucher_priority: voucher.return_sheet_voucher_priority,
          return_sheet_voucher_note: voucher.return_sheet_voucher_note,
          return_status: voucher.return_status
        }
      ]
    };
    return that.$axios.post(
      `${RETURNSHEET_URL}/${that.returnSheet.id}/add_vouchers`,
      payload,
      setJwtHeaders(that.jwt)
    );
  }
};
