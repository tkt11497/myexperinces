import setJwtHeaders from "./setJwtHeaders";

const MERCHANTS_URL = process.env.baseUrl + "/merchants";
const MERCHANTS_ASSOCIATE_URL = process.env.baseUrl + "/merchant_associates";

export default {
  MERCHANTS_URL,
  getMerchants: (axios, jwt, URL) => {
    if (URL) {
      return axios.$get(URL, setJwtHeaders(jwt));
    } else {
      return axios.$get(MERCHANTS_URL, setJwtHeaders(jwt));
    }
  },
  getMerchantAssociates: (axios, jwt, URL) => {
    if (URL) {
      return axios.$get(URL, setJwtHeaders(jwt));
    } else {
      return axios.$get(MERCHANTS_ASSOCIATE_URL, setJwtHeaders(jwt));
    }
  },
  getMerchantById: (axios, jwt, id) =>
    axios.$get(`${MERCHANTS_URL}/${id}`, setJwtHeaders(jwt)),
  postMerchants: that => {
    // that.merchant.branches.forEach(branch => {
    //   branch.city_id = that.merchant.city;
    //   branch.zone_id = that.merchant.zone;
    // });
    const { name, username, password, branches } = that.merchant;
    const city_id = that.merchant.city.id;
    const staff_id = that.merchant.staff.id;
    const payload = {
      name,
      username,
      password,
      city_id,
      staff_id
      // branches
    };
    return that.$axios.post(MERCHANTS_URL, payload, setJwtHeaders(that.jwt));
  },
  putMerchants: that => {
    const { name, username, password } = that.merchant;
    const role_id =
      typeof that.merchant.role === "object"
        ? that.merchant.role.id
        : that.merchant.role;
    const department_id =
      typeof that.merchant.department === "object"
        ? that.merchant.department.id
        : that.merchant.department;
    const zone_id =
      typeof that.merchant.zone === "object"
        ? that.merchant.zone.id
        : that.merchant.zone;
    const courier_type_id =
      typeof that.merchant.courier_type === "object"
        ? that.merchant.courier_type.id
        : that.merchant.courier_type;
    const city_id = that.merchant.city.id;
    const staff_id = that.merchant.staff.id;
    const payload = {
      name,
      username,
      password,
      city_id,
      staff_id,
      role_id,
      department_id,
      zone_id,
      courier_type_id
    };
    return that.$axios.put(
      `${MERCHANTS_URL}/${that.merchant.id}`,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  deleteMerchants: that => {
    return that.$axios.delete(
      `${MERCHANTS_URL}/${that.deletingId}`,
      setJwtHeaders(that.jwt)
    );
  },
  postMerchantAssociate: (that, merchant_id) => {
    const {
      label,
      phones,
      emails,
      address,
      account_no,
      account_name
    } = that.merchant_associate;
    const city_id = that.merchant.city.id;
    const zone_id = that.merchant_associate.zone.id;
    let phones_array = [
      {
        phone: phones
      }
    ];
    let emails_array = [
      {
        email: emails
      }
    ];
    const payload = {
      merchant_id,
      label,
      city_id,
      zone_id,
      phones: phones_array,
      emails: emails_array,
      address,
      account_name,
      account_no
    };
    return that.$axios.post(
      MERCHANTS_ASSOCIATE_URL,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  putMerchantAssociate: (that, merchant_id) => {
    const {
      label,
      phones,
      emails,
      address,
      account_name,
      account_no
    } = that.merchant_associate;
    const city_id = that.merchant.city.id;
    const zone_id = that.merchant_associate.zone.id;
    let phones_array = [
      {
        phone: typeof phones === "string" ? phones : phones[0]
      }
    ];
    let emails_array = [
      {
        email: typeof emails === "string" ? emails : emails[0]
      }
    ];
    const payload = {
      merchant_id,
      label,
      city_id,
      zone_id,
      phones: phones_array,
      emails: emails_array,
      address,
      account_name,
      account_no
    };
    return that.$axios.put(
      `${MERCHANTS_ASSOCIATE_URL}/${that.merchant_associate.id}`,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  deleteMerchantAssociate: that => {
    return that.$axios.delete(
      `${MERCHANTS_ASSOCIATE_URL}/${that.deletingId}`,
      setJwtHeaders(that.jwt)
    );
  },
  updateMerchant: that => {
    return that.$axios.post(
      `${process.env.baseUrl}/auth/profile`,
      that.merchant,
      setJwtHeaders(that.jwt)
    );
  }
};
