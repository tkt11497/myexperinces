import Vue from "vue";
import VeeValidate, { Validator } from "vee-validate";
import PhoneNumber from "awesome-phonenumber";

const phoneNumber = {
  getMessage: field => `${field} is not a valid phone number`,
  validate(value) {
    if (value.charAt(0) == "0" && value.charAt(1) == "9")
      value = `+95${value.substring(1)}`;
    return new Promise(resolve => {
      let phone = new PhoneNumber(value);
      resolve({ valid: phone.isValid() });
    });
  }
};
Validator.extend("phoneNumber", phoneNumber);
Vue.use(VeeValidate, {
  fieldsBagName: "vvFields"
});
