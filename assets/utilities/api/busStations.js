import setJwtHeaders from "./setJwtHeaders";

const BUS_STATIONS_URL = process.env.baseUrl + "/bus_stations";

export default {
  getBusStations: (axios, jwt) =>
    axios.$get(BUS_STATIONS_URL, setJwtHeaders(jwt)),
  postBusStations: that => {
    const { name, number_of_gates, delivery_rate } = that.bus_station;
    const city_id = that.bus_station.city;
    const zone_id = that.bus_station.zone;
    const payload = { name, number_of_gates, delivery_rate, city_id, zone_id };
    return that.$axios.post(BUS_STATIONS_URL, payload, setJwtHeaders(that.jwt));
  },
  putBusStations: that => {
    const { name, number_of_gates, delivery_rate } = that.bus_station;
    const city_id =
      typeof that.bus_station.city === "object"
        ? that.bus_station.city.id
        : that.bus_station.city;
    const zone_id =
      typeof that.bus_station.zone === "object"
        ? that.bus_station.zone.id
        : that.bus_station.zone;
    const payload = { name, number_of_gates, delivery_rate, city_id, zone_id };
    return that.$axios.put(
      `${BUS_STATIONS_URL}/${that.bus_station.id}`,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  deleteBusStations: that => {
    return that.$axios.delete(
      `${BUS_STATIONS_URL}/${that.deletingId}`,
      setJwtHeaders(that.jwt)
    );
  }
};
