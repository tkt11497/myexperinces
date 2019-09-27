import setJwtHeaders from "./setJwtHeaders";

const STAFFS_URL = process.env.baseUrl + "/staffs";

export default {
  STAFFS_URL,
  getStaffs: (axios, jwt, URL) => {
    if (URL) {
      return axios.$get(URL, setJwtHeaders(jwt));
    } else {
      return axios.$get(STAFFS_URL, setJwtHeaders(jwt));
    }
  },
  postStaffs: that => {
    const { name, username, password } = that.staff;
    const role_id = that.staff.role;
    const department_id = that.staff.department;
    const zone_id = that.staff.zone || "";
    const courier_type_id = that.staff.courier_type || "";
    const phone = that.staff.phone || "";
    const payload = {
      name,
      username,
      password,
      role_id,
      department_id,
      zone_id,
      courier_type_id,
      phone
    };
    return that.$axios.post(STAFFS_URL, payload, setJwtHeaders(that.jwt));
  },
  putStaffs: that => {
    const { name, username, password, phone } = that.staff;
    const role_id =
      typeof that.staff.role === "object"
        ? that.staff.role.id
        : that.staff.role;
    const department_id =
      typeof that.staff.department === "object"
        ? that.staff.department.id
        : that.staff.department;
    const zone_id =
      typeof that.staff.zone === "object"
        ? that.staff.zone.id
        : that.staff.zone;
    const courier_type_id =
      typeof that.staff.courier_type === "object"
        ? that.staff.courier_type.id
        : that.staff.courier_type;
    const payload = {
      name,
      username,
      password,
      phone,
      role_id,
      department_id,
      zone_id,
      courier_type_id
    };
    return that.$axios.put(
      `${STAFFS_URL}/${that.staff.id}`,
      payload,
      setJwtHeaders(that.jwt)
    );
  },
  deleteStaffs: that => {
    return that.$axios.delete(
      `${STAFFS_URL}/${that.deletingId}`,
      setJwtHeaders(that.jwt)
    );
  }
};
