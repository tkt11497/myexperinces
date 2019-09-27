import setJwtHeaders from "./setJwtHeaders";
import { BASE_API_URL } from "./constants";

const ZONE_URL = BASE_API_URL + "/zones";

export default {
  getZones: (axios, jwt) => axios.$get(ZONE_URL, setJwtHeaders(jwt)),
  postZones: (that, foundCity) => {
    const {
      zoneName,
      zoneNameMM,
      zone_rate,
      zone_agent_rate,
      is_deliver,
      note
    } = that.form;
    const payload = {
      name: zoneName,
      name_mm: zoneNameMM,
      zone_rate: zone_rate,
      zone_agent_rate: zone_agent_rate,
      city_id: foundCity.id,
      is_deliver,
      note
    };
    return that.$axios.post(ZONE_URL, payload, setJwtHeaders(that.jwt));
  },
  putZones: (that, foundCity) => {
    const {
      zoneName,
      zoneNameMM,
      zone_rate,
      zone_agent_rate,
      is_deliver,
      note
    } = that.form;
    const payload = {
      name: zoneName,
      name_mm: zoneNameMM,
      zone_rate: zone_rate,
      zone_agent_rate: zone_agent_rate,
      city_id: foundCity.id,
      is_deliver,
      note
    };
    return that.$axios.put(
      ZONE_URL + `/${that.editingZoneId}`,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  deleteZones: that =>
    that.$axios.delete(
      `${ZONE_URL}/${that.deletingId}`,
      setJwtHeaders(that.jwt)
    )
};
