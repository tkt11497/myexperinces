import localforage from "localforage";

const getEssentialInfo = async () => {
  const records = await Promise.all([
    localforage.getItem("stored:busStations"),
    localforage.getItem("stored:gates"),
    localforage.getItem("stored:cities")
  ]);
  const stations = records[0];
  const gates = records[1];
  const cities = records[2];
  return { stations, gates, cities };
};

const mapInfo = ({ essentialInfo, waybills }) => {
  const { stations, gates, cities } = essentialInfo;
  waybills.forEach(waybill => {
    waybill.senderStation = gates.find(
      ({ id }) => id === waybill.from_bus_station_id
    );
    waybill.receiverStation = stations.find(
      ({ id }) => id === waybill.to_bus_station_id
    );
    waybill.receiverGate = gates.find(({ id }) => id === waybill.gate_id);
    waybill.receiverCity = cities.find(({ id }) => id === waybill.city_id);
  });
  return waybills;
};

const getResult = async waybills => {
  const essentialInfo = await getEssentialInfo();
  const results = mapInfo({ essentialInfo, waybills });
  return results;
};

export default { getResult };
