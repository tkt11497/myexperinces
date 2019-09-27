<template>
  <v-container fluid>
    <div @shortkey="nextPage" v-shortkey="['ctrl', 'arrowright']"></div>
    <div @shortkey="previousPage" v-shortkey="['ctrl', 'arrowleft']"></div>
    <!-- <AppBack></AppBack> -->

    <!-- <v-layout row wrap>
      <v-flex xs11 offset-xs1>
        <h1 class="display-1 font-weight-black">Merchant Finance Sheet MFS</h1>
      </v-flex>
    </v-layout>-->

    <v-layout row wrap mt-3>
      <v-flex xs2 offset-xs1>
        <v-layout align-center row wrap>
          <!-- <h6 class="title">Date</h6> -->
          <!-- <v-spacer></v-spacer>
          <v-spacer></v-spacer>-->
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
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                browser-autocomplete="off"
                v-model="date"
                label="Date"
                prepend-icon="event"
                readonly
                v-on="on"
                class="pr-3 mr-3"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn flat color="primary" @click="dateMenu = false">Cancel</v-btn>
              <v-btn flat color="primary" @click="$refs.dateMenu.save(date)">OK</v-btn>
            </v-date-picker>
          </v-menu>
        </v-layout>
      </v-flex>
      <v-flex xs2>
        <v-layout align-center row wrap>
          <v-spacer></v-spacer>
          <v-autocomplete
            clearable
            label="Merchant"
            :items="merchants"
            item-text="name"
            item-value="name"
            name="merchant"
            v-model="search"
            class="pr-3 mr-3"
          ></v-autocomplete>
        </v-layout>
      </v-flex>
      <v-flex xs2 offset-xs4 mb-3>
        <v-layout justify-end>
          <v-flex xs5 offset-xs7>
            <v-layout row wrap>
              <v-flex xs12>
                <v-layout row wrap justify-end>
                  <v-btn
                    color="primary lighten-1"
                    large
                    class="mr-0"
                    to="/dashboard/merchant_sheets/new"
                  >New Merchant Sheet</v-btn>
                </v-layout>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs12>
                <v-layout row wrap justify-end>
                  <!-- <v-btn v-print color="primary lighten-1" small class="mr-0">Print</v-btn> -->
                </v-layout>
              </v-flex>
            </v-layout>
            <!-- <v-layout row wrap>
              <v-flex xs12>
                <v-layout row wrap justify-end>
                  <download-excel
                    :data="merchantSheets"
                    :fields="excelHeaders"
                    class="v-btn mr-0 v-btn--small primary lighten-1"
                  >Export</download-excel>
                </v-layout>
              </v-flex>
            </v-layout>-->
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs10 offset-xs1>
        <v-data-table
          :headers="headers"
          :items="merchantSheets"
          :search="search"
          :pagination.sync="pagination"
          :rows-per-page-items="[25]"
          class="elevation-1"
        >
          <template v-slot:items="props">
            <tr>
              <td class="blue--text">
                <nuxt-link
                  target="_blank"
                  :to="`/dashboard/merchant_sheets/${props.item.id}`"
                >{{ props.item.merchantsheet_invoice }}</nuxt-link>
              </td>
              <td>{{ props.item.qty }}</td>
              <td>{{ props.item.merchant.name }}</td>
              <td>{{ props.item.merchant.name }}</td>
              <td>
                <v-chip
                  :color="toggleColor(props.item.is_paid)"
                  class="ml-0"
                  small
                >{{ !props.item.is_paid ? "Unpaid" : "Paid" }}</v-chip>
              </td>
            </tr>
          </template>
        </v-data-table>
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
      search: "",
      date: new Date().toISOString().substr(0, 10),
      dateMenu: false,
      snackbar: false,
      snackbarMessage: "",
      // pagination: {
      //   sortBy: "voucher_no"
      // },
      pagination: {
        sortBy: "id",
        descending: true
      },
      headers: [
        { text: "Merchant Sheet", value: "merchantsheet_invoice" },
        { text: "Vouchers", value: "qty" },
        { text: "Merchant", value: "merchant.name" },
        { text: "Branch", value: "merchant.name" },
        { text: "Payment Status", value: "is_paid" }
      ],
      excelHeaders: {
        "Merchant Sheet": "merchantsheet_invoice",
        Vouchers: "qty",
        Merchant: "merchant.name",
        Branch: "merchant.name",
        "Payment Status": {
          field: "is_paid",
          callback: is_paid => (!is_paid ? "Unpaid" : "Paid")
        }
      }
    };
  },
  async asyncData(context) {
    const { "auth/jwt": jwt } = context.store.getters;
    const { $axios } = context.app;

    let responses = await Promise.all([
      await api.getMerchants($axios, jwt),
      await api.getMerchantSheets(
        $axios,
        jwt,
        new Date().toISOString().substr(0, 10)
      )
    ]);

    responses.forEach(response => {
      if (!handleStatusInAsyncData({ status: response.status, context }))
        return;
    });

    let merchants = responses[0].data;
    let merchantSheets = responses[1].data;
    context.store.commit("title/setTitle", "Merchant Finance Sheet MFS");
    return {
      merchants,
      merchantSheets
    };
  },
  computed: {
    ...mapGetters({
      jwt: "auth/jwt",
      user: "auth/user"
    })
  },
  methods: {
    ...mapActions({
      setNavigationShow: "navigation/setShow",
      setNavigationUrl: "navigation/setUrl"
    }),
    async onChangeMerchantSheet() {
      const successMessage =
        "Successfully loaded MerchantSheets for corresponding Date.";
      const { data, status, message } = await api.getMerchantSheets(
        this.$axios,
        this.jwt,
        this.date
      );

      this.merchantSheets = [...data];
      handleStatus({ status, message, that: this, successMessage });
    },
    onChangeDate(event) {
      if (!event) {
        this.onChangeMerchantSheet();
      }
    },
    onCheck() {},
    // onEditMerchantSheet(id, closed) {
    //   // if (closed == 0 || closed == 1) return;
    //   this.$router.push("/dashboard/merchant_sheets/" + id);
    // },
    toggleColor(item) {
      return item == 0 ? "red lighten-4" : "teal lighten-4";
    },
    nextPage() {
      document.querySelector('[aria-label="Next page"]').click();
    },
    previousPage() {
      document.querySelector('[aria-label="Previous page"]').click();
    }
  },
  created() {},
  mounted() {
    this.setNavigationShow(false);
    this.setNavigationUrl("");
  }
};
</script>
