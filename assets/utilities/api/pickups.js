import setJwtHeaders from "./setJwtHeaders";
import { BASE_API_URL } from "./constants";

const url = BASE_API_URL + "/pickups";

const buildPayload = (pickupForm, that) => {
  let payload;
  const {
    branchId,
    merchantId,
    note,
    openedById,
    status,
    sender,
    phone,
    address,
    customer_id,
    city,
    zone
  } = pickupForm;
  let sender_city_id, sender_zone_id;
  const senderCity = that.cities.find(({ name }) => name === city);
  if (senderCity) sender_city_id = senderCity.id;
  if (senderCity && senderCity.zones) {
    const senderZone = that.zones.find(({ name }) => name === zone);
    if (senderZone) sender_zone_id = senderZone.id;
  }

  if (status === "Merchant") {
    payload = {
      note,
      opened_by: openedById,
      sender_type: status,
      merchant_id: merchantId,
      merchant_associate_id: branchId
    };
  } else if (status === "Customer") {
    payload = {
      note,
      opened_by: openedById,
      sender_name: sender,
      sender_phone: phone,
      sender_address: address,
      sender_type: status,
      customer_id,
      sender_city_id,
      sender_zone_id
    };
  }
  return payload;
};

export default {
  getPickupsDetails: (axios, jwt, id) => {
    return axios.$get(`${url}/${id}`, setJwtHeaders(jwt));
  },
  getPickups: (axios, jwt) => {
    return axios.$get(`${url}/?is_closed=${false}`, setJwtHeaders(jwt));
  },
  getAllPickups: (axios, jwt, date) => {
    return axios.$get(
      `${url}/get_all_by_date?date=${date}`,
      setJwtHeaders(jwt)
    );
  },
  getPickupsWithPage: (axios, jwt, page) => {
    return axios.$get(
      url + "?page=" + page + "&is_closed=" + false,
      setJwtHeaders(jwt)
    );
  },
  postPickups: (that, pickupForm) => {
    return that.$axios.post(
      url,
      {
        ...buildPayload(pickupForm, that)
      },
      setJwtHeaders(that.jwt)
    );
  },
  putPickups: (that, pickupForm) => {
    return that.$axios.put(
      `${url}/${pickupForm.id}`,
      {
        ...buildPayload(pickupForm, that)
      },
      setJwtHeaders(that.jwt)
    );
  },
  deletePickups: (that, id) => {
    return that.$axios.delete(`${url}/${id}`, setJwtHeaders(that.jwt));
  },
  updatePickup: ({ pickupId, payload, that }) => {
    return that.$axios.put(
      `${url}/${pickupId}`,
      {
        ...payload
      },
      setJwtHeaders(that.jwt)
    );
  },
  updatePickupFee: ({ pickupId, take_pickup_fee, axios, jwt }) => {
    return axios.post(
      `${url}/${pickupId}/update_pickup_fee`,
      {
        take_pickup_fee
      },
      setJwtHeaders(jwt)
    );
  },
  closePickup: ({ jwt, $axios, id }) => {
    return $axios.post(`${url}/${id}/closed`, {}, setJwtHeaders(jwt));
  },
  assignPickup: that => {
    const payload = {
      pickup_id: that.pickup.id,
      opened_by: that.pickup.opened_by.id
    };
    return that.$axios.post(
      `${url}/assign_pickup`,
      payload,
      setJwtHeaders(that.jwt)
    );
  }
};
