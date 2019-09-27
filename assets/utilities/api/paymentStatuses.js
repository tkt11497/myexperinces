import setJwtHeaders from "./setJwtHeaders";

const PAYMENT_STATUSES_URL = process.env.baseUrl + "/payment_statuses";

export default {
  PAYMENT_STATUSES_URL,
  getPaymentStatuses: (axios, jwt) =>
    axios.$get(PAYMENT_STATUSES_URL, setJwtHeaders(jwt)),
  postPaymentStatuses: that => {
    const { name, name_mm, description } = that.payment_status;
    const payload = { name, name_mm, description };
    return that.$axios.post(
      PAYMENT_STATUSES_URL,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  putPaymentStatuses: that => {
    const { name, name_mm, description } = that.payment_status;
    const payload = { name, name_mm, description };
    return that.$axios.put(
      `${PAYMENT_STATUSES_URL}/${that.payment_status.id}`,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  deletePaymentStatuses: that => {
    return that.$axios.delete(
      `${PAYMENT_STATUSES_URL}/${that.deletingId}`,
      setJwtHeaders(that.jwt)
    );
  }
};
