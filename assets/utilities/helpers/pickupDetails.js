import localforage from "localforage";
import _ from "lodash";

const getCurrentCityId = async () => {
  const meta = await localforage.getItem("stored:metas");
  return parseInt(meta.find(m => m.key === "city").value, 10);
};

const getStations = async () => {
  return await localforage.getItem("stored:busStations");
};

const cleanForms = ({
  mappedForms,
  cities,
  stations
}) => {
  const normalForms = mappedForms.filter(form => !form.isBusStation);
  const stationForms = mappedForms.filter(form => form.isBusStation);

  normalForms.forEach(form => {
    form.receiverZones = cities.find(
      city => city.id === form.receiver_city.id
    ).zones;
  });

  stationForms.forEach(form => {
    form.senderStations = stations.filter(
      station => station.city.id === form.sender_city.id
    );
    form.receiverStations = stations.filter(
      station => station.city.id === form.receiver_city.id
    );
    form.sender_bus_station = typeof form.sender_bus_station === "object" ?
      form.sender_bus_station :
      form.senderStations.find(station => station.name == form.sender_bus_station);
    form.receiver_bus_station = typeof form.receiver_bus_station === "object" ?
      form.receiver_bus_station :
      form.receiverStations.find(station => station.name == form.receiver_bus_station);
    const senderGates = stations.find(station => station.id === form.sender_bus_station.id).gates;
    const receiverGates = stations.find(station => station.id === form.receiver_bus_station.id).gates;
    form.sender_gate = typeof form.sender_gate === "object" ? form.sender_gate : senderGates.find(gate => gate.name == form.sender_gate);
    form.intersectionGates = _.intersectionBy(
      senderGates,
      receiverGates,
      "bus.id"
    );
  });

  return {
    normalForms,
    stationForms
  };
};

const readLocalforage = async () => {
  return await Promise.all([
    localforage.getItem("stored:staffs"), // 0
    localforage.getItem("stored:cities"), // 1
    localforage.getItem("stored:zones"), // 2
    localforage.getItem("stored:deliveryStatuses"), // 3
    localforage.getItem("stored:paymentTypes"), // 4
    localforage.getItem("stored:busStations"), // 5
    localforage.getItem("stored:gates"), // 6
    localforage.getItem("stored:callStatuses"), //7
    localforage.getItem("stored:logStatuses") // 8
  ]);
};

const parseStoreRecords = storedRecords => {
  return {
    staffs: storedRecords[0],
    cities: storedRecords[1],
    zones: storedRecords[2],
    deliveryStatuses: storedRecords[3],
    paymentTypes: storedRecords[4],
    busStations: storedRecords[5],
    gates: storedRecords[6],
    callStatuses: storedRecords[7],
    logStatuses: storedRecords[8]
  };
};

const getStoreRecords = async () => {
  const storedRecords = await readLocalforage();
  return parseStoreRecords(storedRecords);
};

const getCallStatusesValues = callStatuses => callStatuses.map(s => s.status);

const getStationPaymentTypes = ({
  paymentTypes,
  isCustomer
}) => {
  if (isCustomer) {
    return [paymentTypes[7], paymentTypes[6]];
  } else {
    return [paymentTypes[4], paymentTypes[5], paymentTypes[6], paymentTypes[7]];
  }
};

const getNormalPaymentTypes = ({
  paymentTypes,
  isCustomer
}) => {
  if (isCustomer) {
    return [paymentTypes[8]];
  } else {
    return [
      paymentTypes[0],
      paymentTypes[1],
      paymentTypes[2],
      paymentTypes[3],
      paymentTypes[8],
      paymentTypes[9]
    ];
  }
};

const getMappedForms = ({
  vouchers
}) => {
  return vouchers.map(voucher => {
    const isBusStation = !!voucher.bus_station;
    return {
      ...voucher,
      isLocked: true,
      isBusStation
    };
  });
};

const getCity = data => {
  try {
    if (data.sender_type === "Merchant") {
      return data.sender_associate.city;
    }
    return data.sender.city;
  } catch (e) {
    return {
      name: ""
    };
  }
};

const getPhones = data => {
  if (data.sender_type === "Merchant") {
    return data.sender_associate.phones.join(", ");
  }
  return data.sender.phone;
};

const getClassifiedStations = async () => {
  const stations = await getStations();
  const currentCityId = await getCurrentCityId();
  const senderStations = stations.filter(
    station => station.city.id === currentCityId
  );
  const receiverStations = stations.filter(
    station => station.city.id !== currentCityId
  );
  const receiverStationsNames = receiverStations.map(s => s.name);
  const senderStationsNames = senderStations.map(s => s.name);
  return {
    senderStations,
    receiverStations,
    receiverStationsNames,
    senderStationsNames
  };
};

const getAddress = data => {
  if (data.sender_type === "Merchant") {
    return data.sender_associate.address;
  }
  return data.sender.address;
};

const getZone = data => {
  let returnValue = {
    name: ""
  };
  try {
    if (data.sender_type === "Merchant") {
      returnValue = data.sender_associate.zone;
    } else returnValue = data.sender.zone;
  } catch (e) {
    return {
      name: ""
    };
  }
  if (!returnValue) return {
    name: ""
  };
  return returnValue;
};

export default {
  getCurrentCityId,
  getStations,
  cleanForms,
  getCallStatusesValues,
  getStationPaymentTypes,
  getNormalPaymentTypes,
  getCity,
  getClassifiedStations,
  getMappedForms,
  getPhones,
  getAddress,
  getZone,
  getStoreRecords
};