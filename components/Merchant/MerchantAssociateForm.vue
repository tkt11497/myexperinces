<template>
  <v-dialog persistent v-model="isFormOpenDialog" max-width="500px">
    <v-card>
      <form @submit.prevent="onSave">
        <v-card-title>
          <span class="headline">{{ dialogTitle }}</span>
          <v-progress-linear v-if="isLoading" color="primary" :indeterminate="true"></v-progress-linear>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <!-- todo: -->
            <v-layout row wrap>
              <v-text-field
                browser-autocomplete="off"
                label="Branch Name"
                v-model="merchant_associate.label"
                name="branch_name"
                type="text"
                v-validate="'required'"
                :error="!!errors.first('branch_name')"
                :error-messages="errors.first('branch_name')"
              ></v-text-field>
            </v-layout>
            <!-- <v-layout row wrap>
              <v-autocomplete
                label="City"
                :items="cities"
                v-model="merchant_associate.city"
                item-text="name"
                return-object
                v-validate="'required'"
                name="city"
                @change="onChangeCity"
                :error="!!errors.first('city')"
                :error-messages="errors.first('city')"
              ></v-autocomplete>
            </v-layout>-->
            <v-layout row wrap>
              <v-autocomplete
                label="Zone"
                :items="selectedZones"
                v-model="merchant_associate.zone"
                item-text="name"
                return-object
                v-validate="'required'"
                name="zone"
                :error="!!errors.first('zone')"
                :error-messages="errors.first('zone')"
              ></v-autocomplete>
            </v-layout>
            <v-layout>
              <v-text-field
                browser-autocomplete="off"
                label="Phone"
                v-model="merchant_associate.phones"
                name="phones"
                type="text"
                v-validate="'required'"
                :error="!!errors.first('phones')"
                :error-messages="errors.first('phones')"
              ></v-text-field>
              <!-- v-validate="'required|phoneNumber'" -->
            </v-layout>
            <v-layout>
              <!-- v-validate="'required|email'" -->
              <v-text-field
                browser-autocomplete="off"
                label="Email"
                v-model="merchant_associate.emails"
                name="email"
                type="text"
                :error="!!errors.first('email')"
                :error-messages="errors.first('email')"
              ></v-text-field>
            </v-layout>
            <v-layout>
              <v-text-field
                browser-autocomplete="off"
                label="Account Name"
                v-model="merchant_associate.account_name"
                name="account_name"
                type="text"
                :error="!!errors.first('account_name')"
                :error-messages="errors.first('account_name')"
              ></v-text-field>
            </v-layout>
            <v-layout>
              <v-text-field
                browser-autocomplete="off"
                label="Account Number"
                v-model="merchant_associate.account_no"
                name="account_no"
                type="text"
                :error="!!errors.first('account_no')"
                :error-messages="errors.first('account_no')"
              ></v-text-field>
            </v-layout>
            <v-layout>
              <v-text-field
                browser-autocomplete="off"
                label="Address"
                v-model="merchant_associate.address"
                name="address"
                type="text"
                v-validate="'required'"
                :error="!!errors.first('address')"
                :error-messages="errors.first('address')"
              ></v-text-field>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="closeForm()">Cancel</v-btn>
          <v-btn color="primary" type="submit">Save</v-btn>
        </v-card-actions>
      </form>
    </v-card>
  </v-dialog>
</template>

<script>
import api from "@/assets/utilities/api";
import { mapGetters, mapActions } from "vuex";
import _ from "lodash";
import localforage from "localforage";
export default {
  name: "MerchantAssociateForm",
  components: {},
  props: {
    merchant: {
      type: Object,
      required: true
    },
    cities: {
      type: Array,
      required: true
    },
    zones: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isFormOpenDialog: false,
      isLoading: false,
      merchant_associate: {
        label: "",
        city: {},
        zone: {},
        phones: [],
        emails: [],
        account_name: "",
        account_no: "",
        Address: ""
      },
      phone: "",
      email: "",
      // selectedZones: [],
      dialogTitle: "New Merchant Associate"
    };
  },
  computed: {
    ...mapGetters({
      jwt: "auth/jwt"
    }),
    selectedZones() {
      return this.zones.filter(zone => this.merchant.city.id == zone.city.id);
    }
  },
  methods: {
    ...mapActions({
      setUser: "auth/setUser"
    }),
    async onSave() {
      const isErrorFree = await this.$validator.validateAll();
      if (!isErrorFree) return;
      const successMessage =
        this.dialogTitle === "New Merchant Associate"
          ? "New merchant associate has been created successfully."
          : "The merchant associate has been edited successfully.";
      if (this.dialogTitle === "New Merchant Associate") {
        const { data, message, status } = (await api.postMerchantAssociate(
          this,
          this.merchant.id
        )).data;
        if (status === 1) {
          this.setUser([data]);
          await localforage.setItem("user", [data]);
          this.$parent.$emit("createdNew", data.branches);
        }
        this.$parent.$emit("handleStatus", { status, message, successMessage });
      } else {
        const { data, message, status } = (await api.putMerchantAssociate(
          this
        )).data;
        if (status === 1) {
          this.setUser([data]);
          await localforage.setItem("user", [data]);
          data.branches.forEach(branch => {
            branch.account_name = _.last(branch.account_informations)
              ? _.last(branch.account_informations).account_name
              : "";
            branch.account_no = _.last(branch.account_informations)
              ? _.last(branch.account_informations).account_name
              : "";
          });
          this.$parent.$emit("updatedForm", data.branches);
        }
        this.$parent.$emit("handleStatus", { status, message, successMessage });
      }
      this.closeFormDialog(this);
    },
    closeForm() {
      this.closeFormDialog(this);
    }
  },
  mounted() {
    this.$parent.$on("editForm", item => {
      this.$validator.reset();
      this.merchant_associate = Object.assign({}, item);
      this.isFormOpenDialog = true;
      // this.selectedZones = this.zones.filter(
      //   zone => zone.city.id == this.merchant_associate.city.id
      // );
      this.dialogTitle = "Edit Merchant Associate";
    });
    this.$parent.$on("newForm", () => {
      this.$validator.reset();
      this.isFormOpenDialog = true;
      this.merchant_associate = {};
      this.dialogTitle = "New Merchant Associate";
    });
  }
};
</script>
