<template>
  <div class="mx-1">
    <div @shortkey="lockSelectedRow" v-shortkey="['ctrl', ']']"></div>
    <div @shortkey="onUnlockRow" v-shortkey="['ctrl', '[']"></div>
    <div @shortkey="onCreateNewPickup" v-shortkey="['ctrl', '1']"></div>
    <div @shortkey="goToCreation({ mode: 'normal' })" v-shortkey="['ctrl', '2']"></div>
    <div @shortkey="goToCreation({ mode: 'station' })" v-shortkey="['ctrl', '3']"></div>
    <div @shortkey="$router.go(-1)" v-shortkey="['ctrl', 'b']"></div>
    <div @shortkey="selectNextRow" v-shortkey="['ctrl', 'arrowdown']"></div>
    <div @shortkey="selectPreviousRow" v-shortkey="['ctrl', 'arrowup']"></div>
    <div @shortkey="nextPage(page + 1)" v-shortkey="['ctrl', 'arrowright']"></div>
    <div @shortkey="previousPage(page - 1)" v-shortkey="['ctrl', 'arrowleft']"></div>
    <div @shortkey="onDelRow" v-shortkey="['ctrl', 'd']"></div>
    <div @shortkey="onSubmitPickup" v-shortkey="['ctrl', 's']"></div>
    <AppLoading :isLoading="isLoading"></AppLoading>
    <v-layout>
      <v-flex text-xs-center>
        <v-pagination @input="nextPage" v-model="page" :length="pages" :total-visible="10"></v-pagination>
      </v-flex>
    </v-layout>
    <v-layout mt-3>
      <v-flex xs6>
        <v-autocomplete
          label="Merchants"
          :loading="isSearchLoading"
          :items="merchantsAutoCompletesValues"
          v-model="form.merchantNameBranch"
          :search-input.sync="search"
          name="merchantNameBranch"
          id="merchantNameBranch"
          autofocus
          clearable
        ></v-autocomplete>
      </v-flex>
      <v-flex pl-5>
        <v-btn color="primary lighten-1" @click="onCreateNewPickup">New Pickup (Ctrl + 1)</v-btn>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs1 class="cell font-weight-bold" text-xs-center pa-2>Pickup</v-flex>
      <v-flex xs1 class="cell font-weight-bold" text-xs-center pa-2>Sender</v-flex>
      <v-flex xs1 class="cell font-weight-bold" text-xs-center pa-2>Phone</v-flex>
      <v-flex xs2 class="cell font-weight-bold" text-xs-center pa-2>Address</v-flex>
      <v-flex xs2 class="cell font-weight-bold" text-xs-center pa-2>City/ Zone</v-flex>
      <v-flex xs1 class="cell font-weight-bold" text-xs-center pa-2>Picked By</v-flex>
      <v-flex xs2 class="cell font-weight-bold" text-xs-center pa-2>Note</v-flex>
      <v-flex xs1 class="cell font-weight-bold" text-xs-center pa-2>Date</v-flex>
      <v-flex xs1 class="cell font-weight-bold" text-xs-center pa-2>Actions</v-flex>
    </v-layout>
    <form v-for="(pickupForm, index) in pickupForms" :key="index">
      <button
        :class="[index === sIndex ? 'row-active' : '', 'row-button']"
        style="width: 100%; position: relative"
        @dblclick="goToDetails(pickupForm)"
        type="button"
        v-if="pickupForm.isLocked"
        :id="'' + index + '-lockedRow'"
        :name="'' + index + '-lockedRow'"
        :ref="'' + index + '-lockedRow'"
      >
        <v-hover>
          <v-layout slot-scope="{ hover }">
            <AppCell>
              {{ `${pickupForm.invoiceId} - ${pickupForm.status[0]}` }}
              <v-chip color="indigo white--text" class="ml-0" small>
                <span color="white--text">{{ pickupForm.voucher_count || 0 }} voucher</span>
              </v-chip>

              <!-- <v-avatar color="indigo" size="25">
                  <span class="white--text headline">{{ pickupForm.voucher_count }}</span>
              </v-avatar>-->
            </AppCell>
            <AppCell>{{ pickupForm.sender }}</AppCell>
            <AppCell>{{ pickupForm.phone }}</AppCell>
            <v-flex xs2 class="cell">{{ pickupForm.address }}</v-flex>
            <v-flex xs2 class="cell">{{ `${pickupForm.city || ""} - ${pickupForm.zone || ""}` }}</v-flex>
            <AppCell>{{ pickupForm.openedBy }}</AppCell>
            <v-flex xs2 class="cell">{{ pickupForm.note }}</v-flex>
            <AppCell>{{ pickupForm.createdAt }}</AppCell>
            <AppCell>
              <v-layout :class="hover ? 'show' : 'hide'" row wrap>
                <!-- <v-layout row wrap> -->
                <v-flex xs6>
                  <v-btn
                    flat
                    icon
                    color="green"
                    @click="onClickEdit"
                    :name="'' + index + '-editButton'"
                  >
                    <v-icon>edit</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs6>
                  <v-btn
                    flat
                    icon
                    color="red"
                    @click="onClickDel"
                    :name="'' + index + '-delButton'"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs6>
                  <v-btn
                    flat
                    icon
                    @click="event => goToCreation({ mode: 'normal', event })"
                    :name="'' + index + '-delButton'"
                    title="door-to-door"
                  >
                    <v-icon>home</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs6>
                  <v-btn
                    flat
                    icon
                    @click="event => goToCreation({ mode: 'station', event })"
                    :name="'' + index + '-delButton'"
                    title="bus drop-off"
                  >
                    <v-icon>directions_bus</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </AppCell>
          </v-layout>
        </v-hover>
      </button>
      <div v-else>
        <v-layout>
          <AppCell>
            <v-text-field
              browser-autocomplete="off"
              name="id"
              :value="`${pickupForm.invoiceId} - ${pickupForm.status[0]}`"
              disabled
              readonly
            ></v-text-field>
          </AppCell>
          <AppCell>
            <!-- :error="!!errors.first('' + index + '-sender')"
            :error-messages="errors.first('' + index + '-sender')"-->
            <v-text-field
              browser-autocomplete="off"
              v-model="pickupForm.sender"
              :disabled="pickupForm.status === 'Merchant'"
              :readonly="pickupForm.status === 'Merchant'"
              :error="!pickupForm.sender"
              v-validate="'required'"
              :name="'' + index + '-sender'"
              :ref="'' + index + '-sender'"
            ></v-text-field>
          </AppCell>
          <AppCell>
            <!-- :error="!!errors.first('' + index + '-phone')"
            :error-messages="errors.first('' + index + '-phone')"-->
            <v-text-field
              browser-autocomplete="off"
              v-model="pickupForm.phone"
              :error="!pickupForm.phone"
              :disabled="pickupForm.status === 'Merchant'"
              :readonly="pickupForm.status === 'Merchant'"
              v-validate="'required|numeric'"
              :name="'' + index + '-phone'"
              :ref="'' + index + '-phone'"
            ></v-text-field>
          </AppCell>
          <v-flex xs2 class="cell">
            <v-text-field
              browser-autocomplete="off"
              v-model="pickupForm.address"
              :disabled="pickupForm.status === 'Merchant'"
              :readonly="pickupForm.status === 'Merchant'"
              :name="'' + index + '-address'"
              :ref="'' + index + '-address'"
              :id="'' + index + '-address'"
            ></v-text-field>
          </v-flex>
          <v-flex xs2 class="cell">
            <v-layout>
              <v-flex xs6>
                <v-autocomplete
                  label="City"
                  :items="citiesValues"
                  v-model="pickupForm.city"
                  :error="!pickupForm.city"
                  :disabled="pickupForm.status === 'Merchant'"
                  :readonly="pickupForm.status === 'Merchant'"
                  v-validate="'required'"
                  :name="'' + index + '-city'"
                  :ref="'' + index + '-city'"
                  :id="'' + index + '-city'"
                  @change="onChangeCity({ form: pickupForm, index })"
                ></v-autocomplete>
              </v-flex>
              <v-flex xs6>
                <v-autocomplete
                  label="Zone"
                  :items="pickupForm.zonesValues"
                  v-model="pickupForm.zone"
                  :disabled="pickupForm.status === 'Merchant'"
                  :readonly="pickupForm.status === 'Merchant'"
                  v-validate="'required'"
                  :name="'' + index + '-zone'"
                  :ref="'' + index + '-zone'"
                  :id="'' + index + '-zone'"
                  @change="onChangeZone({ form: pickupForm, index })"
                ></v-autocomplete>
              </v-flex>
            </v-layout>
          </v-flex>
          <AppCell>
            <!-- :loading="isDeliverySearchLoading"
            :search-input.sync="delivery_search"-->
            <v-autocomplete
              label="Staff"
              :items="staffsAutoCompletesValues"
              v-model="pickupForm.openedBy"
              :disabled="pickupForm.isLocked"
              :readonly="pickupForm.isLocked"
              :change="onChangeOpenedBy(index)"
              :name="'' + index + '-openedBy'"
              :ref="'' + index + '-openedBy'"
              :id="'' + index + '-openedBy'"
            ></v-autocomplete>
          </AppCell>
          <v-flex xs2 class="cell">
            <v-text-field
              browser-autocomplete="off"
              :disabled="pickupForm.isLocked"
              :readonly="pickupForm.isLocked"
              v-model="pickupForm.note"
              :name="'' + index + '-note'"
              :ref="'' + index + '-note'"
            ></v-text-field>
          </v-flex>
          <AppCell>
            <v-text-field
              browser-autocomplete="off"
              name="status"
              :value="pickupForm.createdAt"
              disabled
              readonly
            ></v-text-field>
          </AppCell>
          <AppCell>
            <v-btn color="green darken-1" flat icon @click="onSubmitPickup">
              <v-icon>done</v-icon>
            </v-btn>
            <v-btn color="red darken-1" flat icon @click="onDelRow">
              <v-icon>delete</v-icon>
            </v-btn>
          </AppCell>
        </v-layout>
      </div>
    </form>
    <v-layout>
      <v-flex text-xs-center>
        <v-pagination @input="nextPage" v-model="page" :length="pages" :total-visible="10"></v-pagination>
      </v-flex>
    </v-layout>
    <v-snackbar v-model="snackbar" bottom left :timeout="6000 * 1">
      {{ snackbarMessage }}
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-layout row justify-center>
      <v-dialog v-model="actionConfirmationDialog" width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ actionMessage }}</span>
          </v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <form @submit.prevent="confirmAction()">
              <input
                ref="actionHiddenTextField"
                id="actionHiddenTextField"
                name="actionHiddenTextField"
                @keydown="onChangeActionHiddenTextField"
                style="height: 0"
              />
              <v-btn color="green darken-1" flat="flat" @click="cancelAction">Cancel</v-btn>
              <v-btn color="red darken-1" flat="flat" type="submit">Submit</v-btn>
            </form>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>
</template>

<script>
import _ from "lodash";
import validator from "validator";
import { mapGetters, mapActions } from "vuex";
import localforage from "localforage";

import api from "@/assets/utilities/api";
import {
  handleStatus,
  handleStatusInAsyncData
} from "@/assets/utilities/helpers/common";
import {
  getSenderZone,
  getZonesValues,
  mapPickups,
  filterStaffs,
  getStaffsData,
  getMerchantsData
} from "@/assets/utilities/helpers/pickups";
import AppLoading from "@/components/App/loading";
import AppCell from "@/components/App/Cell";

export default {
  middleware: ["auth"],

  components: { AppLoading, AppCell },
  created() {
    document.addEventListener("focusin", this.focusChanged);
  },
  beforeDestroy() {
    document.removeEventListener("focusin", this.focusChanged);
  },
  async asyncData(context) {
    const { "auth/jwt": jwt, "auth/user": user } = context.store.getters;
    const { $axios } = context.app;
    const pickups = await api.getPickups($axios, jwt);
    if (!handleStatusInAsyncData({ status: pickups.status, context })) return;
    const responses = await Promise.all([
      localforage.getItem("stored:merchants"),
      api.getStaffs($axios, jwt),
      localforage.getItem("stored:cities"),
      localforage.getItem("stored:zones")
    ]);
    const pickupsData = pickups.data;
    // const merchants = responses[0];
    const merchants = [...user];
    const staffs = responses[1].data.filter(staff => staff.is_present);
    const cities = responses[2];
    const zones = responses[3];
    const citiesValues = cities.map(({ name }) => name);
    const pickupForms = mapPickups({ pickups: pickupsData, cities });
    const pages = pickups.meta.last_page;
    const {
      merchantsCleaned,
      merchantsAutoCompletesValues,
      merchantsAutoCompletesKeysValues
    } = getMerchantsData(merchants);
    const {
      staffsAutoCompletesKeysValues,
      staffsAutoCompletesValues
    } = getStaffsData(staffs);
    context.store.commit("title/setTitle", "Pickups - Operation");
    return {
      zones,
      cities,
      citiesValues,
      pages,
      pickupForms,
      merchants,
      merchantsCleaned,
      merchantsAutoCompletesValues,
      merchantsAutoCompletesKeysValues,
      staffsAutoCompletesKeysValues,
      staffsAutoCompletesValues
    };
  },
  data() {
    return {
      actionMessage: "",
      actionToPerform: "",
      actionConfirmationDialog: false,
      sIndex: "",
      sType: "",
      page: 1,
      pages: 1,
      merchants: [],
      merchantsCleaned: [],
      merchantsAutoCompletesValues: [],
      merchantsAutoCompletesKeysValues: [],
      staffsAutoCompletesKeysValues: [],
      staffsAutoCompletesValues: [],
      form: {},
      pickupForms: [],
      snackbarMessage: "",
      snackbar: false,
      isLoading: false,
      isSearchLoading: false,
      search: "",
      isDeliverySearchLoading: false,
      delivery_search: ""
    };
  },
  computed: {
    ...mapGetters({
      jwt: "auth/jwt",
      user: "auth/user"
    }),
    loadingValue() {}
  },
  watch: {
    search: _.debounce(async function(val) {
      if (this.form.merchantNameBranch) return;
      this.isSearchLoading = true;

      // let merchants = (await api.getMerchants(
      //   this.$axios,
      //   this.jwt,
      //   `${process.env.baseUrl}/merchants?search=${val}`
      // )).data;
      let merchants = [...this.user];

      const {
        merchantsCleaned,
        merchantsAutoCompletesValues,
        merchantsAutoCompletesKeysValues
      } = getMerchantsData(merchants);

      this.merchantsCleaned = merchantsCleaned;
      this.merchantsAutoCompletesValues = merchantsAutoCompletesValues;
      this.merchantsAutoCompletesKeysValues = merchantsAutoCompletesKeysValues;

      this.isSearchLoading = false;
    }, 1000)
    // delivery_search: _.debounce(async function(val) {
    //   this.isDeliverySearchLoading = true;

    //   let staffs = (await api.getStaffs(
    //     this.$axios,
    //     this.jwt,
    //     `${process.env.baseUrl}/staffs?search=${val}`
    //   )).data.filter(staff => staff.is_present);

    //   const {
    //     staffsAutoCompletesValues,
    //     staffsAutoCompletesKeysValues
    //   } = getStaffsData(staffs);

    //   this.staffsAutoCompletesValues = staffsAutoCompletesValues;
    //   this.staffsAutoCompletesKeysValues = staffsAutoCompletesKeysValues;

    //   this.isDeliverySearchLoading = false;
    // }, 1000)
  },
  methods: {
    ...mapActions({
      setNavigationShow: "navigation/setShow",
      setNavigationUrl: "navigation/setUrl"
    }),
    transferTitle(title) {
      this.$emit("getTitle", title);
    },
    goToCreation({ mode, event }) {
      if (event) event.stopPropagation();
      const form = this.pickupForms[this.sIndex];
      if (!form.id) return;
      this.$router.push(`/vouchers/details?type=${mode}&pickupId=${form.id}`);
    },
    onClickEdit(event) {
      // this.$validator.reset();
      event.stopPropagation();
      this.onUnlockRow();
    },
    onClickDel(event) {
      event.stopPropagation();
      this.onDelRow();
    },
    focusChanged(event) {
      const { name } = event.target;
      if (!name || name === "actionHiddenTextField") return;
      const names = name.split("-");
      let sIndex = "";
      if (!validator.isNumeric(names[0])) {
        this.sIndex = "";
        this.sType = "";
        return;
      }
      this.sIndex = parseInt(names[0], 10);
      this.sType = names[1];
    },
    onChangeZone({ form, index }) {
      const foundZone = this.zones.find(({ name }) => name);
      form.zoneId = foundZone.id;
    },
    onChangeCity({ form, index }) {
      const foundCity = this.cities.find(({ name }) => name === form.city);
      if (!foundCity) return;
      form.cityId = foundCity.id;
      form.sender_city_id = foundCity.id;
      if (!foundCity.zones) return;
      const zonesValues = foundCity.zones.map(({ name }) => name);
      form.zonesValues = zonesValues;
    },
    async previousPage(page) {
      if (this.page === 0) return;
      this.isLoading = true;
      const { data, status, message } = await api.getPickupsWithPage(
        this.$axios,
        this.jwt,
        page
      );
      this.isLoading = false;
      if (status !== 1) return;
      this.pickupForms = mapPickups({ pickups: data, cities: this.cities });
      this.page--;
    },
    async nextPage(page) {
      if (this.isLoading) return;
      if (page > this.pages) return;
      this.isLoading = true;
      const { data, status, message } = await api.getPickupsWithPage(
        this.$axios,
        this.jwt,
        page
      );
      if (status !== 1) return;
      this.pickupForms = mapPickups({ pickups: data, cities: this.cities });
      this.page = page;
      this.isLoading = false;
    },
    addNewCustomerForm() {
      const newCustomerForm = {
        sender: "",
        phone: "",
        address: "",
        status: "Customer",
        invoiceId: "",
        isLocked: false
      };
      this.pickupForms = [newCustomerForm, ...this.pickupForms];
      this.$nextTick(() => {
        this.$refs["0-sender"][0].focus();
      });
    },
    addNewMerchantForm(foundBranch) {
      const newPickUpForm = {
        sender: foundBranch.merchant.merchantName,
        phone: foundBranch.merchant.phones.join(", "),
        address: foundBranch.merchant.address,
        branchId: foundBranch.merchant.id,
        merchantId: foundBranch.merchant.merchant_id,
        status: "Merchant",
        city: foundBranch.merchant.city.name,
        zone: foundBranch.merchant.zone ? foundBranch.merchant.zone.name : "",
        invoiceId: "",
        isLocked: false
      };
      newPickUpForm.zonesValues = this.cities
        .find(city => city.id === foundBranch.merchant.city.id)
        .zones.map(({ name }) => name);
      this.pickupForms = [newPickUpForm, ...this.pickupForms];
      this.$nextTick(() => {
        this.$refs["0-openedBy"][0].focus();
      });
    },
    updatePickupFormData({ status, message, data, index, pickupForm }) {
      if (status === 1) {
        this.pickupForms.splice(index, 1, {
          ...pickupForm,
          id: data.id,
          invoiceId: data.pickup_invoice,
          createdAt: data.created_at,
          customer_id: data.sender.id
        });
      }
    },
    onChangeOpenedBy(index) {
      const foundStaff = this.staffsAutoCompletesKeysValues.find(
        ({ value }) => value === this.pickupForms[index].openedBy
      );
      if (!foundStaff) return;
      this.pickupForms[index].openedById = foundStaff.id;
    },
    onCreateNewPickup() {
      // this.$validator.reset();
      for (const form of this.pickupForms) {
        if (!form.invoiceId) {
          this.snackbar = true;
          this.snackbarMessage = "More than one form cannot be created.";
          return;
        }
      }
      const { merchantNameBranch } = this.form;
      this.lockAllRows();
      this.merchantsAutoCompletesKeysValues.forEach(element => {});
      const foundBranch = this.merchantsAutoCompletesKeysValues.find(
        ({ value }) => value === merchantNameBranch
      );
      if (foundBranch) {
        this.addNewMerchantForm(foundBranch);
      } else {
        return;
        // this.addNewCustomerForm();
      }
      this.form.merchantNameBranch = "";
    },
    compareTwoRows() {
      const formToEdit = this.pickupForms[this.sIndex];
      const oldForm = { ...this.tempForm, isLocked: false, openedById: "" };
      const newForm = { ...formToEdit, isLocked: false, openedById: "" };
      return _.isEqual(oldForm, newForm);
    },
    onEditRow() {
      if (this.sIndex === "") return;
      if (this.compareTwoRows()) {
        return (this.pickupForms[this.sIndex].isLocked = true);
      }
      const formToEdit = this.pickupForms[this.sIndex];
      const formToEditId = formToEdit.id;
      this.askForActionConfirmation("edit", "Edit action confirmation");
    },
    editRow() {
      return new Promise(async (resolve, reject) => {
        const pickupForm = this.pickupForms[this.sIndex];
        this.actionConfirmationDialog = false;
        this.isLoading = true;
        const { status, data, message } = (await api.putPickups(
          this,
          pickupForm
        )).data;
        handleStatus({ status, message, that: this, successMessage: "Edited" });
        if (status !== 1) {
          if (pickupForm.status === "Customer") {
            this.$refs[`${this.editingRowIndex}-sender`][0].focus();
          } else {
            this.$refs[`${this.editingRowIndex}-openedBy`][0].focus();
          }
        }
        this.updatePickupFormData({
          status,
          data,
          message,
          pickupForm,
          index: this.sIndex
        });
        this.isLoading = false;
        if (status === 1) this.lockAllRows();
        resolve();
      });
    },
    async onSubmitPickup() {
      // const isErrorFree = await this.$validator.validateAll();
      // this.$validator.errors.items.forEach(error => {
      //   let field = error.field;
      //   let formField = error.field.split("-")[1];
      //   error.msg = error.msg.replace(field, formField);
      // });
      // console.log(this.$validator.errors.items);
      // if (!isErrorFree) return;
      const index = this.sIndex;
      if (index === "") return;
      const pickupForm = this.pickupForms[index];
      if (pickupForm.isLocked) return;
      if (this.isLoading) return;
      this.isLoading = true;
      if (!pickupForm.id) {
        const { status, data, message } = (await api.postPickups(
          this,
          pickupForm
        )).data;
        this.isLoading = false;
        handleStatus({
          status,
          message,
          that: this,
          successMessage: "Created"
        });
        this.updatePickupFormData({ status, data, message, pickupForm, index });
        this.isLoading = false;
        if (status === 1) this.lockAllRows();
      } else {
        if (index === "" || _.isEqual(this.tempForm, {}) || !this.tempForm) {
          return;
        }
        this.onEditRow();
      }
      this.isLoading = false;
    },
    goToDetails(pickupForm) {
      this.pickupForms.forEach(form => {
        if (!form.isLocked) return;
      });
      if (!pickupForm.id) return;
      window.open(`/pickups/${pickupForm.id}`, "_blank");
      // this.$router.push("/pickups/" + pickupForm.id);
    },
    lockAllRows() {
      this.pickupForms.forEach(p => {
        p.isLocked = true;
      });
      this.tempForm = {};
      this.editingRowIndex = null;
    },
    async selectPreviousRow() {
      let previousRowIndex = this.sIndex - 1;
      try {
        if (this.sIndex === 0 || this.sIndex === "") {
          await this.$nextTick();
          if (!this.$refs[`0-lockedRow`][0].focus()) return;
          this.selectFirstRow();
          return;
        }
        try {
          this.$refs[`${previousRowIndex}-lockedRow`][0].focus();
        } catch (e) {
          this.selectFirstRow();
        }
      } catch (error) {}
    },
    selectFirstRow() {
      this.$refs[`0-lockedRow`][0].focus();
    },
    async selectNextRow() {
      const nextRowIndex = this.sIndex + 1;
      if (this.sIndex === "" || this.sType === "") {
        this.selectFirstRow();
      }
      if (this.sType !== "lockedRow") return;
      if (!this.$refs[`${this.sIndex + 1}-lockedRow`]) return;
      try {
        this.$refs[`${nextRowIndex}-lockedRow`][0].focus();
      } catch (error) {
        try {
          this.$refs[`${nextRowIndex + 1}-lockedRow`][0].focus();
        } catch (error) {
          this.selectFirstRow();
        }
      }
    },
    unlockRow(index) {
      const clonedForm = _.cloneDeep(this.pickupForms[index]);
      this.tempForm = clonedForm;
      this.pickupForms[index].isLocked = false;
      this.editingRowIndex = index;
    },
    lockRowWithoutConfirmation(index) {
      this.pickupForms.splice(index, 1, { ...this.tempForm, isLocked: true });
    },
    lockSelectedRow(index) {
      if (this.pickupForms[this.sIndex].isLocked) return;
      if (this.compareTwoRows()) {
        // comparing with old form passed, do nothing
        this.pickupForms.splice(this.sIndex, 1, this.tempForm);
      } else {
        // the new form is being modified, need to ask confirmation
        this.askForActionConfirmation("edit", "Edit action confirmation");
      }
    },
    checkPreviousRowIsClean() {
      const newForm = {
        ...this.pickupForms[this.editingRowIndex],
        isLocked: null,
        openedById: null
      };
      const oldForm = { ...this.tempForm, isLocked: null, openedById: null };
      return _.isEqual(newForm, oldForm);
    },
    editPreviousRow() {
      return new Promise(async (resolve, reject) => {
        const pickupForm = this.pickupForms[this.editingRowIndex];
        this.actionConfirmationDialog = false;
        this.isLoading = true;
        const { status, data, message } = (await api.putPickups(
          this,
          pickupForm
        )).data;
        handleStatus({ status, message, that: this, successMessage: "Edited" });
        this.updatePickupFormData({
          status,
          data,
          message,
          pickupForm,
          index: this.editingRowIndex
        });
        this.isLoading = false;
        if (status === 1) this.lockAllRows();
        resolve();
      });
    },
    async onUnlockRow() {
      if (this.sIndex === "") return;
      if (!this.checkPreviousRowIsClean()) {
        return this.askForActionConfirmation(
          "edit-previous-row",
          "Edit previous row confirmation"
        );
      }
      this.lockAllRows();
      this.unlockRow(this.sIndex);
      await this.$nextTick();
      if (this.pickupForms[this.sIndex].status === "Customer") {
        this.$refs[`${this.sIndex}-sender`][0].focus();
      } else {
        this.$refs[`${this.sIndex}-openedBy`][0].focus();
      }
    },
    async delRow() {
      if (this.isLoading) return;
      this.isLoading = true;
      const id = this.pickupForms[this.sIndex].id;
      if (!id) {
        return (this.isLoading = false);
      }
      const { message, status, data } = (await api.deletePickups(
        this,
        id
      )).data;
      this.isLoading = false;
      this.actionConfirmationDialog = false;
      if (status !== 1) return;
      this.pickupForms.splice(this.sIndex, 1);
    },
    async askForActionConfirmation(actionName, actionMessage) {
      this.actionMessage = actionMessage;
      this.actionConfirmationDialog = true;
      await this.$nextTick();
      this.$refs.actionHiddenTextField.focus();
      this.actionToPerform = actionName;
    },
    async onDelRow() {
      if (this.sIndex === "") return;
      const formToDel = this.pickupForms[this.sIndex];
      const formToDelId = formToDel.id;
      if (!formToDel.invoiceId) {
        this.pickupForms.splice(this.sIndex, 1);
        return;
      }
      for (const key of Object.keys(formToDel)) {
        if (formToDel[key]) {
          return this.askForActionConfirmation(
            "del",
            "Delete Action Confirmation"
          );
        }
      }
    },
    confirmAction() {
      if (this.actionToPerform === "del") {
        this.delRow();
      } else if (this.actionToPerform === "edit") {
        this.editRow();
      } else if (this.actionToPerform === "exit") {
        this.exitRow();
      } else if (this.actionToPerform === "edit-previous-row") {
        this.editPreviousRow();
      }
    },
    exitRow() {
      this.pickupForms.splice(this.sIndex, 1, this.tempForm);
    },
    lockAllRowsWithoutModifying() {
      if (this.tempForm) {
        this.pickupForms.splice(this.editingRowIndex, 1, this.tempForm);
      }
    },
    onChangeActionHiddenTextField(event) {
      if (event.key === "Escape") {
        this.lockAllRowsWithoutModifying();
        return this.cancelAction();
      }
    },
    cancelAction() {
      if (this.tempForm) {
        this.pickupForms.splice(this.editingRowIndex, 1, this.tempForm);
        this.actionConfirmationDialog = false;
        this.$nextTick(() => {
          this.$refs[`${this.sIndex}-lockedRow`][0].focus();
        });
      } else {
        this.actionConfirmationDialog = false;
      }
    }
  },
  mounted() {
    this.setNavigationShow(false);
    this.setNavigationUrl("");
  }
};
</script>

<style scoped>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}
</style>
