<template>
  <v-container fluid>
    <div @shortkey="toggleAll" v-shortkey="['ctrl', 'a']"></div>
    <div @shortkey="nextPage" v-shortkey="['ctrl', 'arrowright']"></div>
    <div @shortkey="previousPage" v-shortkey="['ctrl', 'arrowleft']"></div>
    <!-- <AppBack></AppBack> -->

    <!-- <v-layout row wrap>
      <v-flex xs11 offset-xs1>
        <h1 class="display-1 font-weight-black">
          Merchant Finance Creation - Merchant KA
        </h1>
      </v-flex>
    </v-layout>-->
    <v-layout row wrap my-3>
      <v-flex xs5 offset-xs6>
        <v-layout row wrap>
          <v-flex xs12>
            <v-layout row wrap justify-end>
              <v-btn
                color="primary lighten-1"
                large
                @click="createMerchantSheet"
                class="mr-0"
                :disabled="loading"
              >Save Merchant Sheet</v-btn>
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-layout row wrap justify-end>
              <!-- <v-btn v-print color="primary lighten-1" large class="mr-0">Print</v-btn> -->
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs2 offset-xs1>
        <v-layout align-center row wrap>
          <v-text-field
            browser-autocomplete="off"
            label="Pickup"
            name="pickup"
            @input="filterPickup"
            class="pr-3 mr-3"
          ></v-text-field>
        </v-layout>
      </v-flex>
      <v-flex xs2>
        <v-layout align-center row wrap>
          <v-text-field
            browser-autocomplete="off"
            label="Voucher"
            name="voucher"
            @input="filterVoucher"
            class="pr-3 mr-3"
          ></v-text-field>
        </v-layout>
      </v-flex>
      <v-flex xs2>
        <v-layout align-center row wrap>
          <v-autocomplete
            clearable
            label="Delivery Status"
            :items="deliveryStatuses"
            item-text="status"
            item-value="status"
            name="delivery_status"
            @change="filterDeliveryStatus"
            class="pr-3 mr-3"
          ></v-autocomplete>
        </v-layout>
      </v-flex>
      <v-flex xs2>
        <v-layout align-center row wrap>
          <v-autocomplete
            clearable
            label="Merchant"
            :items="merchants"
            item-text="name"
            item-value="id"
            name="merchant"
            v-model="merchant"
            v-validate="'required'"
            :error="!!errors.first('merchant')"
            :error-messages="errors.first('merchant')"
            @change="onChangeMerchant"
            class="pr-3 mr-3"
          ></v-autocomplete>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs1 offset-xs1 mt-1>
        <span class="subheading" @click="onselectedVouchers">
          <v-chip
            v-if="selected.length"
            text-color="primary"
            class="ml-0"
            label
            small
          >{{ selected.length }} vouchers selected</v-chip>
        </span>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex xs10 offset-xs1>
        <v-data-table
          :headers="headers"
          :items="vouchers"
          v-model="selected"
          :search="filters"
          :custom-filter="customFilter"
          :pagination.sync="pagination"
          :rows-per-page-items="[25]"
          select-all
          item-key="voucher_no"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:headers="props">
            <tr>
              <th>
                <v-checkbox
                  :input-value="props.all"
                  :indeterminate="indeterminate"
                  primary
                  hide-details
                  @click.stop="toggleAll"
                ></v-checkbox>
              </th>
              <th
                v-for="header in props.headers"
                :key="header.text"
                :class="[
                  'column sortable',
                  pagination.descending ? 'desc' : 'asc',
                  header.value === pagination.sortBy ? 'active' : ''
                ]"
                @click="changeSort(header.value)"
              >
                <v-icon small>arrow_upward</v-icon>
                {{ header.text }}
              </th>
            </tr>
          </template>
          <template v-slot:items="props">
            <tr
              :active="props.selected"
              @click="props.selected = !props.selected"
              :tabindex="props.index"
              :id="`selectedById-${props.index}`"
              @keyup.space="onCheck"
              :ref="props.index"
            >
              <td>
                <v-checkbox
                  :input-value="props.selected"
                  primary
                  hide-details
                  :id="`selectedById-${props.index}`"
                ></v-checkbox>
              </td>
              <td>{{ props.item.pickup.sender_associate.label }}</td>
              <td class="text-xs-right blue--text">
                <nuxt-link
                  target="_blank"
                  :to="`/vouchers/details?voucherId=${props.item.id}`"
                >{{ props.item.voucher_no }}</nuxt-link>
              </td>
              <td class="text-xs-right blue--text">
                <nuxt-link
                  target="_blank"
                  :to="`/pickups/${props.item.pickup.id}`"
                >{{ props.item.pickup.pickup_invoice }}</nuxt-link>
              </td>
              <td class="text-xs-right">{{ props.item.receiver.name }}</td>
              <td class="text-xs-right">{{ props.item.payment_type.name }}</td>
              <td class="text-xs-right">{{ props.item.delivery_status.status }}</td>
              <td class="text-xs-right">{{ props.item.total_delivery_amount }}</td>
              <td class="text-xs-right">{{ props.item.total_item_price }}</td>
              <td class="text-xs-right">{{ props.item.total_bus_fee }}</td>
              <td class="text-xs-right">{{ props.item.receiver_zone.name }}</td>
              <td class="text-xs-right">{{ props.item.debit_amount }}</td>
              <td class="text-xs-right">{{ props.item.credit_amount }}</td>
              <td class="text-xs-right">{{ props.item.balance }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>

    <v-layout row wrap mt-4>
      <v-flex xs3 offset-xs9>
        <v-layout mt-3>
          <v-flex xs5 class="body-2">
            Total debit
            <br />စုစုပေါင်း ကောက်ယူရန်
          </v-flex>
          <v-flex xs7>{{ totalDebit }} ks</v-flex>
        </v-layout>
        <v-layout mt-3>
          <v-flex xs5 class="body-2">
            Total credit
            <br />စုစုပေါင်း ပေးပို့ရန်
          </v-flex>
          <v-flex xs7>{{ totalCredit }} ks</v-flex>
        </v-layout>
        <v-layout mt-3>
          <v-flex xs5 class="body-2">
            Total amount
            <br />စုစုပေါင်းငွေပမာဏ
          </v-flex>
          <v-flex xs7>{{ totalAmountToCollect }} ks</v-flex>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-snackbar v-model="snackbar" bottom left :timeout="6000 * 1">
      {{ snackbarMessage }}
      <v-btn color="pink" flat @click="snackbar = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import api from "@/assets/utilities/api";
import _ from "lodash";
import validator from "validator";
import AppBack from "@/components/App/Back.vue";
import { mapGetters, mapActions } from "vuex";
import {
  handleStatus,
  handleStatusInAsyncData
} from "@/assets/utilities/helpers/common";
import localforage from "localforage";

export default {
  middleware: ["auth"],
  // layout: "clean",
  components: {
    AppBack
  },
  data() {
    return {
      loading: false,
      merchant: "",
      filters: {
        search: "",
        call_status: "",
        delivery_status: "",
        pickup_invoice: "",
        voucher_no: ""
      },
      snackbar: false,
      snackbarMessage: "",
      pagination: {
        sortBy: "id",
        descending: true
      },
      selected: [],
      vouchersId: [],
      selectedById: 0,
      rowState: null,
      headers: [
        { text: "MAssociate", value: "pickup.sender.sender_associate.label" },
        { text: "Voucher", align: "left", value: "voucher_no" },
        { text: "Pickup", value: "pickup.pickup_invoice" },
        { text: "Receiver", value: "receiver.name" },
        { text: "Payment Type", value: "payment_type.name" },
        { text: "Delivery status", value: "delivery_status.status" },
        { text: "Delivery Fee", value: "total_delivery_amount" },
        { text: "Item Fee", value: "total_item_price" },
        { text: "Bus Fee", value: "total_bus_fee" },
        { text: "Delivered City", value: "receiver_zone.name" },
        { text: "Amount to Collect", value: "debit_amount" },
        { text: "Amount to Send", value: "credit_amount" },
        { text: "Balance", value: "balance" }
      ]
    };
  },
  async asyncData(context) {
    const { "auth/jwt": jwt } = context.store.getters;
    const { $axios } = context.app;

    let responses = await Promise.all([
      localforage.getItem("stored:callStatuses"),
      localforage.getItem("stored:storeStatuses"),
      localforage.getItem("stored:deliveryStatuses")
    ]);

    let callStatuses = responses[0];
    let storeStatuses = responses[1];
    let deliveryStatuses = responses[2].filter(
      delivery_status => delivery_status.id == 8 || delivery_status.id == 9
    );

    const { data, status, message } = await api.getMerchants($axios, jwt);
    if (!handleStatusInAsyncData({ status, context })) return;
    context.store.commit(
      "title/setTitle",
      "Merchant Finance Creation - Merchant KA"
    );
    return {
      callStatuses,
      storeStatuses,
      deliveryStatuses,
      merchants: data,
      vouchers: []
    };
  },
  computed: {
    ...mapGetters({
      jwt: "auth/jwt",
      user: "auth/user"
    }),
    totalAmountToCollect() {
      let totalAmount = 0;
      this.selected.forEach(voucher => {
        totalAmount += parseInt(voucher.balance);
      });
      return totalAmount;
    },
    totalDebit() {
      let totalDebit = 0;
      this.selected.forEach(voucher => {
        totalDebit += parseInt(voucher.debit_amount);
      });
      return totalDebit;
    },
    totalCredit() {
      let totalCredit = 0;
      this.selected.forEach(voucher => {
        totalCredit += parseInt(voucher.credit_amount);
      });
      return totalCredit;
    },
    indeterminate() {
      return this.selected.length == this.vouchers.length
        ? false
        : !!this.selected.length;
    }
  },
  methods: {
    ...mapActions({
      setNavigationShow: "navigation/setShow",
      setNavigationUrl: "navigation/setUrl"
    }),
    async onChangeVouchers() {
      this.loading = true;
      const successMessage =
        "Successfully loaded vouchers for corresponding Merchants.";
      const { data, status, message } = await api.getMerchantSheetVouchers(
        this.$axios,
        this.jwt,
        this.merchant
      );

      data.forEach(data => {
        data.receiver_zone = data.receiver_zone || data.receiver_city;
      });

      this.vouchers = [...data];
      handleStatus({ status, message, that: this, successMessage });
      this.loading = false;
    },
    onChangeMerchant() {
      // this.filters = {
      //   search: "",
      //   call_status: "",
      //   delivery_status: "",
      //   pickup_invoice: "",
      //   voucher_no: ""
      // };
      this.onChangeVouchers();
    },
    onselectedVouchers() {
      this.vouchers = this.selected;
      this.filters = {
        search: "",
        call_status: "",
        delivery_status: "",
        pickup_invoice: "",
        voucher_no: ""
      };
    },
    async createMerchantSheet() {
      const isErrorFree = await this.$validator.validateAll();
      if (!isErrorFree) return;
      this.vouchersId = this.selected.map(({ id }) => id);
      const { data, message, status } = (await api.postMerchantSheet(
        this
      )).data;
      let successMessage = "Successfully assign vouchers.";

      if (status === 1 || status === 4) {
        const { data, status, message } = await api.getMerchantSheetVouchers(
          this.$axios,
          this.jwt,
          this.merchant
        );

        data.forEach(data => {
          data.receiver_zone = data.receiver_zone || data.receiver_city;
        });

        this.vouchers = [...data];
      }
      this.cleanForm();
      handleStatus({ status, message, that: this, successMessage });
    },
    cleanForm() {
      // this.merchant = '',
      // this.vouchers = [],
      this.filters = {
        search: "",
        call_status: "",
        delivery_status: "",
        pickup_invoice: "",
        voucher_no: ""
      };
      this.selected = [];
      this.vouchersData = [];
      this.$validator.reset();
    },
    toggleAll() {
      if (this.selected.length) {
        this.selected = [];
        // this.onChangeVouchers();
      } else
        this.selected = this.vouchers.filter(voucher => {
          let status = true;
          if (this.filters.pickup_invoice) {
            if (voucher.pickup.pickup_invoice != this.filters.pickup_invoice) {
              status = false;
            }
          }
          if (this.filters.voucher_no) {
            if (voucher.voucher_no != this.filters.voucher_no) {
              status = false;
            }
          }
          if (this.filters.delivery_status) {
            if (
              voucher.delivery_status.status != this.filters.delivery_status
            ) {
              status = false;
            }
          }
          return status;
        });
    },
    changeSort(column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending;
      } else {
        this.pagination.sortBy = column;
        this.pagination.descending = false;
      }
    },
    customFilter(items, filters, filter, headers) {
      const cf = new this.$MultiFilters(items, filters, filter, headers);

      cf.registerFilter("search", function(searchWord, items) {
        if (searchWord.trim() === "") return items;

        return items.filter(item => {
          return (
            item.receiver_zone.name
              .toLowerCase()
              .includes(searchWord.toLowerCase()) ||
            item.receiver.name.toLowerCase().includes(searchWord.toLowerCase())
          );
        }, searchWord);
      });

      cf.registerFilter("call_status", function(call_status, items) {
        if (call_status.trim() === "") return items;

        return items.filter(item => {
          return (
            item.call_status.status.toLowerCase() === call_status.toLowerCase()
          );
        }, call_status);
      });

      cf.registerFilter("delivery_status", function(delivery_status, items) {
        if (delivery_status.trim() === "") return items;

        return items.filter(item => {
          return (
            item.delivery_status.status.toLowerCase() ===
            delivery_status.toLowerCase()
          );
        }, delivery_status);
      });

      cf.registerFilter("pickup_invoice", function(pickup_invoice, items) {
        if (pickup_invoice.trim() === "") return items;

        return items.filter(item => {
          pickup_invoice = pickup_invoice.replace(/[(|)]/g, "");
          let pickup_match = new RegExp(pickup_invoice, "g");
          return item.pickup.pickup_invoice.match(pickup_match);
        }, pickup_invoice);
      });

      cf.registerFilter("voucher_no", function(voucher_no, items) {
        if (voucher_no.trim() === "") return items;

        return items.filter(item => {
          voucher_no = voucher_no.replace(/[(|)]/g, "");
          let voucher_match = new RegExp(voucher_no, "g");
          return item.voucher_no.match(voucher_match);
        }, voucher_no);
      });

      return cf.runFilters();
    },

    filterSearch(val = "") {
      this.filters = this.$MultiFilters.updateFilters(this.filters, {
        search: val
      });
    },
    filterCallStatus(val = "") {
      this.filters = this.$MultiFilters.updateFilters(this.filters, {
        call_status: val
      });
    },
    filterDeliveryStatus(val = "") {
      this.filters = this.$MultiFilters.updateFilters(this.filters, {
        delivery_status: val
      });
    },
    filterPickup(val = "") {
      this.filters = this.$MultiFilters.updateFilters(this.filters, {
        pickup_invoice: val
      });
    },
    filterVoucher(val = "") {
      this.filters = this.$MultiFilters.updateFilters(this.filters, {
        voucher_no: val
      });
    },
    onCheck() {},
    nextPage() {
      document.querySelector('[aria-label="Next page"]').click();
    },
    previousPage() {
      document.querySelector('[aria-label="Previous page"]').click();
    }
  },
  created() {},
  mounted() {
    this.setNavigationShow(true);
    this.setNavigationUrl("/dashboard/merchant_sheets");
  }
};
</script>
