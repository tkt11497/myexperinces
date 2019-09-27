import _ from "lodash";

export function lockParcelItems(parcel_items) {
  parcel_items.forEach(item => {
    item.isLocked = true;
  });
  return parcel_items;
}

export function lockParcels(parcels) {
  parcels.forEach(parcel => {
    parcel.isLocked = true;
    parcel.parcel_items = lockParcelItems(parcel.parcel_items);
    parcel.coupon = parcel.coupon ? parcel.coupon : { code: "" };
  });
  return parcels;
}

export const defaultItem = {
  item_name: "Item",
  item_qty: 1,
  item_price: 0,
  isLocked: true
};

export const defaultParcel = {
  voucher_id: null,
  global_scale: 1,
  delivery_amount: null,
  discount_amount: null,
  weight: 0,
  maxWeight: 0,
  amount_to_collect: null,
  parcel_items: [_.cloneDeep(defaultItem)],
  tempCoupon: "",
  coupon: { code: "" },
  isLocked: true
};

export const defaultVoucher = {
  id: null,
  receiver: { name: "", address: "", phone: "" },
  parcels: [],
  total_discount_amount: "0",
  total_delivery_amount: "0",
  grand_sub_total: "0",
  amount_to_collect_sender: "0",
  amount_to_collect_receiver: "0",
  transaction_fee: "0",
  insurance_percentage: 0,
  is_closed: 0,
  parcels: [_.cloneDeep(defaultParcel)]
  // call_status: 1,
  // delegate_person: 1,
  // delegate_duration: 1
};

export const filterPaymentTypes = ({
  paymentTypes,
  voucherType,
  customerType,
  isDebit
}) => {
  try {
    if (voucherType === "station") {
      if (customerType === "Merchant") {
        if (isDebit) {
          return paymentTypes.filter(
            ({ id }) => id === 5 || id === 6 || id === 7 || id === 8
          );
        } else {
          return paymentTypes.filter(({ id }) => id === 6 || id === 8);
        }
      } else {
        if (isDebit) {
          return paymentTypes.filter(({ id }) => id === 7 || id === 8);
        } else {
          return paymentTypes.filter(({ id }) => id === 8);
        }
      }
    } else {
      if (customerType === "Merchant") {
        return paymentTypes.filter(
          ({ id }) =>
            id === 1 ||
            id === 2 ||
            id === 3 ||
            id === 4 ||
            id === 9 ||
            id === 10
        );
      } else {
        return paymentTypes.filter(({ id }) => id === 9);
      }
    }
  } catch (error) {
    return [];
  }
};

export const getMode = ({ type }) => {
  if (type === "station") {
    return "newStation";
  } else if (type === "normal") {
    return "newNormal";
  }
};
