export const getSenderZone = ({
  sender_type,
  sender,
  sender_associate
}) => {
  try {
    if (sender_type === "Customer") {
      if (sender.zone) return sender.zone.name;
      return "";
    } else {
      if (sender_associate) return sender_associate.zone.name;
      return "";
    }
  } catch (error) {
    return "";
  }
};

export const getZonesValues = ({
  citiesRecords,
  city
}) => {
  try {
    const foundCity = citiesRecords.find(record => record.name === city);
    const zonesValues = foundCity.zones.map(({
      name
    }) => name);
    return zonesValues;
  } catch (error) {
    return [];
  }
};

export const mapPickups = ({
  pickups,
  cities
}) => {
  return pickups.map(pickup => {
    const {
      id,
      pickup_invoice,
      sender,
      sender_type,
      opened_by,
      note,
      sender_associate,
      created_at,
      voucher_count
    } = pickup;
    const city =
      sender_type === "Customer" ?
      sender.city.name :
      sender_associate.city.name;
    return {
      isLocked: true,
      city,
      zone: getSenderZone({
        sender_type,
        sender_associate,
        sender
      }),
      zonesValues: getZonesValues({
        citiesRecords: cities,
        city
      }),
      id,
      sender_city_id: sender_type === "Customer" ? sender.city.id : "",
      sender_zone_id: sender_type === "Customer" ? (sender.zone ? sender.zone.id : "") : "",
      invoiceId: pickup_invoice,
      sender: sender.name,
      merchantId: sender.id,
      branchId: sender_type === "Merchant" ? sender_associate.id : "",
      status: sender_type,
      customer_id: sender_type === "Customer" ? sender.id : "",
      phone: sender_type === "Customer" ?
        sender.phone : sender_associate.phones.join(", "),
      address: sender_type === "Customer" ? sender.address : sender_associate.address,
      openedBy: opened_by ? opened_by.name : "",
      note: note,
      createdAt: created_at,
      voucher_count: voucher_count
    };
  });
};

export const filterStaffs = staffs => {
  return staffs.filter(staff => {
    return staff.role === 5 || staff.role === 2 || staff.department.id === 5;
  });
};

export const getStaffsData = staffs => {
  const filteredStaffs = filterStaffs(staffs);
  const staffsAutoCompletesKeysValues = filteredStaffs.map(staff => ({
    ...staff,
    value: staff.name
  }));
  const staffsAutoCompletesValues = staffsAutoCompletesKeysValues.map(
    ({
      value
    }) => value
  );
  return {
    staffsAutoCompletesKeysValues,
    staffsAutoCompletesValues
  };
};

export const getMerchantsData = merchants => {
  const merchantsMapped = _.flattenDeep(
    merchants.map(merchant =>
      merchant.branches.map(singleBranch => ({
        ...singleBranch,
        merchantName: merchant.name
      }))
    )
  );
  const merchantsAutoCompletesKeysValues = merchantsMapped.map(merchant => ({
    merchant,
    value: `${merchant.merchantName} - ${merchant.label} - ${merchant.address}`
  }));

  const merchantsAutoCompletesValues = merchantsMapped.map(
    ({
      merchantName,
      address,
      label
    }) => `${merchantName} - ${label} - ${address}`
  );
  return {
    merchantsCleaned: merchantsMapped,
    merchantsAutoCompletesValues,
    merchantsAutoCompletesKeysValues
  };
};