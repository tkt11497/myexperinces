<template>
  <v-container fluid class="mx-1">
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
    <!-- <v-layout>
      <v-flex text-xs-center>
        <v-pagination @input="nextPage" v-model="page" :length="pages" :total-visible="10"></v-pagination>
      </v-flex>
    </v-layout>
    <v-layout mt-3>
      <v-flex md6 xs6>
        <v-autocomplete
          label="Branches"
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
    </v-layout>-->

    <!--- table starts here -->

    <material-cardy color="#283E4A" ref="normal" text="Pick A branch">
      <v-autocomplete
        :loading="isSearchLoading"
        label="Pick A Branch"
        :items="merchantsAutoCompletesValues"
        v-model="form.merchantNameBranch"
        :search-input.sync="search"
        name="merchantNameBranch"
        id="merchantNameBranch"
        autofocus
        clearable
        slot="searchy"
        class="pa-0 mt-6"
      ></v-autocomplete>

      <v-text-field
        autocomplete="off"
        v-model="searcher"
        append-icon="search"
        label="Search"
        single-line
        hide-details
        slot="buttons"
        class="mt-1"
      ></v-text-field>

      <v-layout align-center row pl-1 slot="datey" class="pa-0 mt-0">
        <v-menu
          ref="dateMenu"
          v-model="dateMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="date"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="290px"
          @input="onChangeDate"
          class="pa-0 mt-0"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              browser-autocomplete="off"
              v-model="date"
              label="Pick Date"
              prepend-icon="event"
              readonly
              v-on="on"
              class="pr-1 mr-1"
            ></v-text-field>
          </template>
          <v-date-picker v-model="date" no-title scrollable>
            <v-spacer></v-spacer>
            <v-btn flat color="primary" @click="dateMenu = false">Cancel</v-btn>
            <v-btn flat color="primary" @click="$refs.dateMenu.save(date)">OK</v-btn>
          </v-date-picker>
        </v-menu>
      </v-layout>

      <v-btn
        slot="button1"
        class="mt-7"
        color="green"
        small
        @click="onCreateNewPickup"
      >New Pickup (Ctrl + 1)</v-btn>
      <v-data-table :headers="headers" :items="pickupForms" :search="searcher" disable-sort>
        <template v-slot:body="{items}">
          <tbody>
            <tr v-show="items.length == 0">
              <td colspan="11" class="font-weight-bold">
                <p class="text-center">---Empty---</p>
              </td>
            </tr>
            <tr
              v-for="(pickupForm, index) in items"
              :key="index"
              @dblclick="goToDetails(pickupForm)"
            >
              <!-- - ${pickupForm.status[0]}` -->
              <td>
                <nuxt-link
                  target="_blank"
                  :to="`/pickups/${pickupForm.id}`"
                >{{ pickupForm.invoiceId }}</nuxt-link>
              </td>
              <td>
                <v-chip color="green white--text" class="ml-0" small>
                  <span color="white--text">{{ pickupForm.voucher_count || 0 }} voucher</span>
                </v-chip>
              </td>
              <td>
                <p>{{pickupForm.branchname}}</p>
              </td>
              <td>
                <p>{{ `${pickupForm.city || ""} - ${pickupForm.zone || ""}` }}</p>
              </td>
              <td class="text-center">
                <v-text-field
                  autocomplete="off"
                  :disabled="pickupForm.isLocked"
                  :readonly="pickupForm.isLocked"
                  v-model="pickupForm.note"
                  :name="'' + index + '-note'"
                  :ref="'' + index + '-note'"
                ></v-text-field>
              </td>
              <td>
                <p>{{ pickupForm.createdAt }}</p>
              </td>
              <td>
                <p>{{pickupForm.total_prepaid_amount}}</p>
              </td>
              <td>
                <p>{{pickupForm.pickup_fee}}</p>
              </td>
              <td>
                <p>{{pickupForm.is_pickuped}}</p>
              </td>
              <td>
                <p v-if="pickupForm.opened_by">{{pickupForm.opened_by.name}}</p>
              </td>
              <td>
                <v-layout v-if="pickupForm.isLocked">
                  <!-- <v-layout row wrap> -->

                  <v-btn icon color="green" @click="onClickEdit" :name="'' + index + '-editButton'">
                    <v-icon>edit</v-icon>
                  </v-btn>

                  <v-btn icon color="red" @click="onClickDel" :name="'' + index + '-delButton'">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-layout>
                <v-layout v-else>
                  <v-btn color="green darken-1" icon @click="onSubmitPickup">
                    <v-icon>done</v-icon>
                  </v-btn>
                  <v-btn color="red darken-1" icon @click="onDelRow">
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-layout>
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </material-cardy>
    <v-snackbar v-model="snackbar" bottom left :timeout="6000 * 1">
      {{ snackbarMessage }}
      <v-btn color="pink" @click="snackbar = false">Close</v-btn>
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
              <v-btn color="green darken-1" @click="cancelAction">Cancel</v-btn>
              <v-btn color="red darken-1" type="submit">Submit</v-btn>
            </form>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
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
    this.form.merchantNameBranch = this.merchantsAutoCompletesValues[0];
    document.addEventListener("focusin", this.focusChanged);
  },
  beforeDestroy() {
    document.removeEventListener("focusin", this.focusChanged);
  },
  async asyncData(context) {
    const { "auth/jwt": jwt, "auth/user": user } = context.store.getters;
    const { $axios } = context.app;
    // const pickups1 = await api.getPickups($axios, jwt);
    // console.log(pickups1);
    const { data, status, message } = await api.getAllPickups(
      $axios,
      jwt,
      new Date().toISOString().substr(0, 10)
    );

    data.forEach(data => {
      data.sender.zone = data.sender.zone || "";
    });
    if (!handleStatusInAsyncData({ status, context })) return;
    const responses = await Promise.all([
      localforage.getItem("stored:merchants"),
      api.getStaffs($axios, jwt),
      localforage.getItem("stored:cities"),
      localforage.getItem("stored:zones")
    ]);
    console.log(data);
    const pickups = [...data];
    console.log(pickups);
    // const merchants = responses[0];
    const merchants = [...user];
    const staffs = responses[1].data.filter(staff => staff.is_present);
    const cities = responses[2];
    const zones = responses[3];
    const citiesValues = cities.map(({ name }) => name);

    const pickupForms = mapPickups({ pickups, cities });
    console.log("worked herehrehrehrehrehr");
    console.log(pickupForms);
    // const pages = pickups.meta.last_page;
    const {
      merchantsCleaned,
      merchantsAutoCompletesValues,
      merchantsAutoCompletesKeysValues
    } = getMerchantsData(merchants);
    const {
      staffsAutoCompletesKeysValues,
      staffsAutoCompletesValues
    } = getStaffsData(staffs);
    context.store.commit("title/setTitle", "Pickups ");
    return {
      zones,
      cities,
      citiesValues,
      // pages,
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
      searcher: "",
      loadinger: false,
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
      snackbarMessage: "",
      snackbar: false,
      isLoading: false,
      isSearchLoading: false,
      search: "",
      isDeliverySearchLoading: false,
      delivery_search: "",
      headers: [
        { text: "Pickup No", value: "invoiceId" },
        { text: "Total Vouchers", value: "voucher_count" },
        { text: "Branch", value: "branchname" },
        { text: "City/ Zone", value: "zone" },
        { text: "Note", value: "note" },
        { text: "Date", value: "createdAt" },
        { text: "Total Prepaid Amount", value: "total_prepaid_amount" },
        { text: "Pickup Fee", value: "pickup_fee" },
        { text: "Status", value: "is_pickuped" },
        { text: "Pick Up By", value: "pickup_by" },
        { text: "Actions", value: "aactions" }
      ],
      date: new Date().toISOString().substr(0, 10),
      dateMenu: false
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
    async onChangePickups(event) {
      const { $axios, jwt, date } = this;
      this.isLoading = true;
      const successMessage =
        "Successfully loaded pickups for corresponding Zones.";
      const { data, status, message } = await api.getAllPickups(
        this.$axios,
        this.jwt,
        this.date
      );

      data.forEach(data => {
        data.sender.zone = data.sender.zone || "";
      });
      // if (!handleStatusInAsyncData({ status, context })) return;
      const responses = await Promise.all([
        localforage.getItem("stored:merchants"),
        api.getStaffs($axios, jwt),
        localforage.getItem("stored:cities"),
        localforage.getItem("stored:zones")
      ]);
      console.log(data);
      const pickups = [...data];
      console.log(pickups);
      // const merchants = responses[0];
      // const merchants = [...user];
      const staffs = responses[1].data.filter(staff => staff.is_present);
      const cities = responses[2];
      const zones = responses[3];
      const citiesValues = cities.map(({ name }) => name);

      // const pickupForms = mapPickups({ pickups, cities });
      this.pickupForms = mapPickups({ pickups, cities });
      console.log(this.pickupForms);
      setTimeout(() => (this.isLoading = false), 700);
      // handleStatus({ status, message, that: this, successMessage });
    },
    onChangeDate(event) {
      if (!event) {
        this.onChangePickups();
      }
    },
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
      console.log(name);
      if (!name || name === "actionHiddenTextField") return;
      const names = name.split("-");
      console.log(names);
      let sIndex = "";
      if (!validator.isNumeric(names[0])) {
        this.sIndex = "";
        this.sType = "";
        return;
      }
      this.sIndex = parseInt(names[0], 10);
      this.sType = names[1];
      console.log(this.sIndex);
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
        isLocked: false,
        branchname: foundBranch.merchant.label,
        is_pickuped: "Not pick up yet"
      };
      newPickUpForm.zonesValues = this.cities
        .find(city => city.id === foundBranch.merchant.city.id)
        .zones.map(({ name }) => name);
      this.pickupForms = [newPickUpForm, ...this.pickupForms];
      this.$nextTick(() => {
        // this.$refs["0-openedBy"][0].focus();
        this.$refs["0-note"][0].focus();
      });
    },
    updatePickupFormData({ status, message, data, index, pickupForm }) {
      if (status === 1) {
        this.pickupForms.splice(index, 1, {
          ...pickupForm,
          id: data.id,
          invoiceId: data.pickup_invoice,
          createdAt: data.created_at
          //customer_id: data.sender.id
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
      console.log(this.pickupForms);
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
        console.log(foundBranch);
      } else {
        this.snackbar = true;
        this.snackbarMessage = "Please Choose A branch to continue.";
        return;
        // this.addNewCustomerForm();
      }
      this.form.merchantNameBranch = this.merchantsAutoCompletesValues[0];
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
            // this.$refs[`${this.editingRowIndex}-openedBy`][0].focus();
            this.$refs[`${this.editingRowIndex}-note`][0].focus();
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
      if (pickupForm.id) {
        console.log("its entered here");
        const { status, data, message } = (await api.putPickups(
          this,
          pickupForm
        )).data;
        console.log(data);
        this.isLoading = false;
        handleStatus({
          status,
          message,
          that: this,
          successMessage: "Created"
        });
        this.updatePickupFormData({ status, message, data, index, pickupForm });
        this.isLoading = false;
        if (status === 1) this.lockAllRows();
      } else {
        // console.log('its entered there')
        // if (index === "" || _.isEqual(this.tempForm, {}) || !this.tempForm) {
        //   return;
        // }
        // this.onEditRow();
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
      }
      this.isLoading = false;
    },
    goToDetails(pickupForm) {
      this.pickupForms.forEach(form => {
        console.log(form.isLocked);
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
        // this.$refs[`${this.sIndex}-openedBy`][0].focus();
        this.$refs[`${this.sIndex}-note`][0].focus();
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
