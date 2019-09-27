import setJwtHeaders from "./setJwtHeaders";

const TRACKING_STATUSES_URL = process.env.baseUrl + "/tracking_statuses";

export default {
  TRACKING_STATUSES_URL,
  getTrackingStatuses: (axios, jwt) =>
    axios.$get(TRACKING_STATUSES_URL, setJwtHeaders(jwt)),
  postTrackingStatuses: that => {
    const { status, status_mm } = that.tracking_status;
    const payload = { status, status_mm };
    return that.$axios.post(
      TRACKING_STATUSES_URL,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  putTrackingStatuses: that => {
    const { status, status_mm } = that.tracking_status;
    const payload = { status, status_mm };
    return that.$axios.put(
      `${TRACKING_STATUSES_URL}/${that.tracking_status.id}`,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  deleteTrackingStatuses: that => {
    return that.$axios.delete(
      `${TRACKING_STATUSES_URL}/${that.deletingId}`,
      setJwtHeaders(that.jwt)
    );
  }
};
